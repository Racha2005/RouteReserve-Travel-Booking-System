import { api, shouldMock, delay } from './api';
import { TRAINS_CATALOG, getLocalBookings, saveLocalBookings, Booking, Train, DYNAMIC_TRAINS_CACHE } from './mockDb';
export type { Train };

export const trainService = {
  search: async (params: { from: string; to: string; date: string }): Promise<Train[]> => {
    if (shouldMock()) {
      await delay(1000);
      const queryFrom = params.from.toLowerCase().trim();
      const queryTo = params.to.toLowerCase().trim();
      
      let matched = TRAINS_CATALOG.filter(train => 
        train.from.toLowerCase().includes(queryFrom) &&
        train.to.toLowerCase().includes(queryTo)
      );

      if (matched.length === 0 && params.from && params.to) {
        const fromCapitalized = params.from.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const toCapitalized = params.to.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        // Generate 10+ varied train options
        const trainTypes = [
          { name: 'Vande Bharat Express', code: 'VB-22436', base: 1800, class: 'AC Chair Car' },
          { name: 'Rajdhani Express', code: 'RA-12951', base: 3200, class: 'AC 3 Tier' },
          { name: 'Shatabdi Express', code: 'SH-12002', base: 1200, class: 'AC Chair Car' },
          { name: 'Duronto Express', code: 'DU-12260', base: 1900, class: 'AC 3 Tier' },
          { name: 'Humsafar Express', code: 'HU-22317', base: 1550, class: 'AC 3 Tier' },
          { name: 'Tejas Express', code: 'TE-22672', base: 1650, class: 'AC Chair Car' },
          { name: 'Garib Rath Express', code: 'GR-12909', base: 750, class: 'AC 3 Tier' },
          { name: 'Intercity Express', code: 'IC-12677', base: 450, class: 'Second Sitting' },
          { name: 'Mail Express', code: 'ME-11019', base: 350, class: 'Sleeper Class' },
          { name: 'Superfast Special', code: 'SF-02102', base: 550, class: 'AC 3 Tier' }
        ];

        matched = trainTypes.map((tr, index) => {
          const multiplier = 1 + (index * 0.05);
          const finalPrice = Math.round(tr.base * multiplier);
          
          // Generate times
          const hour = 6 + (index * 2) % 16;
          const depTime = `${hour.toString().padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'} ${hour < 12 ? 'AM' : 'PM'}`;
          const arrHour = (hour + 5 + (index % 3)) % 12 || 12;
          const arrTime = `${arrHour.toString().padStart(2, '0')}:${index % 2 === 0 ? '45' : '15'} ${hour + 5 + (index % 3) >= 12 ? 'PM' : 'AM'}`;

          return {
            id: `t_dyn_${index + 1}`,
            name: tr.name,
            trainNumber: tr.code,
            from: fromCapitalized,
            to: toCapitalized,
            departureTime: depTime,
            arrivalTime: arrTime,
            duration: `${5 + (index % 4)}h ${15 + (index % 3) * 15}m`,
            price: finalPrice,
            class: tr.class
          };
        });
        DYNAMIC_TRAINS_CACHE.push(...matched);
      }

      return matched;
    }
    const res = await api.get<Train[]>('/trains/search', { params });
    return res.data;
  },

  createBooking: async (trainId: string, details: { passengerName: string; seat: string; date: string; class: string; passengers?: any[] }): Promise<Booking> => {
    if (shouldMock()) {
      await delay(1200);
      const trains = [...TRAINS_CATALOG, ...DYNAMIC_TRAINS_CACHE];
      const train = trains.find(t => t.id === trainId) || trains[0];
      
      const passengerCount = details.passengers?.length || 1;

      const newBooking: Booking = {
        id: 'BK-' + Math.floor(10000 + Math.random() * 90000).toString(),
        userId: 'user_1',
        type: 'train',
        itemId: trainId,
        details: {
          from: train.from,
          to: train.to,
          date: details.date,
          time: train.departureTime,
          name: train.name,
          trainNumber: train.trainNumber,
          passengerName: details.passengerName,
          seat: details.seat,
          class: details.class,
          passengers: details.passengers,
        },
        totalPrice: train.price * passengerCount,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
      };
      
      const bookings = getLocalBookings();
      saveLocalBookings([newBooking, ...bookings]);
      return newBooking;
    }
    const res = await api.post<Booking>('/bookings/train', { trainId, ...details });
    return res.data;
  }
};
