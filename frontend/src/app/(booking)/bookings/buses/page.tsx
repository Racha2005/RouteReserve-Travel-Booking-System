'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bus, Search, Filter, ArrowRight, 
  MapPin, Calendar, Clock, DollarSign, 
  ShieldCheck, Loader2, Sparkles, X, Star 
} from 'lucide-react';
import { Bus as BusItem, busService } from '@/services/bus.service';
import { Booking } from '@/services/mockDb';

function BusSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search params from URL
  const initFrom = searchParams.get('from') || '';
  const initTo = searchParams.get('to') || '';
  const initDate = searchParams.get('date') || '';

  // Form State
  const [from, setFrom] = useState(initFrom);
  const [to, setTo] = useState(initTo);
  const [date, setDate] = useState(initDate);
  
  // Listings state
  const [buses, setBuses] = useState<BusItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters State
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<string>('price-asc');

  // Booking Modal State
  const [selectedBus, setSelectedBus] = useState<BusItem | null>(null);
  const [passengerName, setPassengerName] = useState('');
  const [selectedSeat, setSelectedSeat] = useState('');
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  // Passengers list with Name and Age
  interface PassengerInput {
    name: string;
    age: string;
  }
  const [passengers, setPassengers] = useState<PassengerInput[]>([{ name: '', age: '' }]);

  const handlePassengerCountChange = (count: number) => {
    const newCount = Math.max(1, Math.min(9, count));
    setPassengers(prev => {
      if (newCount > prev.length) {
        return [...prev, ...Array(newCount - prev.length).fill(null).map(() => ({ name: '', age: '' }))];
      } else {
        return prev.slice(0, newCount);
      }
    });
  };

  const updatePassengerField = (index: number, field: keyof PassengerInput, value: string) => {
    setPassengers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const mockSeats = ['Seat 05', 'Seat 08', 'Seat 12', 'Seat 18 (Window)', 'Seat 22 (Aisle)'];

  const fetchBuses = async () => {
    setIsLoading(true);
    try {
      const results = await busService.search({ from, to, date });
      setBuses(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/bookings/buses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
  };

  const handleBookClick = (bus: BusItem) => {
    setSelectedBus(bus);
    setSelectedSeat(mockSeats[0]);
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setPassengerName(parsed.name || '');
          setPassengers([{ name: parsed.name || '', age: '28' }]);
        } catch {
          setPassengers([{ name: '', age: '' }]);
        }
      } else {
        setPassengers([{ name: '', age: '' }]);
      }
    } else {
      setPassengers([{ name: '', age: '' }]);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBus) return;
    setIsBookingLoading(true);
    try {
      const result: Booking = await busService.createBooking(selectedBus.id, {
        passengerName: passengers.map(p => p.name).filter(Boolean).join(', '),
        seat: selectedSeat,
        date: date || new Date().toISOString().split('T')[0],
        passengers: passengers,
      });
      router.push(`/bookings/confirmation?id=${result.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBookingLoading(false);
      setSelectedBus(null);
    }
  };

  // Filter listings
  const filteredBuses = buses.filter((bus) => {
    return bus.price <= maxPrice;
  });

  const sortedBuses = [...filteredBuses].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
          <Bus className="w-6 h-6 text-primary-500" /> Search Bus Tickets
        </h2>
        <p className="text-sm text-slate-500 mt-1">Book premium AC coaches, sleepers, and express transit options</p>
      </div>

      {/* Search Bar Widget */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary-500" /> Departure Terminal
            </label>
            <input
              type="text"
              required
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g. Majestic, Bengaluru"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-secondary-500" /> Arrival Terminal
            </label>
            <input
              type="text"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g. Panaji, Goa"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary-500" /> Departure Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Search className="w-4 h-4" /> Search Buses
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 h-fit shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Filter className="w-4.5 h-4.5 text-slate-500" /> Filters
            </span>
            <button 
              onClick={() => { setMaxPrice(5000); }}
              className="text-[10px] font-bold text-primary-500 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Sort By Filter */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2.5">Sort Options</h4>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="price-asc">Price: Lowest to Highest</option>
              <option value="price-desc">Price: Highest to Lowest</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <h4 className="text-xs font-bold text-slate-700">Max Ticket Cost (₹)</h4>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
                className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-right text-xs font-bold text-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>
        </div>

        {/* Listings Result Panel */}
        <div className="lg:col-span-3 space-y-4">
          {!from || !to ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-sm font-bold text-slate-700">Scan Available Buses</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Enter your departure location and destination in the search bar above to view real-time bus tickets.
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
              <p className="text-xs font-semibold">Scanning bus routes...</p>
            </div>
          ) : sortedBuses.length > 0 ? (
            sortedBuses.map((bus) => (
              <motion.div
                key={bus.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                {/* Bus Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl bg-slate-50 border border-slate-100 w-14 h-14 rounded-2xl flex items-center justify-center">
                    🚌
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {bus.operator}
                      </span>
                      <span className="bg-amber-50 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-600" /> {bus.rating}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                      {bus.from} <ArrowRight className="w-3.5 h-3.5 text-slate-400" /> {bus.to}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-slate-400 text-xxs mt-1.5 font-bold">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {bus.departureTime} - {bus.arrivalTime} ({bus.duration})</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{bus.type}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Booking */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-none border-slate-50 pt-4 md:pt-0">
                  <div className="mb-2 md:mb-0">
                    <span className="text-xxs text-slate-400 font-bold uppercase block md:text-right">Ticket Cost</span>
                    <span className="text-xl font-extrabold text-primary-600">₹{bus.price.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    onClick={() => handleBookClick(bus)}
                    className="bg-gradient-to-r from-primary-500 to-secondary-400 hover:from-primary-600 hover:to-secondary-500 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
              <p className="text-xs text-slate-400">No buses matched your criteria.</p>
              <button 
                onClick={() => { setMaxPrice(3000); }}
                className="text-xs font-bold text-primary-500 mt-2 hover:underline focus:outline-none"
              >
                Reset Price Limit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Overlay Modal */}
      <AnimatePresence>
        {selectedBus && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBus(null)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-50 overflow-hidden text-slate-800"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-secondary-500" /> Book Bus Ticket
                </span>
                <button
                  onClick={() => setSelectedBus(null)}
                  className="p-1 hover:bg-slate-50 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="mt-5 space-y-4">
                {/* Bus Details Preview */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>{selectedBus.operator}</span>
                    <span>{selectedBus.type}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                    {selectedBus.from} <ArrowRight className="w-3.5 h-3.5 text-slate-400" /> {selectedBus.to}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mt-2">
                    <span>Date: {date || 'Tomorrow'}</span>
                    <span>Time: {selectedBus.departureTime}</span>
                  </div>
                </div>

                 {/* Passenger Count Selector */}
                 <div>
                   <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                     Number of Passengers
                   </label>
                   <select
                     value={passengers.length}
                     onChange={(e) => handlePassengerCountChange(parseInt(e.target.value))}
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                   >
                     {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                       <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                     ))}
                   </select>
                 </div>

                 {/* Passengers list inputs */}
                 <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                   {passengers.map((p, idx) => (
                     <div key={idx} className="grid grid-cols-3 gap-3 border border-slate-100 bg-slate-50/50 p-3 rounded-2xl">
                       <div className="col-span-2">
                         <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                           Passenger {idx + 1} Name
                         </label>
                         <input
                           type="text"
                           required
                           value={p.name}
                           onChange={(e) => updatePassengerField(idx, 'name', e.target.value)}
                           placeholder="Full Name as on ID"
                           className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                         />
                       </div>
                       <div>
                         <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                           Age
                         </label>
                         <input
                           type="number"
                           required
                           min="1"
                           max="120"
                           value={p.age}
                           onChange={(e) => updatePassengerField(idx, 'age', e.target.value)}
                           placeholder="Age"
                           className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                         />
                       </div>
                     </div>
                   ))}
                 </div>

                {/* Seat Selector */}
                <div>
                  <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Select Bus Seat
                  </label>
                  <select
                    value={selectedSeat}
                    onChange={(e) => setSelectedSeat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {mockSeats.map(seat => (
                      <option key={seat} value={seat}>{seat}</option>
                    ))}
                  </select>
                </div>

                {/* Total Details */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Cost</span>
                    <span className="text-xl font-extrabold text-primary-600">₹{(selectedBus.price * passengers.length).toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isBookingLoading}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-sm py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isBookingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Reserving...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" /> Secure Purchase
                      </>
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

export default function BusesPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    }>
      <BusSearchContent />
    </Suspense>
  );
}
