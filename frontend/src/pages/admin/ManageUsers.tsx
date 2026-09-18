import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Search, RefreshCw } from 'lucide-react';
import { apiGateway } from '@/services/api';
import { toast } from '@/store/toastStore';

interface User { id: number; email: string; createdAt: string; }

export const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleForm, setRoleForm] = useState({ userId: '', roleName: 'admin' });
  const [assigning, setAssigning] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiGateway.get('/api/v1/user/');
      setUsers(res.data.data || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssigning(true);
    try {
      await apiGateway.post('/api/v1/user/role', {
        userId: parseInt(roleForm.userId),
        roleName: roleForm.roleName,
      });
      toast.success('Role Assigned', `Role '${roleForm.roleName}' assigned successfully.`);
      setRoleForm({ userId: '', roleName: 'admin' });
    } catch {
      toast.error('Failed to assign role');
    } finally {
      setAssigning(false);
    }
  };

  const filtered = users.filter(
    (u) => u.email.toLowerCase().includes(search.toLowerCase()) || String(u.id).includes(search)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Manage Users
          </h1>
          <p className="text-slate-400 text-sm mt-1">{users.length} registered users</p>
        </div>
        <button onClick={fetchUsers} className="btn-secondary text-sm px-4 py-2 flex items-center gap-2">
          <RefreshCw size={14} />Refresh
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield size={18} className="text-gold-400" /> Assign Role
        </h2>
        <form onSubmit={handleAssignRole} className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            value={roleForm.userId}
            onChange={(e) => setRoleForm({ ...roleForm, userId: e.target.value })}
            className="input-dark flex-1"
            placeholder="User ID"
            required
          />
          <select
            value={roleForm.roleName}
            onChange={(e) => setRoleForm({ ...roleForm, roleName: e.target.value })}
            className="input-dark w-40"
          >
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
            <option value="flight_company">Flight Company</option>
          </select>
          <button type="submit" disabled={assigning} className="btn-primary px-6">
            {assigning ? 'Assigning...' : 'Assign'}
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-4 border-b border-white/10">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-9 text-sm"
              placeholder="Search by email or ID..."
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td><span className="text-gold-400 font-mono">#{user.id}</span></td>
                    <td>{user.email}</td>
                    <td className="text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ManageUsers;
