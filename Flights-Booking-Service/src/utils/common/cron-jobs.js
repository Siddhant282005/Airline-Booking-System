const cron=require('node-cron');

function scheduleCrons(){
    // Run every 30 minutes at second 0
    cron.schedule('0 */30 * * * *',async ()=>{
        // Lazy load BookingService to avoid circular dependency
        const {BookingService}=require('../../services');
        await BookingService.cancelOldBookings();
    });
}

// Export the function without invoking it so callers can start crons explicitly
module.exports = scheduleCrons;