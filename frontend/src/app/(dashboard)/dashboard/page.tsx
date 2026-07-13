'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Plane, Train, Bus, Car, 
  DollarSign, MapPin, Calendar, 
  TrendingUp, Award, BellRing, ChevronRight, CheckCircle, Clock 
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { useAuth } from '@/context/AuthContext';
import { getLocalBookings, Booking } from '@/services/mockDb';
import { flightService } from '@/services/flight.service';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refresh, setRefresh] = useState(0);

  // Sync state with local DB
  useEffect(() => {
    setBookings(getLocalBookings());
  }, [refresh]);

  // Aggregate stats
  const activeBookings = bookings.filter(b => b.status === 'upcoming');
  const totalSpent = bookings.reduce((sum, b) => b.status !== 'cancelled' ? sum + b.totalPrice : sum, 0);
  
  // Counts by transport type
  const transportCounts = bookings.reduce(
    (acc, b) => {
      if (b.status !== 'cancelled') {
        acc[b.type] = (acc[b.type] || 0) + 1;
      }
      return acc;
    },
    { flight: 0, train: 0, bus: 0, car: 0 } as Record<string, number>
  );

  // Doughnut Chart Data: Distribution of Transit Modes
  const doughnutData = {
    labels: ['Flights', 'Trains', 'Buses', 'Car Rentals'],
    datasets: [
      {
        data: [transportCounts.flight, transportCounts.train, transportCounts.bus, transportCounts.car],
        backgroundColor: ['#0ea5e9', '#14b8a6', '#f59e0b', '#3b82f6'],
        borderWidth: 1,
      },
    ],
  };

  // Line Chart Data: Monthly Travel Spending (Mock Trend line)
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Travel Spending (₹)',
        data: [20000, 45000, 15000, 60000, 32000, 89000, totalSpent > 0 ? totalSpent : 40000],
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Cancel Handler
  const handleCancelBooking = async (id: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await flightService.cancelBooking(id);
        setRefresh(prev => prev + 1); // trigger state update
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-primary-500/10 via-secondary-500/5 to-transparent border border-white/30"
      >
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Welcome Back, {user?.name}!
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-md leading-relaxed">
            Your connections are fully active. You have {activeBookings.length} upcoming reservations scheduled for next month.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/bookings/flights"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            New Reservation
          </Link>
          <Link
            href="/bookings/history"
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Manage Trips
          </Link>
        </div>
      </motion.div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-primary-50 text-primary-500 rounded-xl w-12 h-12 flex items-center justify-center font-extrabold text-lg">
            ₹
          </div>
          <div>
            <span className="text-xxs text-slate-400 font-bold uppercase tracking-wider block">Total Spent</span>
            <span className="text-lg font-extrabold text-slate-800">₹{totalSpent.toLocaleString('en-IN')}</span>
          </div>
        </div>
        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-secondary-50 text-secondary-500 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xxs text-slate-400 font-bold uppercase tracking-wider block">Total Bookings</span>
            <span className="text-lg font-extrabold text-slate-800">{bookings.length}</span>
          </div>
        </div>
        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-500 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xxs text-slate-400 font-bold uppercase tracking-wider block">Upcoming Active</span>
            <span className="text-lg font-extrabold text-slate-800">{activeBookings.length}</span>
          </div>
        </div>
        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-500 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xxs text-slate-400 font-bold uppercase tracking-wider block">Loyalty Tier</span>
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
              Explorer Gold
            </span>
          </div>
        </div>
      </div>

      {/* 3. Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-primary-500" /> Spending Overview
          </h3>
          <div className="h-64">
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 mb-4">
            Transit Distribution
          </h3>
          <div className="h-48 max-w-[200px] mx-auto flex items-center justify-center">
            {bookings.length > 0 ? (
              <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            ) : (
              <p className="text-xs text-slate-400">No bookings available</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-semibold text-slate-500 border-t border-slate-50 pt-3">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary-500" /> Flights</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary-500" /> Trains</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Buses</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Cars</div>
          </div>
        </div>
      </div>

      {/* 4. Active Itineraries & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Itineraries */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Active Upcoming Itineraries</h3>
            <Link href="/bookings/history" className="text-xs font-bold text-primary-500 hover:underline flex items-center">
              View All <ChevronRight className="w-4.5 h-4.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {activeBookings.length > 0 ? (
              activeBookings.map((b) => (
                <div key={b.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-lg flex items-center justify-center h-12 w-12 flex-shrink-0">
                      {b.type === 'flight' ? '✈️' : b.type === 'train' ? '🚆' : b.type === 'bus' ? '🚌' : '🚗'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 uppercase">
                          {b.type} reservation
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {b.id}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-700 mt-1">
                        {b.type === 'car' ? `${b.details.brand} ${b.details.model}` : `${b.details.from} to ${b.details.to}`}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {b.type === 'car' ? b.details.pickupDate : b.details.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto justify-end border-t border-slate-50 md:border-none pt-3 md:pt-0">
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 text-xxs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer"
                    >
                      Cancel Route
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
                <p className="text-xs text-slate-400">No active reservations.</p>
                <Link href="/bookings/flights" className="inline-block text-xs font-bold text-primary-500 mt-2 hover:underline">
                  Book your first trip now &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Travel Recommendations */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Recommended Routes</h3>
          <div className="space-y-3">
            <div className="group border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
              <div className="h-28 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1542082855-e138a22a3706?auto=format&fit=crop&w=400&q=80"
                  alt="Leh Ladakh"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-slate-800">Himalayan Expedition</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-[11px] text-slate-500 font-medium">Delhi to Leh Ladakh (Flight)</span>
                <span className="text-xs font-bold text-primary-600">₹8,500</span>
              </div>
            </div>

            <div className="group border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
              <div className="h-28 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80"
                  alt="London"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-slate-800">Imperial Gateway</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-[11px] text-slate-500 font-medium">Delhi to London (Flight)</span>
                <span className="text-xs font-bold text-primary-600">₹54,000 ($650)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
