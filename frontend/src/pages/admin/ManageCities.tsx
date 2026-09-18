import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { flightService } from '@/services';
import { MapPin, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { City } from '@/types';
import { toast } from '@/store/toastStore';

export const ManageCities: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [cityName, setCityName] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => { loadCities(); }, []);

  const loadCities = async () => {
    try { setLoading(true); const r = await flightService.getAllCities(); setCities(r.data); }
    catch { toast.error('Failed to load cities'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCity) { await flightService.updateCity(editingCity.id, cityName); }
      else { await flightService.createCity(cityName); }
      toast.success(editingCity ? 'City Updated' : 'City Created');
      handleCancel(); loadCities();
    } catch { toast.error('Failed to save city'); }
  };

  const handleEdit = (city: City) => { setEditingCity(city); setCityName(city.name); setShowForm(true); };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try { await flightService.deleteCity(deleteId); setCities(cities.filter(c => c.id !== deleteId)); toast.success('City Deleted'); }
    catch { toast.error('Failed to delete city'); }
    finally { setDeleteId(null); }
  };

  const handleCancel = () => { setShowForm(false); setEditingCity(null); setCityName(''); };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <MapPin className="text-emerald-400" size={24} /> Manage Cities
          </h1>
          <p className="text-slate-400 text-sm mt-1">{cities.length} cities</p>
        </div>
        {!showForm && <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-2"><Plus size={16} /> Add City</button>}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editingCity ? 'Edit City' : 'Add New City'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-slate-300 mb-2">City Name</label>
              <input type="text" value={cityName} onChange={(e) => setCityName(e.target.value)} className="input-dark" placeholder="Enter city name" required /></div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary px-6">{editingCity ? 'Update City' : 'Create City'}</button>
              <button type="button" onClick={handleCancel} className="btn-secondary px-6">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10"><h2 className="text-white font-semibold">All Cities ({cities.length})</h2></div>
        {loading ? <div className="py-16 text-center text-slate-400">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="table-dark">
              <thead><tr><th>ID</th><th>City Name</th><th>Created</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {cities.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-slate-500">No cities. Add your first city.</td></tr>
                : cities.map((city) => (
                  <tr key={city.id}>
                    <td><span className="text-gold-400 font-mono">#{city.id}</span></td>
                    <td className="font-medium">{city.name}</td>
                    <td className="text-slate-400 text-sm">{new Date(city.createdAt).toLocaleDateString()}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(city)} className="btn-secondary text-xs px-3 py-1.5"><Edit size={14} /></button>
                        <button onClick={() => setDeleteId(city.id)} className="btn-danger text-xs px-3 py-1.5"><Trash2 size={14} /></button>
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
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <AlertTriangle className="text-amber-400 mx-auto mb-4" size={40} />
                <h3 className="text-lg font-bold text-white mb-2">Delete City?</h3>
                <p className="text-slate-400 text-sm mb-6">This will also remove associated airports.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setDeleteId(null)} className="btn-secondary px-6">Cancel</button>
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

export default ManageCities;
