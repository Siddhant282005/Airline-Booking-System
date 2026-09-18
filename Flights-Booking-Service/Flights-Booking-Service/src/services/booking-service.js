const axios=require('axios');
const {StatusCodes}=require('http-status-codes');
const {BookingRepository, BookingSeatRepository}=require('../repositories');
const db=require('../models');
const AppError = require('../utils/errors/app-error');
const {ServerConfig,Queue}=require('../config');
const {Enums}=require('../utils/common');
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;
const bookingRepository=new BookingRepository();
const bookingSeatRepository=new BookingSeatRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        const flightData = flight.data.data;
        
        // Handle seat-based booking
        if (data.seatIds && data.seatIds.length > 0) {
            console.log('🎫 Booking seats:', data.seatIds, 'for flight:', data.flightId);
            
            // Book specific seats
            const seatBookingResult = await axios.post(`${ServerConfig.FLIGHT_SERVICE}/api/v1/seats/book`, {
                seatIds: data.seatIds,
                flightId: data.flightId
            });
            
            console.log('✅ Seat booking result:', seatBookingResult.data);
            
            if (seatBookingResult.data.data[0] === 0) {
                throw new AppError('Selected seats are not available', StatusCodes.BAD_REQUEST);
            }
            
            const totalBillingAmount = data.seatIds.length * flightData.price;
            const bookingPayload = {...data, noOfSeats: data.seatIds.length, totalCost: totalBillingAmount };
            const booking = await bookingRepository.createBooking(bookingPayload, transaction);
            
            // Create booking-seat associations
            const bookingSeats = data.seatIds.map(seatId => ({
                bookingId: booking.id,
                seatId: seatId
            }));
            await bookingSeatRepository.createBulk(bookingSeats, transaction);
            
            // Update flight totalSeats
            await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
                seats: data.seatIds.length,
                dec: 1
            });
            
            await transaction.commit();
            return booking;
        } else {
            // Legacy: Book number of seats without selection
            if(data.noOfSeats > flightData.totalSeats) {
                throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
            }
            const totalBillingAmount= data.noOfSeats * flightData.price;
            const bookingPayload = {...data, totalCost: totalBillingAmount };
            const booking = await bookingRepository.createBooking(bookingPayload, transaction);
           
            const response=await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`,{
                seats: data.noOfSeats
            });
            await transaction.commit();
            return booking;
        }
    } catch(error) {
        await transaction.rollback();
        throw error;
    }
}

async function makePayment(data){
    // 1) Load booking without a transaction
    const bookingDetails = await bookingRepository.get(data.bookingId);

    // 2) Quick guards that don't need a transaction
    if (bookingDetails.status === CANCELLED) {
        throw new AppError('Cannot make payment for a cancelled booking', StatusCodes.BAD_REQUEST);
    }

    const expectedAmount = Number(bookingDetails.totalCost);
    const paidAmount = Number(data.totalCost);
    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();

    // Expiry check: if expired, persist cancellation WITHOUT a transaction, then error out
    if ((currentTime - bookingTime) > 300000) { // 5 minutes in ms
        // Persist cancellation immediately so it isn't rolled back by any external call failures
        await bookingRepository.update(data.bookingId, { status: CANCELLED });
        // Best-effort: try to return seats to flight service (don't block cancellation on this)
        try {
            await cancelBooking(data.bookingId);
        } catch (e) {
            // swallow to ensure we still report expiry; consider logging in a real app
        }
        throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
    }

    if (Number.isNaN(paidAmount) || paidAmount !== expectedAmount) {
        throw new AppError('Amount of payment doesnt match', StatusCodes.BAD_REQUEST);
    }

    // Ensure the user making the payment owns the booking
    if (Number(bookingDetails.userId) !== Number(data.userId)) {
        throw new AppError('User corresponding to this booking does not match', StatusCodes.UNAUTHORIZED);
    }

    // 3) Proceed to mark as BOOKED inside a transaction
    const transaction = await db.sequelize.transaction();
    try {
        const response = await bookingRepository.update(
            data.bookingId,
            { status: BOOKED },
            transaction
        );
        // Send message to notification service via RabbitMQ
        Queue.sendData({
            bookingId: data.bookingId,
            userId: data.userId,
            recipientEmail: data.userEmail,
            message: `Your booking with id ${data.bookingId} has been successfully confirmed.`
        });
        await transaction.commit();
        return response;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
async function cancelBooking(bookingId) {
    // Fetch first to decide whether any work is needed
    const pre = await bookingRepository.get(bookingId);

    // Never cancel a BOOKED booking
    if (pre.status === BOOKED) {
        return { skipped: true, reason: 'BOOKED' };
    }

    // Idempotent: if already CANCELLED, skip
    if (pre.status === CANCELLED) {
        return { skipped: true, reason: 'ALREADY_CANCELLED' };
    }

    const transaction = await db.sequelize.transaction();
    try {
        // Re-read within the transaction to avoid races
        const bookingDetails = await bookingRepository.get(bookingId, transaction);

        // Double-check status after entering transaction
        if (bookingDetails.status === BOOKED) {
            await transaction.rollback();
            return { skipped: true, reason: 'BOOKED' };
        }
        if (bookingDetails.status === CANCELLED) {
            await transaction.rollback();
            return { skipped: true, reason: 'ALREADY_CANCELLED' };
        }

        // Check if this booking has specific seats associated
        const bookingSeats = await bookingSeatRepository.getByBookingId(bookingId);
        
        if (bookingSeats && bookingSeats.length > 0) {
            // Unbook the specific seats
            const seatIds = bookingSeats.map(bs => bs.seatId);
            await axios.post(`${ServerConfig.FLIGHT_SERVICE}/api/v1/seats/unbook`, {
                seatIds: seatIds
            });
            
            // Delete booking-seat associations
            await bookingSeatRepository.deleteByBookingId(bookingId);
        }

        // Return seats back to flight inventory; use the correct seats count from booking
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
            seats: Number(bookingDetails.noOfSeats),
            dec: 0 // dec=0 -> increase seats back
        });

        // Update booking status to CANCELLED
        await bookingRepository.update(bookingId, { status: CANCELLED }, transaction);

        await transaction.commit();
        return { skipped: false, status: CANCELLED };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}


async function cancelOldBookings(){
    try{
        const currentTime=new Date(Date.now()-1000*300); // 5 minutes ago
        const candidates = await bookingRepository.cancelOldBookings(currentTime);
        for (const booking of candidates) {
            await cancelBooking(booking.id);
        }
        return { processed: candidates.length };
    }catch(error){
        throw error;
    }
}

async function getUserBookings(userId) {
    return bookingRepository.getByUserId(userId);
}

module.exports = {
    createBooking,
    makePayment,
    getUserBookings,
    cancelBooking,
    cancelOldBookings
}