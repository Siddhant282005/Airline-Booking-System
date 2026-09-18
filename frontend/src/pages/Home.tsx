import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Search, CalendarCheck, MapPin, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/utils/constants';
import { useAuthStore } from '@/store';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay },
});

const stats = [
  { icon: Plane, label: 'Flights Daily', value: '200+' },
  { icon: MapPin, label: 'Destinations', value: '120+' },
  { icon: Users, label: 'Happy Travellers', value: '50K+' },
];

const actions = [
  {
    to: ROUTES.FLIGHTS,
    icon: Search,
    title: 'Search Flights',
    desc: 'Find and compare the best fares across hundreds of routes.',
    btn: 'btn-primary',
  },
  {
    to: ROUTES.MY_BOOKINGS,
    icon: CalendarCheck,
    title: 'My Bookings',
    desc: 'View, manage, or cancel your upcoming flights.',
    btn: 'btn-sky',
  },
  {
    to: ROUTES.FLIGHTS,
    icon: MapPin,
    title: 'Explore',
    desc: 'Discover trending destinations and exclusive deals.',
    btn: 'btn-secondary',
  },
];

export const Home: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '0 1rem 4rem' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '3rem' }}>
        <motion.h1
          {...fadeUp(0)}
          className="text-gradient-gold"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {user ? `Welcome back` : 'Welcome to Smart Sky'}
        </motion.h1>

        {user && (
          <motion.p {...fadeUp(0.1)} style={{ color: 'var(--accent-gold)', fontSize: '1.1rem', marginBottom: 4 }}>
            {user.email}
          </motion.p>
        )}

        <motion.p {...fadeUp(0.15)} style={{ color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto', fontSize: '1rem' }}>
          Book flights to destinations worldwide with the best prices and a seamless experience.
        </motion.p>
      </section>

      {/* Quick Actions */}
      <section style={{ maxWidth: 1000, margin: '0 auto', marginBottom: '3.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {actions.map((a, i) => (
            <motion.div key={a.title} {...fadeUp(0.2 + i * 0.1)}>
              <Link to={a.to} style={{ textDecoration: 'none' }}>
                <div
                  className="glass-card"
                  style={{
                    padding: '2rem 1.5rem',
                    borderRadius: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    height: '100%',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(212,175,55,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'rgba(212,175,55,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <a.icon size={24} style={{ color: 'var(--accent-gold)' }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {a.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', flex: 1 }}>{a.desc}</p>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      color: 'var(--accent-gold)',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    Go <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          {...fadeUp(0.5)}
          className="glass-strong"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <s.icon size={28} style={{ color: 'var(--accent-gold)', marginBottom: 8 }} />
              <p
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: '1.6rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {s.value}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};
