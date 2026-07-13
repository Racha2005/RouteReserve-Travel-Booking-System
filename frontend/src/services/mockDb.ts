// Simple local database state for RouteReserve mockup when backend is unavailable.
// Persists items in localStorage.

export interface Flight {
  id: string;
  airline: string;
  logo: string;
  flightNumber: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  price: number;
  class: string;
  isInternational?: boolean;
}

export interface Train {
  id: string;
  name: string;
  trainNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  class: string;
}

export interface Bus {
  id: string;
  operator: string;
  type: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  rating: number;
}

export interface CarRental {
  id: string;
  model: string;
  brand: string;
  type: string; // SUV, Sedan, etc.
  transmission: 'Automatic' | 'Manual';
  seats: number;
  pricePerDay: number;
  company: string;
  image: string;
  rating: number;
}

export interface Booking {
  id: string;
  userId: string;
  type: 'flight' | 'train' | 'bus' | 'car';
  itemId: string; // Flight ID, Train ID, etc.
  details: any; // Dynamic details like passengers, dates, seat number
  totalPrice: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

// Pre-populated catalog items
export const FLIGHTS_CATALOG: Flight[] = [
  { id: 'f1', airline: 'IndiGo Airlines', logo: '✈️', flightNumber: '6E-204', from: 'Delhi', fromCode: 'DEL', to: 'Mumbai', toCode: 'BOM', departureTime: '08:30 AM', arrivalTime: '10:45 AM', duration: '2h 15m', stops: 0, price: 5400, class: 'Economy', isInternational: false },
  { id: 'f2', airline: 'Air India', logo: '✈️', flightNumber: 'AI-405', from: 'Mumbai', fromCode: 'BOM', to: 'Goa', toCode: 'GOI', departureTime: '11:15 AM', arrivalTime: '12:30 PM', duration: '1h 15m', stops: 0, price: 3800, class: 'Economy', isInternational: false },
  { id: 'f3', airline: 'Vistara Connect', logo: '✈️', flightNumber: 'UK-881', from: 'Bengaluru', fromCode: 'BLR', to: 'Delhi', toCode: 'DEL', departureTime: '04:45 PM', arrivalTime: '07:30 PM', duration: '2h 45m', stops: 0, price: 6200, class: 'Economy', isInternational: false },
  { id: 'f4', airline: 'Air India', logo: '✈️', flightNumber: 'AI-101', from: 'Delhi', fromCode: 'DEL', to: 'London', toCode: 'LHR', departureTime: '10:00 PM', arrivalTime: '08:00 AM', duration: '14h 30m', stops: 1, price: 54000, class: 'Business', isInternational: true },
  { id: 'f5', airline: 'Emirates Connect', logo: '✈️', flightNumber: 'EK-712', from: 'Mumbai', fromCode: 'BOM', to: 'Dubai', toCode: 'DXB', departureTime: '02:00 PM', arrivalTime: '05:30 PM', duration: '4h 0m', stops: 0, price: 28000, class: 'Business', isInternational: true },
  { id: 'f6', airline: 'Singapore Airlines', logo: '✈️', flightNumber: 'SQ-423', from: 'Bengaluru', fromCode: 'BLR', to: 'Singapore', toCode: 'SIN', departureTime: '11:00 PM', arrivalTime: '06:00 AM', duration: '4h 30m', stops: 0, price: 32000, class: 'Economy', isInternational: true },
];

export const TRAINS_CATALOG: Train[] = [
  { id: 't1', name: 'Rajdhani Express', trainNumber: 'RE-12951', from: 'Mumbai', to: 'Delhi', departureTime: '05:00 PM', arrivalTime: '08:30 AM', duration: '15h 30m', price: 2400, class: 'AC First Class' },
  { id: 't2', name: 'Vande Bharat Express', trainNumber: 'VB-22436', from: 'Delhi', to: 'Varanasi', departureTime: '06:00 AM', arrivalTime: '02:00 PM', duration: '8h 0m', price: 1800, class: 'AC Chair Car' },
  { id: 't3', name: 'Shatabdi Express', trainNumber: 'SE-12007', from: 'Bengaluru', to: 'Chennai', departureTime: '06:00 AM', arrivalTime: '11:00 AM', duration: '5h 0m', price: 1200, class: 'AC Chair Car' },
  { id: 't4', name: 'Tejas Express', trainNumber: 'TE-22672', from: 'Madurai', to: 'Chennai', departureTime: '03:00 PM', arrivalTime: '09:15 PM', duration: '6h 15m', price: 1500, class: 'Executive Class' },
];

export const BUSES_CATALOG: Bus[] = [
  { id: 'b1', operator: 'KSRTC Ambaari Dream Class', type: 'AC Multi-Axle Sleeper', from: 'Bengaluru', to: 'Goa', departureTime: '09:00 PM', arrivalTime: '08:00 AM', duration: '11h 0m', price: 1600, rating: 4.6 },
  { id: 'b2', operator: 'SRS Travels', type: 'AC Sleeper', from: 'Mumbai', to: 'Pune', departureTime: '06:00 PM', arrivalTime: '10:00 PM', duration: '4h 0m', price: 650, rating: 4.2 },
  { id: 'b3', operator: 'Zingbus Premium', type: 'AC Sleeper', from: 'Delhi', to: 'Jaipur', departureTime: '11:30 PM', arrivalTime: '05:00 AM', duration: '5h 30m', price: 800, rating: 4.4 },
  { id: 'b4', operator: 'VRL Travels', type: 'AC Multi-Axle Semi-Sleeper', from: 'Pune', to: 'Bengaluru', departureTime: '04:00 PM', arrivalTime: '08:00 AM', duration: '16h 0m', price: 2200, rating: 4.5 },
];

export const CARS_CATALOG: CarRental[] = [
  { id: 'c1', model: 'Mahindra Thar 4x4', brand: 'Mahindra', type: 'SUV Offroad', transmission: 'Manual', seats: 4, pricePerDay: 4500, company: 'Zoomcar Premium', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80', rating: 4.8 },
  { id: 'c2', model: 'Tata Nexon EV', brand: 'Tata', type: 'Electric SUV', transmission: 'Automatic', seats: 5, pricePerDay: 3200, company: 'Myles Drive', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=400&q=80', rating: 4.6 },
  { id: 'c3', model: 'Maruti Suzuki Swift', brand: 'Suzuki', type: 'Hatchback', transmission: 'Manual', seats: 5, pricePerDay: 1800, company: 'Revv India', image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80', rating: 4.4 },
  { id: 'c4', model: 'Toyota Innova Crysta', brand: 'Toyota', type: 'Luxury MUV', transmission: 'Automatic', seats: 7, pricePerDay: 6000, company: 'Avis India', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80', rating: 4.9 },
];

const INITIAL_BOOKINGS: Booking[] = [];

// Runtime cache for dynamically generated routes so booking actions can locate them
export let DYNAMIC_FLIGHTS_CACHE: Flight[] = [];
export let DYNAMIC_BUSES_CACHE: Bus[] = [];
export let DYNAMIC_TRAINS_CACHE: Train[] = [];

// LocalStorage helpers
export const getLocalBookings = (): Booking[] => {
  if (typeof window === 'undefined') return INITIAL_BOOKINGS;
  
  // Force reset old cached bookings once to start with a clean empty history list
  const isForceResetDone = localStorage.getItem('routereserve_history_cleared_v3');
  if (!isForceResetDone) {
    localStorage.setItem('routereserve_bookings', JSON.stringify([]));
    localStorage.setItem('routereserve_history_cleared_v3', 'true');
    return [];
  }

  const stored = localStorage.getItem('routereserve_bookings');
  if (!stored) {
    localStorage.setItem('routereserve_bookings', JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const saveLocalBookings = (bookings: Booking[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('routereserve_bookings', JSON.stringify(bookings));
  }
};
