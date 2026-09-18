import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { flightService } from '@/services';
import { Settings, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Airplane } from '@/types';
import { toast } from '@/store/toastStore';

export const ManageAirplanes: React.FC = () => {
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAirplane, setEditingAirplane] = useState<Airplane | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ modelNumber: '', capacity: '' });

  useEffect(() => { loadAirplanes(); }, []);

  const loadAirplanes = async () => {
    try { setLoading(true); const r = await flightService.getAllAirplanes(); setAirplanes(r.data); }
    catch { toast.error('Failed to load airplanes'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { modelNumber: formData.modelNumber, capacity: parseInt(formData.capacity) };
      if (editingAirplane) { await flightService.updateAirplane(editingAirplane.id, data); }
      else { await flightService.createAirplane(data); }
      toast.success(editingAirplane ? 'Airplane Updated' : 'Airplane Created');
      resetForm(); loadAirplanes();
    } catch { toast.error('Failed to save airplane'); }
  };

  const handleEdit = (airplane: Airplane) => {
    setEditingAirplane(airplane);
    setFormData({ modelNumber: airplane.modelNumber, capacity: airplane.capacity.toString() });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try { await flightService.deleteAirplane(deleteId); setAirplanes(airplanes.filter(a => a.id !== deleteId)); toast.success('Airplane Deleted'); }
    catch { toast.error('Failed to delete airplane'); }
    finally { setDeleteId(null); }
  };

  const resetForm = () => { setShowForm(false); setEditingAirplane(null); setFormData({ modelNumber: '', capacity: '' }); };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <Settings className="text-gold-400" size={24} /> Manage Airplanes
          </h1>
          <p className="text-slate-400 text-sm mt-1">{airplanes.length} aircraft</p>
        </div>
        {!showForm && <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-2"><Plus size={16} /> Add Airplane</button>}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editingAirplane ? 'Edit Airplane' : 'Add New Airplane'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Model Number</label>
                <input type="text" value={formData.modelNumber} onChange={(e) => setFormData({ ...formData, modelNumber: e.target.value })} className="input-dark" placeholder="Boeing 737-800" required /></div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Capacity</label>
                <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="input-dark" placeholder="180" min="1" required /></div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary px-6">{editingAirplane ? 'Update' : 'Create'} Airplane</button>
              <button type="button" onClick={resetForm} className="btn-secondary px-6">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10"><h2 className="text-white font-semibold">All Airplanes ({airplanes.length})</h2></div>
        {loading ? <div className="py-16 text-center text-slate-400">Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="table-dark">
              <thead><tr><th>ID</th><th>Model</th><th>Capacity</th><th>Added</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {airplanes.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-slate-500">No airplanes. Add your first aircraft.</td></tr>
                : airplanes.map((ap) => (
                  <tr key={ap.id}>
                    <td><span className="text-gold-400 font-mono">#{ap.id}</span></td>
                    <td className="font-medium">{ap.modelNumber}</td>
                    <td><span className="text-sky-400">{ap.capacity}</span> passengers</td>
                    <td className="text-slate-400 text-sm">{new Date(ap.createdAt).toLocaleDateString()}</td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(ap)} className="btn-secondary text-xs px-3 py-1.5"><Edit size={14} /></button>
                        <button onClick={() => setDeleteId(ap.id)} className="btn-danger text-xs px-3 py-1.5"><Trash2 size={14} /></button>
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
                <h3 className="text-lg font-bold text-white mb-2">Delete Airplane?</h3>
                <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
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

export default ManageAirplanes;
