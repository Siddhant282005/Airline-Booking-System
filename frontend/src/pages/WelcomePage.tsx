import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Shield, Users, MapPin, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const planes = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      top: 10 + i * 20, delay: i * 2, duration: 12 + i * 3, size: 16 + i * 2, opacity: 0.06 + i * 0.02,
    })), []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {planes.map((p, i) => (
        <motion.div key={i} className="absolute text-white pointer-events-none" style={{ top: `${p.top}%`, opacity: p.opacity }}
          initial={{ x: '-5%' }} animate={{ x: '105vw' }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}>
          <Plane size={p.size} />
        </motion.div>
      ))}
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl w-full text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <Plane size={16} className="text-gold-400" />
              <span className="text-gold-400 text-sm font-medium">Premium Air Travel</span>
            </motion.div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.1 }}>
              <span className="text-white">Welcome to </span>
              <span className="text-gradient-gold">Smart Sky</span>
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">Your premium gateway to seamless air travel. Book flights, manage bookings, and explore destinations worldwide.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
            <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} onClick={() => navigate(ROUTES.HOME)} className="glass-card p-8 cursor-pointer group text-left">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.2), rgba(99,102,241,0.2))', border: '1px solid rgba(14,165,233,0.3)' }}>
                <Plane className="text-sky-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>User Portal</h3>
              <p className="text-slate-400 text-sm mb-4">Search flights, book seats, and manage your travel itinerary with ease.</p>
              <span className="text-sky-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Enter Portal <ArrowRight size={14} /></span>
            </motion.div>
            <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }} onClick={() => navigate(ROUTES.ADMIN_LOGIN)} className="glass-card p-8 cursor-pointer group text-left">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.2))', border: '1px solid rgba(245,158,11,0.3)' }}>
                <Shield className="text-gold-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Admin Portal</h3>
              <p className="text-slate-400 text-sm mb-4">Manage flights, fleet, airports, and airline operations from one dashboard.</p>
              <span className="text-gold-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Admin Access <ArrowRight size={14} /></span>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex justify-center gap-12 sm:gap-20">
            {[{ icon: <MapPin size={18} />, value: '50+', label: 'Destinations' }, { icon: <Plane size={18} />, value: '200+', label: 'Daily Flights' }, { icon: <Users size={18} />, value: '10K+', label: 'Happy Travelers' }].map((s, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-2 text-gold-400 mb-1">{s.icon}<span className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.value}</span></div>
                <span className="text-slate-500 text-sm">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      <div className="text-center py-6 border-t border-white/5"><p className="text-slate-600 text-sm">&copy; 2024 Smart Sky Airlines. All rights reserved.</p></div>
    </div>
  );
};
export default WelcomePage;
