'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, Search, Filter, Calendar, 
  MapPin, Clock, Edit2, Trash2, 
  ChevronLeft, ChevronRight, X, Loader2, Sparkles 
} from 'lucide-react';
import { getLocalBookings, saveLocalBookings, Booking } from '@/services/mockDb';
import { flightService } from '@/services/flight.service';

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Edit Modal State
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editPassengerName, setEditPassengerName] = useState('');
  const [editSeat, setEditSeat] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    setBookings(getLocalBookings());
  }, [refreshTrigger]);

  // Cancel handler
  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you want to cancel this booking? This action is irreversible.')) {
      try {
        await flightService.cancelBooking(id);
        setRefreshTrigger((prev) => prev + 1);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Modify handler
  const handleOpenEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setEditPassengerName(booking.type === 'car' ? booking.details.driverName : booking.details.passengerName);
    setEditSeat(booking.details.seat || '');
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    setIsUpdating(true);
    try {
      const updatedDetails = editingBooking.type === 'car' 
        ? { driverName: editPassengerName }
        : { passengerName: editPassengerName, seat: editSeat };

      await flightService.updateBooking(editingBooking.id, updatedDetails);
      setRefreshTrigger((prev) => prev + 1);
      setEditingBooking(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Search & Filters logic
  const filteredBookings = bookings.filter((b) => {
    const matchType = typeFilter === 'all' || b.type === typeFilter;
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;

    // Search query matching
    const query = searchQuery.toLowerCase();
    const routeMatch = b.type === 'car' 
      ? b.details.model.toLowerCase().includes(query) || b.details.brand.toLowerCase().includes(query)
      : b.details.from.toLowerCase().includes(query) || b.details.to.toLowerCase().includes(query);
    const travelerMatch = b.type === 'car'
      ? b.details.driverName?.toLowerCase().includes(query)
      : b.details.passengerName?.toLowerCase().includes(query);
    const idMatch = b.id.toLowerCase().includes(query);

    return matchType && matchStatus && (routeMatch || travelerMatch || idMatch);
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'flight': return '✈️';
      case 'train': return '🚆';
      case 'bus': return '🚌';
      case 'car': return '🚗';
      default: return '📍';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="bg-primary-50 border border-primary-200 text-primary-600 text-xxs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-xxs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-50 border border-red-200 text-red-600 text-xxs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
          <History className="w-6 h-6 text-primary-500" /> Booking Management History
        </h2>
        <p className="text-sm text-slate-500 mt-1">Review active routes, download receipts, and update travelers details</p>
      </div>

      {/* Search & Filter Bar Widget */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search Route, Traveler name or Booking ID..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Transits</option>
            <option value="flight">Flights</option>
            <option value="train">Trains</option>
            <option value="bus">Buses</option>
            <option value="car">Car Rentals</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Main Table Panel (Desktop) & Cards (Mobile) */}
      {paginatedBookings.length > 0 ? (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Transit</th>
                  <th className="py-4 px-6">Itinerary Details</th>
                  <th className="py-4 px-6">Traveler</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Total Paid</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                {paginatedBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-slate-400">{b.id}</td>
                    <td className="py-4 px-6">
                      <span className="flex items-center gap-1.5">
                        <span className="text-xl">{getTransportIcon(b.type)}</span>
                        <span className="capitalize">{b.type}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="truncate">
                        {b.type === 'car' ? `${b.details.brand} ${b.details.model}` : `${b.details.from} → ${b.details.to}`}
                      </div>
                      {b.details.tripType === 'roundtrip' && (
                        <span className="block text-[9px] text-emerald-500 font-extrabold mt-0.5">🔄 Round-Trip</span>
                      )}
                    </td>
                    <td className="py-4 px-6">{b.type === 'car' ? b.details.driverName : b.details.passengerName}</td>
                    <td className="py-4 px-6">{b.type === 'car' ? b.details.pickupDate : b.details.date}</td>
                    <td className="py-4 px-6 text-primary-600 font-bold">
                      {b.type === 'flight' && b.details.isInternational 
                        ? `₹${b.totalPrice.toLocaleString('en-IN')} ($${Math.round(b.totalPrice / 83).toLocaleString('en-US')})` 
                        : `₹${b.totalPrice.toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(b.status)}</td>
                    <td className="py-4 px-6 text-right">
                      {b.status === 'upcoming' ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(b)}
                            className="p-1.5 border border-slate-200 text-slate-500 hover:text-primary-600 hover:bg-slate-50 rounded-lg cursor-pointer"
                            title="Modify Traveler"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="p-1.5 border border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Cancel Booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xxs font-bold uppercase tracking-wider mr-2">No Action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-4">
            {paginatedBookings.map((b) => (
              <div key={b.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTransportIcon(b.type)}</span>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">{b.id}</span>
                      <h4 className="text-xs font-bold text-slate-800 mt-0.5">
                        {b.type === 'car' ? `${b.details.brand} ${b.details.model}` : `${b.details.from} to ${b.details.to}`}
                      </h4>
                    </div>
                  </div>
                  {getStatusBadge(b.status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-b border-slate-50 py-3 text-slate-500 font-semibold">
                  <div>
                    <span className="block text-slate-400 text-xxs uppercase">Traveler</span>
                    {b.type === 'car' ? b.details.driverName : b.details.passengerName}
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xxs uppercase">Travel Date</span>
                    {b.type === 'car' ? b.details.pickupDate : b.details.date}
                  </div>
                  <div className="mt-2">
                    <span className="block text-slate-400 text-xxs uppercase">Total Paid</span>
                    <span className="text-primary-600 font-extrabold text-xs">
                      {b.type === 'flight' && b.details.isInternational 
                        ? `₹${b.totalPrice.toLocaleString('en-IN')} ($${Math.round(b.totalPrice / 83).toLocaleString('en-US')})` 
                        : `₹${b.totalPrice.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                </div>

                {b.status === 'upcoming' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="flex-1 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-xxs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Modify Info
                    </button>
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="flex-1 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl font-bold text-xxs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Cancel Route
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center bg-white border border-slate-100 rounded-2xl p-4 shadow-sm text-xs font-bold text-slate-600">
              <span>Page {currentPage} of {totalPages}</span>
              <div className="flex gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((c) => c - 1)}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((c) => c + 1)}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm">
          <p className="text-sm text-slate-400">No matching reservations found in history.</p>
          <button
            onClick={() => { setSearchQuery(''); setTypeFilter('all'); setStatusFilter('all'); }}
            className="text-xs font-bold text-primary-500 mt-2 hover:underline focus:outline-none"
          >
            Reset query filters
          </button>
        </div>
      )}

      {/* Edit Details Overlay Modal */}
      <AnimatePresence>
        {editingBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingBooking(null)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-50 overflow-hidden text-slate-800"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-secondary-500" /> Modify Traveler Details
                </span>
                <button
                  onClick={() => setEditingBooking(null)}
                  className="p-1 hover:bg-slate-50 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="mt-5 space-y-4">
                {/* Info summary */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[10px] text-slate-400 uppercase font-bold">
                  <div>Reference: {editingBooking.id}</div>
                  <div className="text-xs text-slate-700 mt-1 font-bold">
                    {editingBooking.type === 'car' 
                      ? `${editingBooking.details.brand} ${editingBooking.details.model}` 
                      : `${editingBooking.details.from} to ${editingBooking.details.to}`}
                  </div>
                </div>

                {/* Traveler Name field */}
                <div>
                  <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {editingBooking.type === 'car' ? 'Driver Full Name' : 'Passenger Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editPassengerName}
                    onChange={(e) => setEditPassengerName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                {/* Seat Assignment details */}
                {editingBooking.type !== 'car' && (
                  <div>
                    <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Seat Assignment
                    </label>
                    <input
                      type="text"
                      required
                      value={editSeat}
                      onChange={(e) => setEditSeat(e.target.value)}
                      placeholder="e.g. 14B"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="py-2.5 px-4 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="py-2.5 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BookingHistoryPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    }>
      <HistoryContent />
    </Suspense>
  );
}
