import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { flightService } from '@/services';
import { Building2, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Airport, City } from '@/types';
import { toast } from '@/store/toastStore';

export const ManageAirports: React.FC = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAirport, setEditingAirport] = useState<Airport | null>(null);
  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', address: '', cityId: '' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try { setLoading(true);
      const [a, c] = await Promise.all([flightService.getAllAirports(), flightService.getAllCities()]);
      setAirports(a.data); setCities(c.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAirport) { await flightService.updateAirport(editingAirport.code, { name: formData.name, address: formData.address, cityId: parseInt(formData.cityId) }); }
      else { await flightService.createAirport({ name: formData.name, code: formData.code, address: formData.address, cityId: parseInt(formData.cityId) }); }
      toast.success(editingAirport ? 'Airport Updated' : 'Airport Created');
      resetForm(); loadData();
    } catch { toast.error('Failed to save airport'); }
  };

  const handleEdit = (airport: Airport) => {
    setEditingAirport(airport);
    setFormData({ name: airport.name, code: airport.code, address: airport.address, cityId: airport.cityId.toString() });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteCode) return;
    try { await flightService.deleteAirport(deleteCode); setAirports(airports.filter(a => a.code !== deleteCode)); toast.success('Airport Deleted'); }
    catch { toast.error('Failed to delete airport'); }
    finally { setDeleteCode(null); }
  };

  const resetForm = () => { setShowForm(false); setEditingAirport(null); setFormData({ name: '', code: '', address: '', cityId: '' }); };

  const lbl = 'block text-sm font-medium text-slate-300 mb-2';

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <Building2 className="text-violet-400" size={24} /> Manage Airports
          </h1>
          <p className="text-slate-400 text-sm mt-1">{airports.length} airports</p>
        </div>
        {!showForm && <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-2"><Plus size={16} /> Add Airport</button>}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editingAirport ? 'Edit Airport' : 'Add New Airport'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={lbl}>Airport Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-dark" placeholder="Indira Gandhi International" required /></div>
              <div><label className={lbl}>Airport Code</label><input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="input-dark" placeholder="DEL" maxLength={3} disabled={!!editingAirport} required /></div>
              <div><label className={lbl}>City</label><select value={formData.cityId} onChange={(e) => setFormData({ ...formData, cityId: e.target.value })} className="input-dark" required><option value="">Select a city</option>{cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div><label className={lbl}>Address</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="input-dark" placeholder="Airport address" required /></div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary px-6">{editingAirport ? 'Update' : 'Create'} Airport</button>
              <button type="button" onClick={resetForm} className="btn-secondary px-6">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10"><h2 className="text-white font-semibold">All Airports ({airports.length})</h2></div>
        {loading ? <div className="py-16 text-center text-slate-400">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="table-dark">
              <thead><tr><th>Code</th><th>Name</th><th>City</th><th>Address</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {airports.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-slate-500">No airports. Add your first airport.</td></tr>
                : airports.map((ap) => (
                  <tr key={ap.code}>
                    <td><span className="text-sky-400 font-mono font-bold">{ap.code}</span></td>
                    <td className="font-medium">{ap.name}</td>
                    <td className="text-slate-300">{ap.city?.name}</td>
                    <td className="text-slate-400 text-sm">{ap.address}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(ap)} className="btn-secondary text-xs px-3 py-1.5"><Edit size={14} /></button>
                        <button onClick={() => setDeleteCode(ap.code)} className="btn-danger text-xs px-3 py-1.5"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {deleteCode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setDeleteCode(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <AlertTriangle className="text-amber-400 mx-auto mb-4" size={40} />
                <h3 className="text-lg font-bold text-white mb-2">Delete Airport {deleteCode}?</h3>
                <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setDeleteCode(null)} className="btn-secondary px-6">Cancel</button>
                  <button onClick={confirmDelete} className="btn-danger px-6">Delete</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageAirports;
