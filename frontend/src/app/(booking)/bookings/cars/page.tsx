'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, Search, Filter, ArrowRight, 
  MapPin, Calendar, Clock, DollarSign, 
  ShieldCheck, Loader2, Sparkles, X, Star, Users 
} from 'lucide-react';
import { CarRental, carService } from '@/services/car.service';
import { Booking } from '@/services/mockDb';

function CarSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search params from URL
  const initLoc = searchParams.get('location') || '';
  const initPickup = searchParams.get('pickupDate') || '';
  const initReturn = searchParams.get('returnDate') || '';

  // Form State
  const [location, setLocation] = useState(initLoc);
  const [pickupDate, setPickupDate] = useState(initPickup);
  const [returnDate, setReturnDate] = useState(initReturn);
  
  // Listings state
  const [cars, setCars] = useState<CarRental[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters State
  const [transmissionFilter, setTransmissionFilter] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(10000);

  // Booking Modal State
  const [selectedCar, setSelectedCar] = useState<CarRental | null>(null);
  const [driverName, setDriverName] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [rentalDays, setRentalDays] = useState(3);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const fetchCars = async () => {
    setIsLoading(true);
    try {
      const results = await carService.search({ location, pickupDate, returnDate });
      setCars(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [searchParams]);

  // Calculate default rental days when dates change
  useEffect(() => {
    if (pickupDate && returnDate) {
      const d1 = new Date(pickupDate);
      const d2 = new Date(returnDate);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setRentalDays(diffDays > 0 ? diffDays : 1);
    }
  }, [pickupDate, returnDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/bookings/cars?location=${encodeURIComponent(location)}&pickupDate=${pickupDate}&returnDate=${returnDate}`);
  };

  const handleBookClick = (car: CarRental) => {
    setSelectedCar(car);
    setPickupLocation(location || 'Heathrow Airport Terminals (LHR)');
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setDriverName(parsed.name || '');
        } catch {}
      }
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;
    setIsBookingLoading(true);
    try {
      const result: Booking = await carService.createBooking(selectedCar.id, {
        driverName,
        pickupLocation,
        pickupDate: pickupDate || new Date().toISOString().split('T')[0],
        returnDate: returnDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        days: rentalDays,
      });
      router.push(`/bookings/confirmation?id=${result.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBookingLoading(false);
      setSelectedCar(null);
    }
  };

  // Filter listings
  const filteredCars = cars.filter((car) => {
    const matchTrans = transmissionFilter === 'all' || car.transmission.toLowerCase() === transmissionFilter.toLowerCase();
    const matchPrice = car.pricePerDay <= maxPrice;
    return matchTrans && matchPrice;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center md:justify-start gap-2">
          <Car className="w-6 h-6 text-primary-500" /> Search Car Rentals
        </h2>
        <p className="text-sm text-slate-500 mt-1">Rent top-tier SUVs, electric sedans, and family cruisers</p>
      </div>

      {/* Search Bar Widget */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary-500" /> Pickup Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Airport, City, or Depot"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-primary-500" /> Pickup Date
            </label>
            <input
              type="date"
              required
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-secondary-500" /> Return Date
            </label>
            <input
              type="date"
              required
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Search className="w-4 h-4" /> Search Cars
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
              onClick={() => { setTransmissionFilter('all'); setMaxPrice(120); }}
              className="text-[10px] font-bold text-primary-500 hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Transmission Filter */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2.5">Transmission</h4>
            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={transmissionFilter === 'all'}
                  onChange={() => setTransmissionFilter('all')}
                  className="rounded text-primary-500 focus:ring-primary-500"
                /> All Types
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={transmissionFilter === 'automatic'}
                  onChange={() => setTransmissionFilter('automatic')}
                  className="rounded text-primary-500 focus:ring-primary-500"
                /> Automatic
              </label>
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-xs font-bold text-slate-700">Max Cost / Day</h4>
              <span className="text-xs font-extrabold text-primary-600">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
          </div>
        </div>

        {/* Listings Result Panel */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
              <p className="text-xs font-semibold">Scanning car rental inventories...</p>
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCars.map((car) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  {/* Photo details */}
                  <div className="h-44 relative w-full overflow-hidden bg-slate-100">
                    <img
                      src={car.image}
                      alt={car.model}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-0.5 text-xs font-bold text-slate-800 shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {car.rating}
                    </div>
                  </div>

                  {/* Info fields */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {car.company} &bull; {car.type}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 mt-1">
                        {car.brand} {car.model}
                      </h3>
                      <div className="flex gap-4 text-slate-500 text-xxs mt-2 font-bold">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {car.seats} Seats</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded">{car.transmission}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-3">
                      <div>
                        <span className="text-xxs text-slate-400 font-bold uppercase block">PER DAY</span>
                        <span className="text-lg font-extrabold text-primary-600">₹{car.pricePerDay.toLocaleString('en-IN')}</span>
                      </div>
                      <button
                        onClick={() => handleBookClick(car)}
                        className="bg-gradient-to-r from-primary-500 to-secondary-400 hover:from-primary-600 hover:to-secondary-500 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                      >
                        Rent Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
              <p className="text-xs text-slate-400">No rental cars matched your selection.</p>
              <button 
                onClick={() => { setTransmissionFilter('all'); setMaxPrice(10000); }}
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
        {selectedCar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCar(null)}
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
                  <Sparkles className="w-5 h-5 text-secondary-500" /> Book Vehicle Rental
                </span>
                <button
                  onClick={() => setSelectedCar(null)}
                  className="p-1 hover:bg-slate-50 rounded-lg"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleConfirmBooking} className="mt-5 space-y-4">
                {/* Car details */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>{selectedCar.company}</span>
                    <span>{selectedCar.transmission}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-700 mt-1">
                    {selectedCar.brand} {selectedCar.model} ({selectedCar.type})
                  </h4>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mt-2">
                    <span>Rate: ₹{selectedCar.pricePerDay.toLocaleString('en-IN')}/day</span>
                    <span>Location: {pickupLocation}</span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Lead Driver Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="Enter lead driver name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Pickup Depot Address
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Bengaluru Kempegowda Intl Airport Terminal 1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                {/* Rental Days */}
                <div>
                  <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Rental Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={rentalDays}
                    onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white"
                  />
                </div>

                {/* Total Details */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimated Cost ({rentalDays} days)</span>
                    <span className="text-xl font-extrabold text-primary-600">₹{(selectedCar.pricePerDay * rentalDays).toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    type="submit"
                    disabled={isBookingLoading}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold text-sm py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isBookingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Finalizing...
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

export default function CarsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    }>
      <CarSearchContent />
    </Suspense>
  );
}
