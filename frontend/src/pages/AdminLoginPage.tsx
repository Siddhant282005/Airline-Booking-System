import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store';
import { Shield, Mail, Lock, Eye, ChevronLeft } from 'lucide-react';
import { ROUTES, STORAGE_KEYS } from '@/utils/constants';
import { apiGateway } from '@/services/api';
import { authService } from '@/services/authService';
import { toast } from '@/store/toastStore';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await apiGateway.post('/api/v1/user/signin', { email, password });
      const { token } = response.data.data;
      const decoded = authService.decodeToken(token);
      if (!decoded) { toast.error('Login Failed', 'Unable to verify credentials.'); return; }
      if (decoded.role !== 'admin') { toast.error('Access Denied', 'This account does not have admin privileges.'); return; }
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(decoded));
      setUser(decoded);
      toast.success('Welcome back, Admin!', 'Redirecting to dashboard...');
      navigate(ROUTES.ADMIN);
    } catch (err: any) {
      const message = err?.response?.data?.error?.explanation?.[0] || err?.response?.data?.message || 'Invalid credentials.';
      toast.error('Login Failed', message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative w-full max-w-md">
        <motion.button onClick={() => navigate(ROUTES.WELCOME)} className="absolute -top-14 left-0 flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm" whileHover={{ x: -4 }}>
          <ChevronLeft size={16} />Back to Home
        </motion.button>
        <div className="glass-strong rounded-2xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <div className="px-8 py-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))' }}>
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} className="inline-flex p-3 rounded-xl mb-4" style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Shield className="text-violet-400" size={32} />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Admin Portal</h1>
            <p className="text-slate-400 text-sm">Secure administrative access</p>
          </div>
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Admin Email</label>
                <div className="relative"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-dark pl-10" placeholder="admin@smartsky.com" required autoComplete="email" />
                </div></div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <div className="relative"><Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input id="admin-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-dark pl-10 pr-10" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"><Eye size={16} /></button>
                </div></div>
              <button type="submit" disabled={loading} className="w-full btn-sky py-3 mt-2">{loading ? 'Authenticating...' : 'Login to Admin Panel'}</button>
            </form>
            <div className="mt-6 text-center"><button onClick={() => navigate(ROUTES.HOME)} className="text-sm text-slate-500 hover:text-slate-300">Not an admin? Go to User Portal</button></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default AdminLoginPage;
