import React from 'react';
import { Seat, SeatType } from '@/types';
import { cn } from '@/utils/helpers';
import { toast } from '@/store/toastStore';

interface SeatSelectionProps {
  seats: Seat[];
  selectedSeatIds: number[];
  onSeatSelect: (seatId: number) => void;
  maxSeats?: number;
}

export const SeatSelection: React.FC<SeatSelectionProps> = ({
  seats,
  selectedSeatIds,
  onSeatSelect,
  maxSeats = 9,
}) => {
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<number, Seat[]>);

  // Sort rows and seats within each row
  const sortedRows = Object.keys(seatsByRow)
    .map(Number)
    .sort((a, b) => a - b);

  const getSeatColor = (seat: Seat): string => {
    if (seat.isBooked) {
      return 'bg-slate-700 cursor-not-allowed text-slate-500';
    }
    if (selectedSeatIds.includes(seat.id)) {
      return 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400';
    }
    switch (seat.type) {
      case SeatType.FIRST_CLASS:
        return 'bg-violet-500/20 hover:bg-violet-500/40 border-violet-500/40 text-violet-300';
      case SeatType.BUSINESS:
        return 'bg-sky-500/20 hover:bg-sky-500/40 border-sky-500/40 text-sky-300';
      case SeatType.PREMIUM_ECONOMY:
        return 'bg-gold-500/20 hover:bg-gold-500/40 border-gold-500/40 text-gold-300';
      case SeatType.ECONOMY:
      default:
        return 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-300';
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.isBooked) return;

    // If selecting and already at max, don't allow
    if (!selectedSeatIds.includes(seat.id) && selectedSeatIds.length >= maxSeats) {
      toast.warning('Seat Limit', `You can only select up to ${maxSeats} seats`);
      return;
    }

    onSeatSelect(seat.id);
  };

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/10 border border-white/20 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-emerald-500 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-700 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-violet-500/20 border border-violet-500/40 rounded"></div>
          <span>First Class</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-sky-500/20 border border-sky-500/40 rounded"></div>
          <span>Business</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gold-500/20 border border-gold-500/40 rounded"></div>
          <span>Premium Econ</span>
        </div>
      </div>

      {/* Seat Map */}
      <div className="glass-card p-6 overflow-x-auto">
        {/* Cockpit */}
        <div className="mb-6 text-center">
          <div className="inline-block px-8 py-2 rounded-t-full border border-white/10" style={{ background: 'rgba(14,165,233,0.1)' }}>
            <span className="text-sm font-semibold text-sky-400">✈️ Cockpit</span>
          </div>
        </div>

        {/* Seats */}
        <div className="space-y-2">
          {sortedRows.map((row) => {
            const rowSeats = seatsByRow[row].sort((a, b) => a.col.localeCompare(b.col));
            
            return (
              <div key={row} className="flex items-center justify-center gap-2">
                {/* Row number */}
                <div className="w-8 text-center text-sm font-semibold text-slate-500">
                  {row}
                </div>

                {/* Left side seats (A, B, C) */}
                <div className="flex gap-1">
                  {rowSeats
                    .filter((seat) => ['A', 'B', 'C'].includes(seat.col))
                    .map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.isBooked}
                        className={cn(
                          'w-10 h-10 rounded border-2 transition-all duration-200 flex items-center justify-center text-xs font-medium',
                          getSeatColor(seat),
                          seat.isBooked && 'opacity-50'
                        )}
                        title={`Seat ${row}${seat.col} - ${seat.type} ${seat.isBooked ? '(Booked)' : ''}`}
                      >
                        {seat.col}
                      </button>
                    ))}
                </div>

                {/* Aisle */}
                <div className="w-8"></div>

                {/* Right side seats (D, E, F) */}
                <div className="flex gap-1">
                  {rowSeats
                    .filter((seat) => ['D', 'E', 'F'].includes(seat.col))
                    .map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.isBooked}
                        className={cn(
                          'w-10 h-10 rounded border-2 transition-all duration-200 flex items-center justify-center text-xs font-medium',
                          getSeatColor(seat),
                          seat.isBooked && 'opacity-50'
                        )}
                        title={`Seat ${row}${seat.col} - ${seat.type} ${seat.isBooked ? '(Booked)' : ''}`}
                      >
                        {seat.col}
                      </button>
                    ))}
                </div>

                {/* Row number (right side) */}
                <div className="w-8 text-center text-sm font-semibold text-slate-500">
                  {row}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected seats summary */}
      {selectedSeatIds.length > 0 && (
        <div className="glass-card p-4" style={{ border: '1px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.08)' }}>
          <h4 className="font-semibold text-emerald-300 mb-2">
            Selected Seats ({selectedSeatIds.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedSeatIds.map((seatId) => {
              const seat = seats.find((s) => s.id === seatId);
              if (!seat) return null;
              return (
                <span
                  key={seatId}
                  className="inline-flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium border border-emerald-500/30"
                >
                  {seat.row}
                  {seat.col}
                  <button
                    onClick={() => onSeatSelect(seatId)}
                    className="ml-2 text-emerald-400 hover:text-emerald-200"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
