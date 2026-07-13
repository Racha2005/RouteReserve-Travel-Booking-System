'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Menu, X, User, LogOut, LayoutDashboard, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    router.push('/');
  };

  const navLinks = [
    { name: 'Flights', href: '/bookings/flights' },
    { name: 'Trains', href: '/bookings/trains' },
    { name: 'Buses', href: '/bookings/buses' },
    { name: 'Car Rental', href: '/bookings/cars' },
    { name: 'Packages', href: '#packages' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'glass-navbar py-3 shadow-md' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/logo.jpg"
                alt="RouteReserve Logo"
                className="w-12 h-12 rounded-xl shadow-xl border-2 border-slate-200 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className={`text-2xl font-extrabold tracking-wider transition-colors duration-300 ${
                scrolled ? 'text-slate-900' : 'text-slate-900'
              }`}>
                Route<span className="text-orange-500">Reserve</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* User Profile & Actions */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1.5 pr-3 bg-white/80 border border-slate-200 rounded-full hover:shadow-md hover:bg-white transition-all cursor-pointer"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-primary-500 object-cover"
                    />
                    <span className="text-xs font-bold text-slate-800">{user.name}</span>
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2.5 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-50 text-slate-800"
                      >
                        <Link
                          href="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-slate-50 rounded-xl transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary-500" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-sm py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-800 hover:text-primary-600 focus:outline-none cursor-pointer"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 shadow-lg"
            >
              <div className="px-4 pt-2 pb-6 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-semibold text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-xl transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  {isAuthenticated && user ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-2">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border-2 border-primary-500 object-cover"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-xl transition-all"
                      >
                        <LayoutDashboard className="w-5 h-5 text-primary-500" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-base font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all text-left cursor-pointer"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 px-3">
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="flex justify-center items-center py-2 px-4 border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="flex justify-center items-center py-2 px-4 bg-primary-500 text-white rounded-full text-sm font-bold hover:bg-primary-600 transition-all"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
