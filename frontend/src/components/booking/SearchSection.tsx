'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plane, Train, Bus, Car, Calendar, MapPin, Search } from 'lucide-react';

type SearchTab = 'flight' | 'train' | 'bus' | 'car';

export default function SearchSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>('flight');
  
  // Fields state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [location, setLocation] = useState(''); // for car

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'flight') {
      router.push(`/bookings/flights?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
    } else if (activeTab === 'train') {
      router.push(`/bookings/trains?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
    } else if (activeTab === 'bus') {
      router.push(`/bookings/buses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
    } else if (activeTab === 'car') {
      router.push(`/bookings/cars?location=${encodeURIComponent(location)}&pickupDate=${date}&returnDate=${returnDate}`);
    }
  };

  const tabs = [
    { id: 'flight', label: 'Flights', icon: Plane },
    { id: 'train', label: 'Trains', icon: Train },
    { id: 'bus', label: 'Buses', icon: Bus },
    { id: 'car', label: 'Car Rentals', icon: Car },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto -mt-16 relative z-20 px-4">
      {/* Tab Selectors */}
      <div className="flex gap-2 mb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              suppressHydrationWarning={true}
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as SearchTab);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white text-orange-600 shadow-md border-b-2 border-orange-500'
                  : 'bg-white/70 backdrop-blur-md text-slate-600 hover:bg-white hover:text-orange-500 border-b border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Form Area */}
      <div className="bg-white rounded-2xl rounded-tl-none shadow-xl border border-slate-100 p-6 md:p-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {activeTab !== 'car' ? (
            <>
              {/* Origin */}
              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary-500" /> Origin
                </label>
                <input
                  suppressHydrationWarning={true}
                  type="text"
                  required
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="City or Airport"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-secondary-500" /> Destination
                </label>
                <input
                  suppressHydrationWarning={true}
                  type="text"
                  required
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="City or Station"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary-500" /> Date
                </label>
                <input
                  suppressHydrationWarning={true}
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
            </>
          ) : (
            <>
              {/* Pickup Location */}
              <div className="md:col-span-2">
                <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary-500" /> Pickup Location
                </label>
                <input
                  suppressHydrationWarning={true}
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Airport or Office"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>

              {/* Pickup Date */}
              <div>
                <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary-500" /> Pickup Date
                </label>
                <input
                  suppressHydrationWarning={true}
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
              </div>
            </>
          )}

          {/* Return Date / Search Button block */}
          {activeTab === 'car' ? (
            <div>
              <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-secondary-500" /> Return Date
              </label>
              <input
                suppressHydrationWarning={true}
                type="date"
                required
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
          ) : null}

          {/* Search Button */}
          <div className={`${activeTab === 'car' ? 'md:col-span-4 mt-2' : ''}`}>
            <button
              suppressHydrationWarning={true}
              type="submit"
              className="w-full bg-gradient-to-r from-primary-500 via-secondary-500 to-orange-500 hover:from-primary-600 hover:via-secondary-600 hover:to-orange-600 text-white font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              Search Options
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
