import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { ROUTES } from '@/utils/constants';
import { LayoutDashboard, PlaneTakeoff, Building2, MapPin, Settings, LogOut, Users, Plane } from 'lucide-react';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/flights', label: 'Flights', icon: PlaneTakeoff },
  { to: '/admin/cities', label: 'Cities', icon: MapPin },
  { to: '/admin/airports', label: 'Airports', icon: Building2 },
  { to: '/admin/airplanes', label: 'Airplanes', icon: Settings },
  { to: '/admin/users', label: 'Users', icon: Users },
];

export const AdminLayout: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logout(); navigate(ROUTES.WELCOME); };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="p-6 border-b border-white/10">
          <Link to={ROUTES.WELCOME} className="flex items-center gap-2">
            <Plane className="text-gold-400" size={24} />
            <span className="font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}><span className="text-white">Smart</span><span className="text-gradient-gold"> Sky</span></span>
          </Link>
          <p className="text-slate-500 text-xs mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const active = link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to) && location.pathname !== '/admin';
            return (
              <Link key={link.to} to={link.to} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'text-gold-400 bg-gold-500/10 border border-gold-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <link.icon size={18} />{link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={18} />Logout</button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto" style={{ background: 'transparent' }}><Outlet /></main>
    </div>
  );
};
export default AdminLayout;
