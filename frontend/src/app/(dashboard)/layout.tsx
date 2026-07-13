'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, LayoutDashboard, Plane, 
  Train, Bus, Car, History, 
  User, Settings, LogOut, Bell, Menu, X, ChevronRight 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Notifications dummy state
  const notifications = [
    { id: 1, title: 'Flight SA-102 Rescheduled', body: 'New departure is 08:45 AM. Platform gate changed.', time: '10m ago', unread: true },
    { id: 2, title: 'Car Rental Confirmed', body: 'Tesla Model 3 is reserved for pickup at LHR.', time: '2h ago', unread: false },
    { id: 3, title: 'Email Verified', body: 'Thank you for verifying your RouteReserve email.', time: '1d ago', unread: false },
  ];

  // Route Guard: Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="p-4 bg-white/10 rounded-full border border-white/20 animate-spin mb-4">
          <Compass className="w-8 h-8 text-primary-400" />
        </div>
        <p className="text-sm font-semibold tracking-wider animate-pulse">
          Securing Route Connections...
        </p>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Book Flights', href: '/bookings/flights', icon: Plane },
    { name: 'Book Trains', href: '/bookings/trains', icon: Train },
    { name: 'Book Buses', href: '/bookings/buses', icon: Bus },
    { name: 'Book Cars', href: '/bookings/cars', icon: Car },
    { name: 'Booking History', href: '/bookings/history', icon: History },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* 1. Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 text-slate-400 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3 overflow-hidden">
          <img
            src="/logo.jpg"
            alt="RouteReserve Logo"
            className="w-10 h-10 rounded-xl border border-slate-700 object-cover flex-shrink-0"
          />
          {sidebarOpen && (
            <span className="text-xl font-extrabold text-white tracking-wider animate-fade-in">
              Route<span className="text-orange-500">Reserve</span>
            </span>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800 flex flex-col gap-2">
          {sidebarOpen ? (
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <img
                src={user?.avatar}
                alt="user avatar"
                className="w-9 h-9 rounded-full border-2 border-primary-500 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="mx-auto p-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 text-slate-400 z-50 flex flex-col p-4"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.jpg"
                    alt="RouteReserve Logo"
                    className="w-10 h-10 rounded-xl border border-slate-700 object-cover"
                  />
                  <span className="text-xl font-extrabold text-white tracking-wider">
                    Route<span className="text-orange-500">Reserve</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 hover:bg-slate-800 text-slate-400 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-slate-800 pt-4 mt-auto">
                <div className="flex items-center gap-3 px-2 mb-4">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full border-2 border-primary-500 object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{user?.name}</h4>
                    <span className="text-[10px] text-slate-500">{user?.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-red-400 text-sm font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle for Desktop */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex p-1.5 hover:bg-slate-50 text-slate-500 rounded-lg focus:outline-none cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Sidebar toggle for Mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 hover:bg-slate-50 text-slate-500 rounded-lg focus:outline-none cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-slate-800">
              {pathname === '/dashboard' ? 'Overview' : 'Booking Center'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Alert Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-50 rounded-xl relative transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-slate-800 overflow-hidden"
                    >
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800">Notifications</span>
                        <span className="text-[10px] text-primary-500 font-bold hover:underline cursor-pointer">Mark all as read</span>
                      </div>
                      <div className="mt-2 divide-y divide-slate-50 max-h-64 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className="py-2.5 hover:bg-slate-50 px-2 rounded-xl transition-all cursor-pointer">
                            <div className="flex justify-between items-start gap-2">
                              <h5 className="text-xs font-bold text-slate-800">{n.title}</h5>
                              <span className="text-[9px] text-slate-400 whitespace-nowrap">{n.time}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{n.body}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-all focus:outline-none cursor-pointer border border-transparent hover:border-slate-100"
              >
                <img
                  src={user?.avatar}
                  alt="user avatar"
                  className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                />
                <span className="hidden sm:inline text-xs font-bold text-slate-700">
                  {user?.name}
                </span>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 text-slate-800"
                    >
                      <div className="px-2 py-1.5 border-b border-slate-100 mb-2">
                        <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-red-500 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dashboard Pages Root */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
