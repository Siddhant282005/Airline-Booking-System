import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loading } from '@/components/common/Loading';
import { useAuthStore } from '@/store/authStore';
import { bookingService } from '@/services';
import { bookingApi } from '@/services/api';
import { Booking } from '@/types';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { ROUTES } from '@/utils/constants';
import { Plane, X } from 'lucide-react';
import { toast } from '@/store/toastStore';

const badgeClass = (status: string) => {
  switch (status.toUpperCase()) {
    case 'BOOKED':
      return 'badge-booked';
    case 'CANCELLED':
      return 'badge-cancelled';
    case 'PENDING':
      return 'badge-pending';
    case 'INITIATED':
      return 'badge-initiated';
    default:
      return 'badge-pending';
  }
};

const canCancel = (status: string) =>
  ['BOOKED', 'INITIATED', 'PENDING'].includes(status.toUpperCase());

export const MyBookingsPage = () => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings(user.id);
      if (response.success) {
        setBookings(response.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancel = async () => {
    if (!cancelId || !user) return;
    try {
      setCancelling(true);
      await bookingApi.patch('/api/v1/bookings/' + cancelId + '/cancel', { userId: user.id });
      toast.success('Booking cancelled successfully');
      setCancelId(null);
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 1rem 4rem' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1
            className="text-gradient-gold"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            My Bookings
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>View and manage your flight bookings</p>
        </motion.div>

        {/* Empty state */}
        {bookings.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ textAlign: 'center', padding: '3rem 2rem', borderRadius: 16 }}
          >
            <Plane size={56} style={{ color: 'var(--text-muted)', marginBottom: 16, opacity: 0.5 }} />
            <h2
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '1.3rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 8,
              }}
            >
              No bookings yet
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Start your journey by booking a flight
            </p>
            <Link to={ROUTES.FLIGHTS}>
              <button className="btn-primary">Search Flights</button>
            </Link>
          </motion.div>
        )}

        {/* Booking cards */}
        {bookings.map((booking, i) => (
          <motion.div
            key={booking.id}
            className="glass-card"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{ borderRadius: 14, padding: '1.5rem', marginBottom: '1rem' }}
          >
            {/* Top row: ID + status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem' }}>
                  Booking #{booking.id}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  Booked on {formatDate(booking.createdAt)}
                </p>
              </div>
              <span className={badgeClass(booking.status)}>{booking.status}</span>
            </div>

            {/* Details row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
                marginBottom: canCancel(booking.status) ? '1rem' : 0,
              }}
            >
              <DetailBox label="Flight ID" value={String(booking.flightId)} />
              <DetailBox label="Seats" value={String(booking.noOfSeats)} />
              <DetailBox label="Total Cost" value={formatCurrency(booking.totalCost)} gold />
            </div>

            {/* Cancel button */}
            {canCancel(booking.status) && (
              <button
                className="btn-danger"
                onClick={() => setCancelId(booking.id)}
                style={{ fontSize: '0.82rem', padding: '6px 16px' }}
              >
                Cancel Booking
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Cancel confirm modal (overlay) */}
      {cancelId !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => !cancelling && setCancelId(null)}
        >
          <motion.div
            className="glass-strong"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 400,
              borderRadius: 16,
              padding: '2rem',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <button
              onClick={() => !cancelling && setCancelId(null)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(239,68,68,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <X size={28} style={{ color: '#ef4444' }} />
            </div>

            <h3
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: '1.2rem',
                color: 'var(--text-primary)',
                marginBottom: 8,
              }}
            >
              Cancel Booking #{cancelId}?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              This action cannot be undone. Are you sure you want to cancel this booking?
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                className="btn-secondary"
                onClick={() => setCancelId(null)}
                disabled={cancelling}
                style={{ flex: 1 }}
              >
                Keep Booking
              </button>
              <button
                className="btn-danger"
                onClick={handleCancel}
                disabled={cancelling}
                style={{ flex: 1 }}
              >
                {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

/* ---------- helper ---------- */
function DetailBox({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 10,
        padding: '0.75rem 1rem',
      }}
    >
      <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: 2 }}>{label}</p>
      <p
        style={{
          color: gold ? 'var(--accent-gold)' : 'var(--text-primary)',
          fontWeight: 600,
          fontSize: gold ? '1.1rem' : '0.95rem',
        }}
      >
        {value}
      </p>
    </div>
  );
}
