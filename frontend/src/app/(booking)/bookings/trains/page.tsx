'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter as useNextRouter, useSearchParams as useNextSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Train, Search, Filter, ArrowRight, 
  MapPin, Calendar, Clock, DollarSign, 
  ShieldCheck, Loader2, Sparkles, X 
} from 'lucide-react';
import { Train as TrainItem, trainService } from '@/services/train.service';
import { Booking } from '@/services/mockDb';

function TrainSearchContent() {
  const router = useNextRouter();
  const searchParams = useNextSearchParams();

  // Search params from URL
  const initFrom = searchParams.get('from') || '';
  const initTo = searchParams.get('to') || '';
  const initDate = searchParams.get('date') || '';

  // Form State
  const [from, setFrom] = useState(initFrom);
  const [to, setTo] = useState(initTo);
  const [date, setDate] = useState(initDate);
  
  // Listings state
  const [trains, setTrains] = useState<TrainItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters State
  const [classFilter, setClassFilter] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>('price-asc');

  // Booking Modal State
  const [selectedTrain, setSelectedTrain] = useState<TrainItem | null>(null);
  const [passengerName, setPassengerName] = useState('');
  const [selectedSeat, setSelectedSeat] = useState('');
  const [selectedClass, setSelectedClass] = useState('Coach');
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

  const mockSeats = ['Car 1, Seat 12A', 'Car 1, Seat 14C', 'Car 2, Seat 08B', 'Car 3, Seat 22F'];

  const fetchTrains = async () => {
    setIsLoading(true);
    try {
      const results = await trainService.search({ from, to, date });
      setTrains(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/bookings/trains?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
  };

  const handleBookClick = (train: TrainItem) => {
    setSelectedTrain(train);
    setSelectedClass(train.class);
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
    if (!selectedTrain) return;
    setIsBookingLoading(true);
    try {
      const result: Booking = await trainService.createBooking(selectedTrain.id, {
        passengerName: passengers.map(p => p.name).filter(Boolean).join(', '),
        seat: selectedSeat,
        date: date || new Date().toISOString().split('T')[0],
        class: selectedClass,
        passengers: passengers,
      });
      router.push(`/bookings/confirmation?id=${result.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBookingLoading(false);
      setSelectedTrain(null);
    }
  };

  // Filter listings
  const filteredTrains = trains.filter((train) => {
    const matchClass = classFilter === 'all' || train.class.toLowerCase() === classFilter.toLowerCase();
    const matchPrice = train.price <= maxPrice;
    return matchClass && matchPrice;
  });

  const sortedTrains = [...filteredTrains].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
          <Train className="w-6 h-6 text-primary-500" /> Search Train Tickets
        </h2>
        <p className="text-sm text-slate-500 mt-1">Book express or scenic train connections seamlessly</p>
      </div>

      {/* Search Bar Widget */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary-500" /> Departure Station
            </label>
            <input
              type="text"
              required
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g. New Delhi (NDLS)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-secondary-500" /> Destination Station
            </label>
            <input
              type="text"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="e.g. Mumbai Central (MMCT)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary-500" /> Travel Date
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
              <Search className="w-4 h-4" /> Search Trains
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
              onClick={() => { setClassFilter('all'); setMaxPrice(10000); }}
              className="text-[10px] font-bold text-primary-500 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Class Filter */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2.5">Coach Class</h4>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Cabin Classes</option>
              <option value="coach">Coach</option>
              <option value="business">Business</option>
              <option value="first class">First Class</option>
            </select>
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
              <h4 className="text-xs font-bold text-slate-700">Max Ticket Price (₹)</h4>
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
              max="10000"
              step="200"
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
              <h3 className="text-sm font-bold text-slate-700">Scan Available Trains</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Enter your departure station and destination in the search bar above to view real-time train tickets.
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
              <p className="text-xs font-semibold">Scanning railway timetables...</p>
            </div>
          ) : sortedTrains.length > 0 ? (
            sortedTrains.map((train) => (
              <motion.div
                key={train.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                {/* Train Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl bg-slate-50 border border-slate-100 w-14 h-14 rounded-2xl flex items-center justify-center">
                    🚆
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {train.name} &bull; {train.trainNumber}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                      {train.from} <ArrowRight className="w-3.5 h-3.5 text-slate-400" /> {train.to}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-slate-400 text-xxs mt-1.5 font-bold">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {train.departureTime} - {train.arrivalTime} ({train.duration})</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{train.class}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Booking */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-none border-slate-50 pt-4 md:pt-0">
                  <div className="mb-2 md:mb-0">
                    <span className="text-xxs text-slate-400 font-bold uppercase block md:text-right">Ticket Cost</span>
                    <span className="text-xl font-extrabold text-primary-600">₹{train.price.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    onClick={() => handleBookClick(train)}
                    className="bg-gradient-to-r from-primary-500 to-secondary-400 hover:from-primary-600 hover:to-secondary-500 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
              <p className="text-xs text-slate-400">No trains matched your search criteria.</p>
              <button 
                onClick={() => { setClassFilter('all'); setMaxPrice(3000); }}
                className="text-xs font-bold text-primary-500 mt-2 hover:underline focus:outline-none"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Overlay Modal */}
      <AnimatePresence>
        {selectedTrain && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrain(null)}
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
                  <Sparkles className="w-5 h-5 text-secondary-500" /> Book Rail Ticket
                </span>
                <button
                  onClick={() => setSelectedTrain(null)}
                  className="p-1 hover:bg-slate-50 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="mt-5 space-y-4">
                {/* Train Preview */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>{selectedTrain.name}</span>
                    <span>Class: {selectedClass}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                    {selectedTrain.from} <ArrowRight className="w-3.5 h-3.5 text-slate-400" /> {selectedTrain.to}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mt-2">
                    <span>Date: {date || 'Tomorrow'}</span>
                    <span>Time: {selectedTrain.departureTime}</span>
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

                {/* Class & Seat */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Select Class
                    </label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Coach">Coach</option>
                      <option value="Business">Business</option>
                      <option value="First Class">First Class</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Select Carriage & Seat
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
                </div>

                {/* Total Details */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Cost</span>
                    <span className="text-xl font-extrabold text-primary-600">₹{(selectedTrain.price * passengers.length).toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isBookingLoading}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-sm py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isBookingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Booking...
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

export default function TrainsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    }>
      <TrainSearchContent />
    </Suspense>
  );
}
