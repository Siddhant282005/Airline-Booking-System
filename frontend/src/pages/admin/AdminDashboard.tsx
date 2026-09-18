import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { flightService } from '@/services';
import { Plane, MapPin, Building2, Settings, PlaneTakeoff, Users } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const statCards = [
  { key: 'flights', label: 'Total Flights', icon: PlaneTakeoff, color: 'text-sky-400', bg: 'rgba(14,165,233,0.15)', border: 'rgba(14,165,233,0.3)' },
  { key: 'cities', label: 'Total Cities', icon: MapPin, color: 'text-emerald-400', bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.3)' },
  { key: 'airports', label: 'Total Airports', icon: Building2, color: 'text-violet-400', bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.3)' },
  { key: 'airplanes', label: 'Total Airplanes', icon: Settings, color: 'text-gold-400', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
];

const quickLinks = [
  { to: ROUTES.ADMIN_FLIGHTS, label: 'Manage Flights', icon: Plane, desc: 'Add, edit and schedule flights' },
  { to: ROUTES.ADMIN_CITIES, label: 'Manage Cities', icon: MapPin, desc: 'Add and manage city destinations' },
  { to: ROUTES.ADMIN_AIRPORTS, label: 'Manage Airports', icon: Building2, desc: 'Configure airport terminals' },
  { to: ROUTES.ADMIN_AIRPLANES, label: 'Manage Airplanes', icon: Settings, desc: 'Fleet and aircraft management' },
  { to: '/admin/users', label: 'Manage Users', icon: Users, desc: 'User accounts and role assignment' },
];

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ flights: 0, cities: 0, airports: 0, airplanes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [flights, cities, airports, airplanes] = await Promise.all([
        flightService.getAllFlights(),
        flightService.getAllCities(),
        flightService.getAllAirports(),
        flightService.getAllAirplanes(),
      ]);
      setStats({
        flights: flights.data.length,
        cities: cities.data.length,
        airports: airports.data.length,
        airplanes: airplanes.data.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">Overview of your airline operations</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{card.label}</p>
                <motion.p
                  className="text-3xl font-bold text-white mt-1"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.3 + i * 0.1 }}
                >
                  {loading ? '...' : stats[card.key as keyof typeof stats]}
                </motion.p>
              </div>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: card.bg, border: `1px solid ${card.border}` }}
              >
                <card.icon className={card.color} size={22} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                className="glass-card p-5 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                  >
                    <link.icon size={18} className="text-gold-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm group-hover:text-gold-400 transition-colors">
                      {link.label}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">{link.desc}</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
