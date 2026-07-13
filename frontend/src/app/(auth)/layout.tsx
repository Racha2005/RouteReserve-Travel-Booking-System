'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-gradient-to-tr from-ocean-900 via-primary-700 to-secondary-500 overflow-hidden">
      {/* Decorative Floating Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/10 blur-[80px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary-300/10 blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex items-center gap-2 group">
            <img
              src="/logo.jpg"
              alt="RouteReserve Logo"
              className="w-12 h-12 rounded-2xl shadow-lg border border-white/20 object-cover transition-all duration-300 group-hover:scale-105 group-hover:rotate-6"
            />
            <span className="text-2xl font-extrabold text-white tracking-wider drop-shadow-md">
              Route<span className="text-orange-300">Reserve</span>
            </span>
          </Link>
          <p className="text-white/80 text-sm mt-2 font-medium tracking-wide">
            Unified Travel Reservation Platform
          </p>
        </div>

        {/* Auth Box with Premium Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 text-white"
        >
          {children}
        </motion.div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-white/70 hover:text-white text-xs font-semibold tracking-wider transition-all duration-200"
          >
            &larr; BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
