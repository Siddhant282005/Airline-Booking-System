import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/utils/constants';
import { Menu, X, LogOut, Plane, BookOpen, Home, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate(ROUTES.LOGIN); };

  const navLinks = isAuthenticated
    ? [
        { to: ROUTES.HOME, label: 'Home', icon: <Home size={16} /> },
        { to: ROUTES.FLIGHTS, label: 'Flights', icon: <Search size={16} /> },
        { to: ROUTES.MY_BOOKINGS, label: 'My Bookings', icon: <BookOpen size={16} /> },
      ]
    : [
        { to: ROUTES.HOME, label: 'Home', icon: <Home size={16} /> },
        { to: ROUTES.FLIGHTS, label: 'Flights', icon: <Search size={16} /> },
      ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'nav-glass shadow-lg' : 'bg-transparent'}`}
        style={{ height: '70px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link to={ROUTES.WELCOME} className="flex items-center gap-2 group">
            <Plane className="text-gold-400 group-hover:text-gold-300 transition-colors" size={26} />
            <span className="font-bold text-xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="text-white">Smart</span>
              <span className="text-gradient-gold"> Sky</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to) ? 'text-gold-400 bg-gold-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}{link.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-slate-400 text-sm hidden lg:block">{user?.email}</span>
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut size={15} />Logout
                </button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white">Sign In</Link>
                <Link to={ROUTES.SIGNUP} className="btn-primary text-sm px-5 py-2">Get Started</Link>
              </>
            )}
          </div>
          <button className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="fixed top-0 right-0 bottom-0 w-72 z-50 md:hidden" style={{ background: 'rgba(13,21,38,0.97)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <span className="font-bold text-lg text-gradient-gold">Smart Sky</span>
                <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
              <div className="p-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.to) ? 'text-gold-400 bg-gold-500/10 border border-gold-500/20' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                    {link.icon}{link.label}
                  </Link>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                {isAuthenticated ? (
                  <><p className="text-slate-500 text-xs mb-3 px-2 truncate">{user?.email}</p>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10"><LogOut size={15} /> Logout</button></>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to={ROUTES.LOGIN} className="btn-secondary text-center text-sm py-3">Sign In</Link>
                    <Link to={ROUTES.SIGNUP} className="btn-primary text-center text-sm py-3">Get Started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div style={{ height: '70px' }} />
    </>
  );
};
export default Navbar;
