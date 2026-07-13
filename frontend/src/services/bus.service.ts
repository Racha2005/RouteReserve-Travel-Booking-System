import { api, shouldMock, delay } from './api';
import { BUSES_CATALOG, getLocalBookings, saveLocalBookings, Booking, Bus, DYNAMIC_BUSES_CACHE } from './mockDb';
export type { Bus };

export const busService = {
  search: async (params: { from: string; to: string; date: string }): Promise<Bus[]> => {
    if (shouldMock()) {
      await delay(1000);
      const queryFrom = params.from.toLowerCase().trim();
      const queryTo = params.to.toLowerCase().trim();
      
      let matched = BUSES_CATALOG.filter(bus => 
        bus.from.toLowerCase().includes(queryFrom) &&
        bus.to.toLowerCase().includes(queryTo)
      );

      if (matched.length === 0 && params.from && params.to) {
        const fromCapitalized = params.from.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const toCapitalized = params.to.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        const isLongDistance = ['solapur', 'solahapur', 'pune', 'kolkata', 'mumbai', 'delhi', 'maharastra', 'telangana', 'hyderabad'].some(p => queryTo.includes(p) || queryFrom.includes(p));

        const busTemplates = [
          { operator: 'Suguma Tourist', type: 'AC Sleeper', basePrice: isLongDistance ? 2200 : 1200, rating: 4.4 },
          { operator: 'Durgamba Motors', type: 'AC Sleeper', basePrice: isLongDistance ? 2400 : 1300, rating: 4.3 },
          { operator: 'Zingbus Premium AC', type: 'AC Multi-Axle Sleeper (Luxury)', basePrice: isLongDistance ? 2900 : 1850, rating: 4.7 },
          { operator: 'Bharati Travels', type: 'Non-AC Sleeper (Budget)', basePrice: isLongDistance ? 1300 : 750, rating: 3.8 },
          { operator: 'KSRTC Ambaari Utsav', type: 'AC Club Class Sleeper', basePrice: isLongDistance ? 2600 : 1500, rating: 4.8 },
          { operator: 'VRL Travels', type: 'AC Sleeper', basePrice: isLongDistance ? 2100 : 1250, rating: 4.5 },
          { operator: 'SRS Travels', type: 'AC Sleeper', basePrice: isLongDistance ? 2000 : 1150, rating: 4.2 },
          { operator: 'National Travels', type: 'AC Sleeper', basePrice: isLongDistance ? 1950 : 1100, rating: 4.1 },
          { operator: 'GreenLine Travels', type: 'AC Seater Coach', basePrice: isLongDistance ? 1600 : 950, rating: 4.4 },
          { operator: 'Orange Tours & Travels', type: 'AC Sleeper', basePrice: isLongDistance ? 2500 : 1400, rating: 4.6 },
          { operator: 'Kallada Travels', type: 'AC Sleeper', basePrice: isLongDistance ? 2200 : 1300, rating: 4.0 },
          { operator: 'Morning Star Travels', type: 'AC Sleeper', basePrice: isLongDistance ? 2300 : 1350, rating: 4.2 },
          { operator: 'Jabbar Travels', type: 'AC Sleeper', basePrice: isLongDistance ? 2150 : 1200, rating: 4.3 },
          { operator: 'Suguma Tourist', type: 'Non-AC Sleeper', basePrice: isLongDistance ? 1500 : 900, rating: 4.1 },
          { operator: 'Durgamba Motors', type: 'AC Seater', basePrice: isLongDistance ? 1600 : 950, rating: 4.2 },
          { operator: 'Zingbus Express', type: 'AC Sleeper', basePrice: isLongDistance ? 2700 : 1700, rating: 4.5 },
          { operator: 'Bharati Travels', type: 'AC Sleeper', basePrice: isLongDistance ? 1600 : 900, rating: 4.0 },
          { operator: 'KSRTC Airavat Club Class', type: 'AC Seater Coach', basePrice: isLongDistance ? 1800 : 1050, rating: 4.7 },
          { operator: 'VRL Travels', type: 'Multi-Axle AC Sleeper', basePrice: isLongDistance ? 2450 : 1400, rating: 4.6 },
          { operator: 'Sea Bird Tourist', type: 'Non-AC Sleeper', basePrice: isLongDistance ? 1400 : 800, rating: 3.9 }
        ];

        matched = busTemplates.map((bus, index) => {
          const finalPrice = bus.basePrice + (index % 3) * 50;
          const depHour = 5 + (index % 15);
          const depTime = `${depHour.toString().padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'} ${depHour < 12 ? 'AM' : 'PM'}`;
          const arrHour = (depHour + (isLongDistance ? 14 : 8)) % 12 || 12;
          const arrTime = `${arrHour.toString().padStart(2, '0')}:${index % 2 === 0 ? '45' : '15'} ${depHour + (isLongDistance ? 14 : 8) >= 12 ? 'PM' : 'AM'}`;

          return {
            id: `b_dyn_${index + 1}`,
            operator: bus.operator,
            type: bus.type,
            from: fromCapitalized,
            to: toCapitalized,
            departureTime: depTime,
            arrivalTime: arrTime,
            duration: isLongDistance ? `${12 + (index % 4)}h ${15 + (index % 3) * 15}m` : `${7 + (index % 3)}h ${15 + (index % 3) * 15}m`,
            price: finalPrice,
            rating: bus.rating
          };
        });
        DYNAMIC_BUSES_CACHE.push(...matched);
      }

      return matched;
    }
    const res = await api.get<Bus[]>('/buses/search', { params });
    return res.data;
  },

  createBooking: async (busId: string, details: { passengerName: string; seat: string; date: string; passengers?: any[] }): Promise<Booking> => {
    if (shouldMock()) {
      await delay(1200);
      const buses = [...BUSES_CATALOG, ...DYNAMIC_BUSES_CACHE];
      const bus = buses.find(b => b.id === busId) || buses[0];
      
      const passengerCount = details.passengers?.length || 1;

      const newBooking: Booking = {
        id: 'BK-' + Math.floor(10000 + Math.random() * 90000).toString(),
        userId: 'user_1',
        type: 'bus',
        itemId: busId,
        details: {
          from: bus.from,
          to: bus.to,
          date: details.date,
          time: bus.departureTime,
          operator: bus.operator,
          type: bus.type,
          passengerName: details.passengerName,
          seat: details.seat,
          passengers: details.passengers,
        },
        totalPrice: bus.price * passengerCount,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
      };
      
      const bookings = getLocalBookings();
      saveLocalBookings([newBooking, ...bookings]);
      return newBooking;
    }
    const res = await api.post<Booking>('/bookings/bus', { busId, ...details });
    return res.data;
  }
};
