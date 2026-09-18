import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loading } from '@/components/common/Loading';
import { ROUTES } from '@/utils/constants';
import { useAuthStore } from '@/store/authStore';
import { Flight, Booking } from '@/types';
import { formatCurrency, formatDate, formatTime } from '@/utils/helpers';
import { CheckCircle, Plane, Info } from 'lucide-react';

export const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Get booking details from navigation state
  const bookingData = location.state as {
    booking: Booking;
    flight: Flight;
    seats: number;
  } | null;

  useEffect(() => {
    if (!bookingData) {
      navigate(ROUTES.FLIGHTS, { replace: true });
    } else {
      setLoading(false);
    }
  }, [bookingData, navigate]);

  if (loading || !bookingData) {
    return <Loading fullScreen />;
  }

  const { booking, flight, seats } = bookingData;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              boxShadow: '0 0 40px rgba(34,197,94,0.3)',
            }}
          >
            <motion.div
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <CheckCircle size={40} style={{ color: '#fff' }} />
            </motion.div>
          </motion.div>

          <h1
            className="text-gradient-gold"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Booking Confirmed! 🎉
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Your flight has been successfully booked
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
            A confirmation email has been sent to <strong style={{ color: 'var(--text-secondary)' }}>{user?.email}</strong>
          </p>
        </motion.div>

        {/* Booking details glass card */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ borderRadius: 14, overflow: 'hidden', marginBottom: '1.5rem' }}
        >
          {/* Card header */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(99,102,241,0.2))',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h2
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              Booking Details
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Booking ID: #{booking.id}</p>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {/* Flight info */}
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plane size={16} /> Flight Information
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                background: 'rgba(255,255,255,0.03)',
                padding: '1rem',
                borderRadius: 10,
                marginBottom: '1.5rem',
              }}
            >
              <InfoItem label="Flight Number" value={flight.flightNumber} />
              <InfoItem label="Airplane" value={flight.airplaneDetail?.modelNumber || 'N/A'} />
              <InfoItem label="From" value={`${flight.departureAirport?.name || 'N/A'} (${flight.departureAirport?.code || ''})`} />
              <InfoItem label="To" value={`${flight.arrivalAirport?.name || 'N/A'} (${flight.arrivalAirport?.code || ''})`} />
              <InfoItem label="Departure" value={`${formatDate(flight.departureTime)} · ${formatTime(flight.departureTime)}`} />
              <InfoItem label="Arrival" value={`${formatDate(flight.arrivalTime)} · ${formatTime(flight.arrivalTime)}`} />
            </div>

            {/* Booking summary */}
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>
              Booking Summary
            </h3>
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '1rem',
                borderRadius: 10,
                marginBottom: '1.5rem',
              }}
            >
              <SummaryRow label="Number of Seats" value={String(seats)} />
              <SummaryRow label="Price per Seat" value={formatCurrency(flight.price)} />
              <SummaryRow label="Status" value={booking.status} isBadge />
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Total Paid</span>
                <span style={{ color: 'var(--accent-gold)', fontSize: '1.35rem', fontWeight: 700 }}>{formatCurrency(booking.totalCost)}</span>
              </div>
            </div>

            {/* Passenger */}
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>
              Passenger Information
            </h3>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 10 }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Email Address</p>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Important info */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ padding: '1.25rem 1.5rem', borderRadius: 12, marginBottom: '1.5rem', borderLeft: '3px solid var(--accent-gold)' }}
        >
          <h3 style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Info size={16} /> Important Information
          </h3>
          <ul style={{ color: 'var(--text-muted)', fontSize: '0.84rem', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <li>• Check your email for the booking confirmation and e-ticket</li>
            <li>• Arrive at the airport at least 2 hours before departure</li>
            <li>• Carry a valid government-issued ID for check-in</li>
            <li>• View this booking anytime in "My Bookings"</li>
          </ul>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <button
            className="btn-primary"
            onClick={() => navigate(ROUTES.MY_BOOKINGS)}
            style={{ flex: 1, minWidth: 180 }}
          >
            View My Bookings
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate(ROUTES.FLIGHTS)}
            style={{ flex: 1, minWidth: 180 }}
          >
            Search More Flights
          </button>
        </motion.div>
      </div>
    </div>
  );
};

/* ---------- helper components ---------- */
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{label}</p>
      <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>{value}</p>
    </div>
  );
}

function SummaryRow({ label, value, isBadge }: { label: string; value: string; isBadge?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</span>
      {isBadge ? (
        <span className="badge-booked" style={{ fontSize: '0.75rem' }}>{value}</span>
      ) : (
        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{value}</span>
      )}
    </div>
  );
}
