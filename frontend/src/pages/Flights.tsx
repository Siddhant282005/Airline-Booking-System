import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plane as PlaneIcon, MapPin, Clock, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { flightService } from '@/services';
import { Flight, Airport } from '@/types';
import { formatTime, formatCurrency, getFlightDuration } from '@/utils/helpers';
import { toast } from '@/store/toastStore';

export const Flights: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    departureAirportId: '',
    arrivalAirportId: '',
  });
  const [tripDate, setTripDate] = useState('');
  const [travellers, setTravellers] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [flightsRes, airportsRes] = await Promise.all([
        flightService.getAllFlights(),
        flightService.getAllAirports(),
      ]);
      setFlights(flightsRes.data);
      setAirports(airportsRes.data);
    } catch (error) {
      toast.error('Failed to load flights', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params: any = { ...searchParams };
      if (tripDate) params.tripDate = tripDate;
      if (travellers > 1) params.travellers = travellers;
      const response = await flightService.getAllFlights(params);
      setFlights(response.data);
    } catch (error) {
      toast.error('Search failed', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFlightClick = (flightId: number) => {
    navigate(`/flights/${flightId}`);
  };

  /* ---------- SKELETON ---------- */
  const SkeletonCard = () => (
    <div className="glass-card" style={{ borderRadius: 14, padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 16, width: '40%', borderRadius: 6, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 12, width: '70%', borderRadius: 6 }} />
        </div>
        <div className="skeleton" style={{ height: 36, width: 100, borderRadius: 8 }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 1rem 4rem' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '2rem' }}
        >
          <h1
            className="text-gradient-gold"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Discover Your Next Journey
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Search and book flights to destinations worldwide</p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          className="glass-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ borderRadius: 14, padding: '1.5rem', marginBottom: '2rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
            <Search size={20} style={{ color: 'var(--accent-gold)' }} />
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.1rem' }}>
              Search Flights
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {/* From */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: 6 }}>
                <MapPin size={14} /> From
              </label>
              <select
                className="input-dark"
                value={searchParams.departureAirportId}
                onChange={(e) => setSearchParams({ ...searchParams, departureAirportId: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="">All Departures</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            {/* To */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: 6 }}>
                <MapPin size={14} /> To
              </label>
              <select
                className="input-dark"
                value={searchParams.arrivalAirportId}
                onChange={(e) => setSearchParams({ ...searchParams, arrivalAirportId: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="">All Arrivals</option>
                {airports.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: 6 }}>
                <Calendar size={14} /> Date
              </label>
              <input
                type="date"
                className="input-dark"
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Travellers */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: 6 }}>
                <Users size={14} /> Travellers
              </label>
              <select
                className="input-dark"
                value={travellers}
                onChange={(e) => setTravellers(Number(e.target.value))}
                style={{ width: '100%' }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleSearch}
            disabled={loading}
            style={{ marginTop: '1rem', width: '100%' }}
          >
            <Search size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            {loading ? 'Searching…' : 'Search Flights'}
          </button>
        </motion.div>

        {/* Results count */}
        {!loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}
          >
            <PlaneIcon size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {flights.length} {flights.length === 1 ? 'flight' : 'flights'} found
          </motion.p>
        )}

        {/* Loading skeleton */}
        {loading && flights.length === 0 && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Flight cards */}
        {!loading &&
          flights.map((flight, i) => (
            <motion.div
              key={flight.id}
              className="flight-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => handleFlightClick(flight.id)}
              style={{
                borderRadius: 14,
                padding: '1.25rem 1.5rem',
                marginBottom: '1rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
                {/* Flight number */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 120 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-gold), #b8860b)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PlaneIcon size={18} style={{ color: '#0a0e1a' }} />
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                    {flight.flightNumber}
                  </span>
                </div>

                {/* Route */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                        {formatTime(flight.departureTime)}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {flight.departureAirport?.code || '---'}
                      </p>
                    </div>

                    <div style={{ flex: 1, textAlign: 'center', position: 'relative', padding: '0 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
                        <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                          {getFlightDuration(flight.departureTime, flight.arrivalTime)}
                        </span>
                      </div>
                      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)' }} />
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: 2 }}>Direct</p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                        {formatTime(flight.arrivalTime)}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        {flight.arrivalAirport?.code || '---'}
                      </p>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 4 }}>
                    {flight.departureAirport?.name || 'Departure'} → {flight.arrivalAirport?.name || 'Arrival'}
                  </p>
                </div>

                {/* Price + Book */}
                <div style={{ textAlign: 'right', minWidth: 120 }}>
                  <p style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '1.3rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {formatCurrency(flight.price)}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: 8 }}>
                    {flight.totalSeats} seats left
                  </p>
                  <button
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlightClick(flight.id);
                    }}
                    style={{ fontSize: '0.8rem', padding: '6px 18px' }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

        {/* Empty state */}
        {flights.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', paddingTop: '3rem' }}
          >
            <div className="glass-card" style={{ display: 'inline-block', padding: '3rem 2.5rem', borderRadius: 16 }}>
              <PlaneIcon size={64} style={{ color: 'var(--text-muted)', marginBottom: 16, opacity: 0.5 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                No flights found. Try adjusting your search criteria.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
