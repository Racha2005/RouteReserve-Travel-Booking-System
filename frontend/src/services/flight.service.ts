import { api, shouldMock, delay } from './api';
import { FLIGHTS_CATALOG, getLocalBookings, saveLocalBookings, Booking, Flight, DYNAMIC_FLIGHTS_CACHE } from './mockDb';
export type { Flight };

export const flightService = {
  search: async (params: { from: string; to: string; date: string; class?: string }): Promise<Flight[]> => {
    if (shouldMock()) {
      await delay(1200); // simulate network latency
      const queryFrom = params.from.toLowerCase().trim();
      const queryTo = params.to.toLowerCase().trim();
      
      let matched = FLIGHTS_CATALOG.filter(flight => 
        (flight.from.toLowerCase().includes(queryFrom) || flight.fromCode.toLowerCase().includes(queryFrom)) &&
        (flight.to.toLowerCase().includes(queryTo) || flight.toCode.toLowerCase().includes(queryTo))
      );

      // Dynamic generator fallback if no direct matches
      if (matched.length === 0 && params.from && params.to) {
        const fromCapitalized = params.from.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const toCapitalized = params.to.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        const fromCode = fromCapitalized.slice(0, Math.min(3, fromCapitalized.length)).toUpperCase();
        const toCode = toCapitalized.slice(0, Math.min(3, toCapitalized.length)).toUpperCase();
        
        const isInternational = !(['delhi', 'mumbai', 'bengaluru', 'goa', 'chennai', 'kolkata', 'hyderabad', 'jaipur', 'leh', 'kochi', 'varanasi', 'india'].some(city => queryTo.includes(city) || queryFrom.includes(city)));
        
        // Calculate date difference (closer departure dates increase costs)
        const today = new Date('2026-07-13'); // Conversation local time reference
        const searchDate = new Date(params.date || '2026-07-13');
        const diffTime = searchDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isClose = diffDays <= 30; // Within 1 month / 30 days of departure

        let basePrice = 5400;
        if (isInternational) {
          // International flights: 1 Lakh+ if close departure, otherwise 54k base
          basePrice = isClose ? 110000 : 54000;
        } else {
          // Domestic flights: 10k-30k if close departure, otherwise 5.4k base
          basePrice = isClose ? 16200 : 5400;
        }

        // Generate 10+ varied flight options
        const airlines = isInternational 
          ? [
              { name: 'Skyline Airways', logo: '✈️', code: 'SA' },
              { name: 'Air India', logo: '🇮🇳', code: 'AI' },
              { name: 'Swiss International', logo: '🇨🇭', code: 'LX' },
              { name: 'Emirates', logo: '🇦🇪', code: 'EK' },
              { name: 'Qatar Airways', logo: '🇶🇦', code: 'QR' },
              { name: 'Singapore Airlines', logo: '🇸🇬', code: 'SQ' },
              { name: 'Lufthansa', logo: '🇩🇪', code: 'LH' },
              { name: 'British Airways', logo: '🇬🇧', code: 'BA' },
              { name: 'Vistara', logo: '✈️', code: 'UK' },
              { name: 'Indigo Global', logo: '✈️', code: '6E' }
            ]
          : [
              { name: 'IndiGo', logo: '✈️', code: '6E' },
              { name: 'Air India', logo: '🇮🇳', code: 'AI' },
              { name: 'Vistara', logo: '✈️', code: 'UK' },
              { name: 'Akasa Air', logo: '✈️', code: 'QP' },
              { name: 'SpiceJet', logo: '✈️', code: 'SG' },
              { name: 'Skyline Airways', logo: '✈️', code: 'SA' },
              { name: 'Air India Express', logo: '✈️', code: 'IX' },
              { name: 'Alliance Air', logo: '✈️', code: '9I' },
              { name: 'Star Air', logo: '✈️', code: 'S5' },
              { name: 'IndiGo Connect', logo: '✈️', code: '6E' }
            ];

        matched = airlines.map((air, index) => {
          const multiplier = 1 + (index * 0.08); // Vary prices across options
          const finalPrice = Math.round(basePrice * multiplier);
          const stops = isInternational ? (index === 2 || index === 5 ? 0 : 1) : (index % 3 === 0 ? 1 : 0);
          
          // Generate realistic times
          const hour = 5 + (index * 2) % 18;
          const depTime = `${hour.toString().padStart(2, '0')}:${index % 2 === 0 ? '15' : '45'} ${hour < 12 ? 'AM' : 'PM'}`;
          const arrHour = (hour + (isInternational ? 11 : 2)) % 12 || 12;
          const arrTime = `${arrHour.toString().padStart(2, '0')}:${index % 2 === 0 ? '45' : '15'} ${hour + (isInternational ? 11 : 2) >= 12 ? 'PM' : 'AM'}`;

          return {
            id: `f_dyn_${index + 1}`,
            airline: air.name,
            logo: air.logo,
            flightNumber: `${air.code}-${100 + index * 87}`,
            from: fromCapitalized,
            fromCode: fromCode || 'DEL',
            to: toCapitalized,
            toCode: toCode || 'ZRH',
            departureTime: depTime,
            arrivalTime: arrTime,
            duration: isInternational ? `${10 + (index % 4)}h ${15 + (index % 3) * 15}m` : `${1 + (index % 2)}h ${45 + (index % 3) * 5}m`,
            stops: stops,
            price: finalPrice,
            class: index % 4 === 0 ? 'Business' : 'Economy',
            isInternational: isInternational
          };
        });

        // Store in cache so getById and createBooking can resolve them during checkout
        DYNAMIC_FLIGHTS_CACHE.push(...matched);
      }

      return matched;
    }
    const res = await api.get<Flight[]>('/flights/search', { params });
    return res.data;
  },

  getById: async (id: string): Promise<Flight | undefined> => {
    if (shouldMock()) {
      await delay(500);
      return [...FLIGHTS_CATALOG, ...DYNAMIC_FLIGHTS_CACHE].find(f => f.id === id);
    }
    const res = await api.get<Flight>(`/flights/${id}`);
    return res.data;
  },

  createBooking: async (flightId: string, details: { passengerName: string; seat: string; date: string; class: string; passengers?: any[]; tripType?: string; returnDate?: string }): Promise<Booking> => {
    if (shouldMock()) {
      await delay(1500);
      const flights = [...FLIGHTS_CATALOG, ...DYNAMIC_FLIGHTS_CACHE];
      const flight = flights.find(f => f.id === flightId) || flights[0];
      
      const passengerCount = details.passengers?.length || 1;
      const isRoundTrip = details.tripType === 'roundtrip';
      const unitPrice = flight.price * (isRoundTrip ? 2 : 1);

      const newBooking: Booking = {
        id: 'BK-' + Math.floor(10000 + Math.random() * 90000).toString(),
        userId: 'user_1',
        type: 'flight',
        itemId: flightId,
        details: {
          from: `${flight.from} (${flight.fromCode})`,
          to: `${flight.to} (${flight.toCode})`,
          date: details.date,
          time: flight.departureTime,
          airline: flight.airline,
          flightNumber: flight.flightNumber,
          passengerName: details.passengerName,
          seat: details.seat,
          class: details.class,
          passengers: details.passengers,
          isInternational: flight.isInternational,
          tripType: details.tripType,
          returnDate: details.returnDate,
        },
        totalPrice: unitPrice * passengerCount,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
      };
      
      const currentBookings = getLocalBookings();
      saveLocalBookings([newBooking, ...currentBookings]);
      return newBooking;
    }

    const res = await api.post<Booking>('/bookings/flight', { flightId, ...details });
    return res.data;
  },

  updateBooking: async (bookingId: string, updatedDetails: any): Promise<Booking> => {
    if (shouldMock()) {
      await delay(1000);
      const bookings = getLocalBookings();
      const index = bookings.findIndex(b => b.id === bookingId);
      if (index === -1) throw new Error('Booking not found');

      bookings[index].details = { ...bookings[index].details, ...updatedDetails };
      saveLocalBookings(bookings);
      return bookings[index];
    }
    const res = await api.put<Booking>(`/bookings/${bookingId}`, { details: updatedDetails });
    return res.data;
  },

  cancelBooking: async (bookingId: string): Promise<Booking> => {
    if (shouldMock()) {
      await delay(1000);
      const bookings = getLocalBookings();
      const index = bookings.findIndex(b => b.id === bookingId);
      if (index === -1) throw new Error('Booking not found');

      bookings[index].status = 'cancelled';
      saveLocalBookings(bookings);
      return bookings[index];
    }
    const res = await api.delete<Booking>(`/bookings/${bookingId}`);
    return res.data;
  }
};
