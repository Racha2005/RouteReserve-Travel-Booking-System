import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookingDto) {
    // 1. Business Rule: Booking date cannot be in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(dto.bookingDate);
    if (bookingDate < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    // 2. Business Rule: Service must exist and be active
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${dto.serviceId} not found`);
    }
    if (!service.isActive) {
      throw new BadRequestException('Service is currently inactive and cannot be booked');
    }

    // 3. Bonus Feature: Prevent duplicate bookings for same service, date, and time (that are not cancelled)
    const duplicate = await this.prisma.booking.findFirst({
      where: {
        serviceId: dto.serviceId,
        bookingDate: bookingDate,
        bookingTime: dto.bookingTime,
        status: { not: BookingStatus.CANCELLED },
      },
    });
    if (duplicate) {
      throw new ConflictException('This service slot is already booked for the selected date and time');
    }

    return this.prisma.booking.create({
      data: {
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        serviceId: dto.serviceId,
        bookingDate: bookingDate,
        bookingTime: dto.bookingTime,
        notes: dto.notes,
        status: BookingStatus.PENDING,
      },
      include: { service: true },
    });
  }

  async findAll() {
    return this.prisma.booking.findMany({
      include: { service: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async updateStatus(id: number, status: BookingStatus) {
    const booking = await this.findOne(id);

    // Business Rule: Cancelled bookings cannot be marked as completed
    if (booking.status === BookingStatus.CANCELLED && status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cancelled bookings cannot be marked as completed');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status },
      include: { service: true },
    });
  }

  async cancel(id: number) {
    const booking = await this.findOne(id);
    if (booking.status === BookingStatus.CANCELLED) {
      return booking; // Already cancelled
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
      include: { service: true },
    });
  }
}
