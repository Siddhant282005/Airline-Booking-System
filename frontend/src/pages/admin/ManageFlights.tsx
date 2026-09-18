import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { flightService } from '@/services';
import { Plane, Plus, Edit, Trash2, MapPin, AlertTriangle } from 'lucide-react';
import { Flight, Airport, Airplane } from '@/types';
import { toast } from '@/store/toastStore';

export const ManageFlights: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [airplanes, setAirplanes] = useState<Airplane[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    flightNumber: '', airplaneId: '', departureAirportId: '', arrivalAirportId: '',
    departureTime: '', arrivalTime: '', price: '', boardingGate: '', totalSeats: '',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [flightsRes, airportsRes, airplanesRes] = await Promise.all([
        flightService.getAllFlights(), flightService.getAllAirports(), flightService.getAllAirplanes(),
      ]);
      setFlights(flightsRes.data);
      setAirports(airportsRes.data);
      setAirplanes(airplanesRes.data);
    } catch {
      toast.error('Failed to load data');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const flightData = {
        flightNumber: formData.flightNumber, airplaneId: parseInt(formData.airplaneId),
        departureAirportId: formData.departureAirportId, arrivalAirportId: formData.arrivalAirportId,
        departureTime: formData.departureTime, arrivalTime: formData.arrivalTime,
        price: parseFloat(formData.price), boardingGate: formData.boardingGate, totalSeats: parseInt(formData.totalSeats),
      };
      if (editingFlight) { await flightService.updateFlight(editingFlight.id, flightData); }
      else { await flightService.createFlight(flightData); }
      toast.success(editingFlight ? 'Flight Updated' : 'Flight Created');
      resetForm(); loadData();
    } catch { toast.error('Failed to save flight'); }
  };

  const handleEdit = (flight: Flight) => {
    setEditingFlight(flight);
    setFormData({
      flightNumber: flight.flightNumber, airplaneId: flight.airplaneId.toString(),
      departureAirportId: flight.departureAirportId, arrivalAirportId: flight.arrivalAirportId,
      departureTime: flight.departureTime.slice(0, 16), arrivalTime: flight.arrivalTime.slice(0, 16),
      price: flight.price.toString(), boardingGate: flight.boardingGate, totalSeats: flight.totalSeats.toString(),
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await flightService.deleteFlight(deleteId);
      setFlights(flights.filter(f => f.id !== deleteId));
      toast.success('Flight Deleted');
    } catch { toast.error('Failed to delete flight'); }
    finally { setDeleteId(null); }
  };

  const resetForm = () => {
    setShowForm(false); setEditingFlight(null);
    setFormData({ flightNumber: '', airplaneId: '', departureAirportId: '', arrivalAirportId: '', departureTime: '', arrivalTime: '', price: '', boardingGate: '', totalSeats: '' });
  };

  const inputClass = 'input-dark';
  const labelClass = 'block text-sm font-medium text-slate-300 mb-2';

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <Plane className="text-sky-400" size={24} /> Manage Flights
          </h1>
          <p className="text-slate-400 text-sm mt-1">{flights.length} flights</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
            <Plus size={16} /> Add Flight
          </button>
        )}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editingFlight ? 'Edit Flight' : 'Add New Flight'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClass}>Flight Number</label><input type="text" value={formData.flightNumber} onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })} className={inputClass} placeholder="AI 101" required /></div>
              <div><label className={labelClass}>Airplane</label><select value={formData.airplaneId} onChange={(e) => setFormData({ ...formData, airplaneId: e.target.value })} className={inputClass} required><option value="">Select airplane</option>{airplanes.map(a => <option key={a.id} value={a.id}>{a.modelNumber} (Cap: {a.capacity})</option>)}</select></div>
              <div><label className={labelClass}>Departure Airport</label><select value={formData.departureAirportId} onChange={(e) => setFormData({ ...formData, departureAirportId: e.target.value })} className={inputClass} required><option value="">Select departure</option>{airports.map(a => <option key={a.code} value={a.code}>{a.name} ({a.code})</option>)}</select></div>
              <div><label className={labelClass}>Arrival Airport</label><select value={formData.arrivalAirportId} onChange={(e) => setFormData({ ...formData, arrivalAirportId: e.target.value })} className={inputClass} required><option value="">Select arrival</option>{airports.map(a => <option key={a.code} value={a.code}>{a.name} ({a.code})</option>)}</select></div>
              <div><label className={labelClass}>Departure Time</label><input type="datetime-local" value={formData.departureTime} onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })} className={inputClass} required /></div>
              <div><label className={labelClass}>Arrival Time</label><input type="datetime-local" value={formData.arrivalTime} onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })} className={inputClass} required /></div>
              <div><label className={labelClass}>Price (₹)</label><input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={inputClass} placeholder="5000" min="0" step="0.01" required /></div>
              <div><label className={labelClass}>Boarding Gate</label><input type="text" value={formData.boardingGate} onChange={(e) => setFormData({ ...formData, boardingGate: e.target.value })} className={inputClass} placeholder="A1" required /></div>
              <div><label className={labelClass}>Total Seats</label><input type="number" value={formData.totalSeats} onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })} className={inputClass} placeholder="180" min="1" required /></div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary px-6">{editingFlight ? 'Update Flight' : 'Create Flight'}</button>
              <button type="button" onClick={resetForm} className="btn-secondary px-6">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-white font-semibold">All Flights ({flights.length})</h2>
        </div>
        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-dark">
              <thead>
                <tr><th>Flight</th><th>Route</th><th>Departure</th><th>Arrival</th><th>Price</th><th>Status</th><th className="text-right">Actions</th></tr>
              </thead>
              <tbody>
                {flights.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-500">No flights found. Add your first flight.</td></tr>
                ) : flights.map((flight) => (
                  <tr key={flight.id}>
                    <td><span className="text-gold-400 font-semibold">{flight.flightNumber}</span></td>
                    <td><div className="flex items-center gap-1 text-sm"><MapPin size={13} className="text-slate-500" />{flight.departureAirport?.city?.name || flight.departureAirportId} → {flight.arrivalAirport?.city?.name || flight.arrivalAirportId}</div></td>
                    <td className="text-sm">{new Date(flight.departureTime).toLocaleString()}</td>
                    <td className="text-sm">{new Date(flight.arrivalTime).toLocaleString()}</td>
                    <td><span className="text-gold-400 font-semibold">₹{flight.price.toLocaleString()}</span></td>
                    <td>
                      <span className={new Date(flight.departureTime) > new Date() ? 'badge-booked' : 'badge-cancelled'}>
                        {new Date(flight.departureTime) > new Date() ? 'Scheduled' : 'Departed'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(flight)} className="btn-secondary text-xs px-3 py-1.5"><Edit size={14} /></button>
                        <button onClick={() => setDeleteId(flight.id)} className="btn-danger text-xs px-3 py-1.5"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
              <div className="text-center">
                <AlertTriangle className="text-amber-400 mx-auto mb-4" size={40} />
                <h3 className="text-lg font-bold text-white mb-2">Delete Flight?</h3>
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

export default ManageFlights;
