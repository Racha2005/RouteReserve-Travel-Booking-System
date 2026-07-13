'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, ArrowLeft, Printer, 
  LayoutDashboard, History, Calendar, 
  User, DollarSign, Compass, Loader2 
} from 'lucide-react';
import { getLocalBookings, Booking } from '@/services/mockDb';

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      const list = getLocalBookings();
      const item = list.find((b) => b.id === bookingId);
      if (item) {
        setBooking(item);
      }
    }
    setLoading(false);
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
        <p className="text-xs font-semibold">Generating invoice receipt...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center max-w-md mx-auto shadow-xl mt-12">
        <h3 className="text-lg font-black text-slate-800">Booking Receipt Not Found</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          The booking reference link is invalid, or the transaction has not completed.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-primary-600 text-white font-bold text-xs py-2 px-6 rounded-xl mt-6 hover:bg-primary-700 transition-all shadow-md"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'flight': return '✈️';
      case 'train': return '🚆';
      case 'bus': return '🚌';
      case 'car': return '🚗';
      default: return '📍';
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> BACK TO DASHBOARD
      </Link>

      {/* Confirmation Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        {/* Success Header */}
        <div className="text-center pb-6 border-b border-slate-100">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-50 text-emerald-500 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Booking Confirmed!</h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-snug">
            Your travel tickets have been verified. An confirmation email with receipt PDF has been dispatched.
          </p>
        </div>

        {/* Invoice Summary Details */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>RECEIPT DETAIL</span>
            <span className="font-mono text-slate-700">REF: {booking.id}</span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
            {/* Title / Itinerary */}
            <div className="flex gap-4">
              <div className="text-3xl bg-white border border-slate-100 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                {getTransportIcon(booking.type)}
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                  {booking.type} Ticket
                </span>
                <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                  {booking.type === 'car' ? `${booking.details.brand} ${booking.details.model}` : `${booking.details.from} to ${booking.details.to}`}
                </h3>
              </div>
            </div>

            {/* Passenger, Date, Seat */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-200/50 pt-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Traveler</span>
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {booking.type === 'car' ? booking.details.driverName : booking.details.passengerName}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  {booking.details.tripType === 'roundtrip' ? 'Outbound Date' : 'Scheduled Date'}
                </span>
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {booking.type === 'car' ? booking.details.pickupDate : booking.details.date}
                </span>
              </div>
              {booking.details.tripType === 'roundtrip' && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Return Date</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {booking.details.returnDate || '1 Week Later'}
                  </span>
                </div>
              )}
              {booking.details.seat && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Seat Assignment</span>
                  <span className="font-bold text-slate-700">{booking.details.seat}</span>
                </div>
              )}
              {booking.details.class && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Service Class</span>
                  <span className="font-bold text-slate-700">{booking.details.class}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="flex justify-between items-center bg-slate-900 text-white rounded-2xl p-5 shadow-inner">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">TOTAL AMOUNT PAID</span>
            <span className="text-xl font-extrabold text-white flex items-center gap-0.5">
              {booking.type === 'flight' && booking.details.isInternational 
                ? `₹${booking.totalPrice.toLocaleString('en-IN')} ($${Math.round(booking.totalPrice / 83).toLocaleString('en-US')})` 
                : `₹${booking.totalPrice.toLocaleString('en-IN')}`}
            </span>
          </div>
          <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xxs px-3 py-1.5 rounded-full uppercase tracking-wider">
            Paid Secured
          </span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-6">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-white border border-primary-500 hover:bg-primary-50 text-primary-600 font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" /> Go Dashboard
          </Link>
          <Link
            href="/bookings/history"
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <History className="w-4 h-4" /> View History
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
