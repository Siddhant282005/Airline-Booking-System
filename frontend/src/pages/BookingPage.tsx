import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { flightService, bookingService } from '@/services';
import { useAuthStore } from '@/store';
import { Flight, Seat } from '@/types';
import { SeatSelection } from '@/components/SeatSelection';
import { formatDateTime, formatCurrency, getFlightDuration, generateIdempotencyKey } from '@/utils/helpers';
import { Plane, Calendar, MapPin, Users, CreditCard } from 'lucide-react';
import { ROUTES } from '@/utils/constants';
import { toast } from '@/store/toastStore';

export const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [seatsLoading, setSeatsLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { navigate(ROUTES.LOGIN); return; }
    if (id) { loadFlight(Number(id)); loadSeats(Number(id)); }
  }, [id, isAuthenticated]);

  const loadFlight = async (flightId: number) => {
    try { const r = await flightService.getFlight(flightId); setFlight(r.data); }
    catch { toast.error('Failed to load flight details'); }
    finally { setLoading(false); }
  };

  const loadSeats = async (flightId: number) => {
    try { const r = await flightService.getAvailableSeatsForFlight(flightId); setSeats(r.data); }
    catch { toast.error('Failed to load seats'); }
    finally { setSeatsLoading(false); }
  };

  const handleSeatSelect = (seatId: number) => {
    setSelectedSeatIds((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const handleBooking = async () => {
    if (!flight || !user) return;
    if (selectedSeatIds.length === 0) {
      toast.warning('Select Seats', 'Please select at least one seat');
      return;
    }
    try {
      setBookingLoading(true);
      const bookingResponse = await bookingService.createBooking({
        flightId: flight.id, userId: user.id, noOfSeats: selectedSeatIds.length, seatIds: selectedSeatIds,
      });
      if (bookingResponse.success) {
        const booking = bookingResponse.data;
        const idempotencyKey = generateIdempotencyKey();
        const paymentResponse = await bookingService.makePayment(
          { bookingId: booking.id, userId: user.id, totalCost: booking.totalCost, userEmail: user.email },
          idempotencyKey
        );
        if (paymentResponse.success) {
          navigate(ROUTES.BOOKING_CONFIRMATION, {
            state: { booking: paymentResponse.data, flight: flight, seats: selectedSeatIds.length },
          });
        }
      }
    } catch (error: any) {
      toast.error('Booking Failed', error.response?.data?.error?.explanation || 'Please try again.');
    } finally { setBookingLoading(false); }
  };

  if (loading || seatsLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-slate-400">Loading flight details...</div></div>;
  }
  if (!flight) {
    return <div className="p-8 text-center text-slate-400">Flight not found</div>;
  }

  const totalCost = flight.price * selectedSeatIds.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold mb-6 text-white"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      >
        Complete Your <span className="text-gradient-gold">Booking</span>
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flight Details + Seat Selection */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Flight Details</h2>
            <div className="space-y-3">
              <div className="flex items-center text-slate-200">
                <Plane className="h-5 w-5 text-gold-400 mr-3" />
                <span className="font-semibold text-gold-400">{flight.flightNumber}</span>
              </div>
              <div className="flex items-center text-slate-200">
                <MapPin className="h-5 w-5 text-sky-400 mr-3" />
                <span>{flight.departureAirport?.name} → {flight.arrivalAirport?.name}</span>
              </div>
              <div className="flex items-start text-slate-200">
                <Calendar className="h-5 w-5 text-sky-400 mr-3 mt-0.5" />
                <div>
                  <div>Departure: {formatDateTime(flight.departureTime)}</div>
                  <div>Arrival: {formatDateTime(flight.arrivalTime)}</div>
                  <div className="text-sm text-slate-400 mt-1">Duration: {getFlightDuration(flight.departureTime, flight.arrivalTime)}</div>
                </div>
              </div>
              <div className="flex items-center text-slate-200">
                <Users className="h-5 w-5 text-sky-400 mr-3" />
                <span>{flight.totalSeats} seats available</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Select Your Seats</h2>
            <SeatSelection seats={seats} selectedSeatIds={selectedSeatIds} onSeatSelect={handleSeatSelect} maxSeats={9} />
          </motion.div>
        </div>

        {/* Booking Summary */}
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-strong p-6 rounded-2xl sticky top-24">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <CreditCard size={18} className="text-gold-400" /> Booking Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Price per seat:</span>
                <span className="text-white">{formatCurrency(flight.price)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Number of seats:</span>
                <span className="text-white">{selectedSeatIds.length}</span>
              </div>
              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span className="text-white">Total:</span>
                  <span className="text-gold-400">{formatCurrency(totalCost)}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={selectedSeatIds.length === 0 || bookingLoading}
                className="w-full btn-primary py-3 mt-4"
              >
                {bookingLoading ? 'Processing...' : 'Confirm Booking & Pay'}
              </button>

              <p className="text-xs text-slate-500 text-center mt-3">
                By clicking &quot;Confirm Booking&quot;, you agree to our terms and conditions
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
