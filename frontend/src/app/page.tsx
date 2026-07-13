'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plane, Train, Bus, Car, 
  MapPin, Star, ShieldCheck, 
  TrendingUp, Clock, HelpCircle, 
  ChevronDown, ArrowRight, CheckCircle2, Send
} from 'lucide-react';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchSection from '@/components/booking/SearchSection';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const destinations = [
    { name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', rating: 4.9, price: '$720', description: 'Experience the blend of neon streets and ancient temples.' },
    { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', rating: 4.8, price: '$580', description: 'Wander along the Seine and admire the Eiffel Tower.' },
    { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', rating: 4.7, price: '$850', description: 'Marvel at futuristic skyscrapers and golden desert dunes.' },
    { name: 'London, UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80', rating: 4.8, price: '$610', description: 'Explore historic royal palaces and thriving modern cultures.' }
  ];

  const packages = [
    { title: 'Maldives Overwater Sanctuary', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80', duration: '5 Days / 4 Nights', price: '$1,499', rating: 4.9 },
    { title: 'Swiss Alps Hiking Expedition', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', duration: '7 Days / 6 Nights', price: '$1,150', rating: 4.8 },
    { title: 'Historic Kyoto Exploration', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', duration: '6 Days / 5 Nights', price: '$980', rating: 4.9 }
  ];

  const stats = [
    { value: '150+', label: 'Destinations Worldwide' },
    { value: '1.2M+', label: 'Happy Travelers' },
    { value: '99.8%', label: 'On-Time Routing' },
    { value: '45+', label: 'Transport Partners' }
  ];

  const testimonials = [
    { name: 'Sarah Jenkins', role: 'Business Consultant', quote: 'RouteReserve completely changed how I travel for work. Booking a flight, matching it with an express train, and hiring a car took under five minutes. The unified itinerary is a lifesaver.', rating: 5 },
    { name: 'Marcus Vance', role: 'Adventure Photographer', quote: 'I love traveling off the beaten path. RouteReserve is the only booking site that handles small local bus systems and cross-country train connections seamlessly alongside international flights.', rating: 5 }
  ];

  const faqs = [
    { question: 'What is RouteReserve?', answer: 'RouteReserve is a unified travel reservation platform. We allow travelers to search, plan, book, and manage flights, trains, buses, and car rentals all in one transaction, under one unified account and billing statement.' },
    { question: 'How do I cancel or update my booking?', answer: 'You can easily view, modify, or request cancellations for any leg of your trip directly through your RouteReserve Dashboard under Booking History. Refund criteria are determined by the individual transit operators.' },
    { question: 'Is my payment secure?', answer: 'Yes. RouteReserve complies with PCI-DSS standards, employing end-to-end SSL encryption for credit card transactions and supporting secured mobile wallets like Apple Pay and Google Pay.' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 bg-gradient-to-tr from-ocean-900 via-primary-700 to-secondary-500 overflow-hidden">
        {/* Dynamic backdrop grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/10 w-[30vw] h-[30vw] rounded-full bg-white/5 blur-[120px] pointer-events-none animate-pulse-slow" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold py-1.5 px-4 rounded-full mb-6 tracking-wider uppercase">
              The Next-Gen Unified Travel Engine
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md"
          >
            One Platform. <span className="text-orange-300">Unlimited Routes.</span> Seamless Reservation.
          </motion.h1>

          {/* Branded Logo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col items-center justify-center gap-3 my-8"
          >
            <img
              src="/logo.jpg"
              alt="RouteReserve Brand Logo"
              className="w-24 h-24 rounded-3xl shadow-2xl border-4 border-white/20 object-cover backdrop-blur-md"
            />
            <span className="text-3xl font-extrabold text-white tracking-widest uppercase">
              Route<span className="text-orange-400">Reserve</span>
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/85 text-base sm:text-lg md:text-xl font-medium mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Align flights, trains, buses, and car rentals into a single ticket. Simplify your journey with RouteReserve.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/bookings/flights"
              className="bg-white text-orange-600 hover:bg-slate-50 font-bold px-8 py-3 rounded-full shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Start Exploring
            </Link>
            <Link
              href="/register"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-3 rounded-full transition-transform hover:-translate-y-0.5"
            >
              Create Account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Booking Search Widget */}
      <SearchSection />

      {/* Popular Destinations */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Popular Destinations</h2>
            <p className="text-slate-500 text-sm mt-2">Explore our most booked locations this month</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.map((dest, idx) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-800">{dest.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-800">{dest.name}</h3>
                  <p className="text-slate-500 text-xs leading-normal mt-1.5 h-12">
                    {dest.description}
                  </p>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
                    <div>
                      <span className="text-xxs text-slate-400 font-bold uppercase block">Starting from</span>
                      <span className="text-lg font-extrabold text-primary-600">{dest.price}</span>
                    </div>
                    <Link
                      href={`/bookings/flights?to=${encodeURIComponent(dest.name.split(',')[0])}`}
                      className="p-2 bg-slate-50 hover:bg-primary-500 text-slate-600 hover:text-white rounded-full transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20 bg-white" id="packages">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">Featured Travel Packages</h2>
            <p className="text-slate-500 text-sm mt-2">All-inclusive stays, tours, and routing curated by experts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <motion.div
                key={pkg.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-4 left-4 bg-primary-600 text-white font-bold text-xxs px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {pkg.duration}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-primary-600 transition-colors">
                    {pkg.title}
                  </h3>
                  <div className="flex justify-between items-center mt-6">
                    <div>
                      <span className="text-xxs text-slate-400 font-bold uppercase block">PER PERSON</span>
                      <span className="text-xl font-extrabold text-slate-800">{pkg.price}</span>
                    </div>
                    <Link
                      href="/bookings/flights"
                      className="bg-white border border-slate-200 text-slate-700 hover:bg-primary-500 hover:text-white font-bold text-xs py-2 px-4 rounded-xl transition-colors duration-200 shadow-sm"
                    >
                      Book Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Why Choose RouteReserve</h2>
            <p className="text-slate-500 text-sm mt-2">Revolutionizing how multi-transit booking works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Unified Reservation Guarantee</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Book your flight, train, and car in one click. If a flight delay causes you to miss a connection train, we reschedule it free of charge.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-secondary-50 text-secondary-600 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Dynamic Rates & Savings</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                By packaging air routes with train links and regional bus routes, our algorithm identifies savings up to 35% compared to purchasing individually.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-ocean-50 text-ocean-600 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">24/7 Route Surveillance</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Our operations team tracks all links in real-time. Receive automated notifications and dynamic routes changes on the fly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-slate-900 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 to-secondary-900/30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-primary-300 block mb-2">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">What Our Travelers Say</h2>
            <p className="text-slate-500 text-sm mt-2">Hear directly from verified RouteReserve members</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, idx) => (
              <div key={t.name} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col justify-between shadow-sm relative">
                <div>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200/55">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-800">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{t.name}</h4>
                    <span className="text-xxs text-slate-400 font-bold uppercase">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-sm mt-2">Need help? Browse our answers below.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    suppressHydrationWarning={true}
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center px-6 py-4 text-left font-bold text-slate-800 text-sm md:text-base focus:outline-none cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm text-slate-500 leading-relaxed border-t border-slate-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl font-black tracking-tight mb-3">Join the RouteReserve Circle</h2>
          <p className="text-white/80 text-sm max-w-md mx-auto mb-8">
            Subscribe to our newsletter to receive exclusive travel discounts, multi-transit routing hacks, and platform announcements.
          </p>

          {newsletterSubscribed ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md mx-auto flex items-center justify-center gap-3"
            >
              <CheckCircle2 className="w-6 h-6 text-secondary-200" />
              <span className="text-sm font-bold">Successfully Subscribed! Enjoy 10% off your first route booking.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                suppressHydrationWarning={true}
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl py-3 px-4 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-200 focus:bg-white/20 transition-all"
              />
              <button
                suppressHydrationWarning={true}
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
