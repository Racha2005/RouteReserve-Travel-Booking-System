import { api, shouldMock, delay } from './api';
import { CARS_CATALOG, getLocalBookings, saveLocalBookings, Booking, CarRental } from './mockDb';
export type { CarRental };

export const carService = {
  search: async (params: { location: string; pickupDate: string; returnDate: string }): Promise<CarRental[]> => {
    if (shouldMock()) {
      await delay(1000);
      // For car, return all catalog cars for mock demo since location is general
      return CARS_CATALOG;
    }
    const res = await api.get<CarRental[]>('/cars/search', { params });
    return res.data;
  },

  createBooking: async (carId: string, details: { pickupLocation: string; driverName: string; pickupDate: string; returnDate: string; days: number }): Promise<Booking> => {
    if (shouldMock()) {
      await delay(1200);
      const car = CARS_CATALOG.find(c => c.id === carId) || CARS_CATALOG[0];
      const price = car.pricePerDay * details.days;
      
      const newBooking: Booking = {
        id: 'BK-' + Math.floor(10000 + Math.random() * 90000).toString(),
        userId: 'user_1',
        type: 'car',
        itemId: carId,
        details: {
          model: car.model,
          brand: car.brand,
          company: car.company,
          pickupDate: details.pickupDate,
          returnDate: details.returnDate,
          days: details.days,
          pickupLocation: details.pickupLocation,
          driverName: details.driverName,
        },
        totalPrice: price,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
      };
      
      const bookings = getLocalBookings();
      saveLocalBookings([newBooking, ...bookings]);
      return newBooking;
    }
    const res = await api.post<Booking>('/bookings/car', { carId, ...details });
    return res.data;
  }
};
