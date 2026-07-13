'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Send } from 'lucide-react';
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  const linksCompany = [
    { name: 'About Us', href: '#about' },
    { name: 'Careers', href: '#' },
    { name: 'Press Kit', href: '#' },
    { name: 'Mobile App', href: '#' },
  ];

  const linksServices = [
    { name: 'Flight Reservations', href: '/bookings/flights' },
    { name: 'Train Booking', href: '/bookings/trains' },
    { name: 'Bus Ticketing', href: '/bookings/buses' },
    { name: 'Car Rentals', href: '/bookings/cars' },
  ];

  const linksSupport = [
    { name: 'Help Center', href: '#' },
    { name: 'Safety Resources', href: '#' },
    { name: 'Cancellation Options', href: '#' },
    { name: 'Contact Us', href: '#' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <img
                src="/logo.jpg"
                alt="RouteReserve Logo"
                className="w-9 h-9 rounded-xl shadow-lg border border-slate-800 object-cover"
              />
              <span className="text-xl font-extrabold text-white tracking-wider">
                Route<span className="text-orange-500">Reserve</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
              RouteReserve is the next-generation unified booking platform. We align flights, trains, buses, and car rentals into a single, cohesive booking journey, saving you time and cost.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary-500 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary-500 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary-500 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-primary-500 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <FaLinkedinIn className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {linksCompany.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5">
              {linksServices.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2.5">
              {linksSupport.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 RouteReserve Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
