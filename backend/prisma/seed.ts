import 'dotenv/config';
import { PrismaClient, BookingStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Admin User
  const hashedPassword = await bcrypt.hash('Rachana#Tunga@2026!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'user1@gmail.com',
      password: hashedPassword,
      name: 'Rachana R Tunga',
    },
  });
  console.log(`✅ Created Admin user: ${admin.email}`);

  // 3. Create Sample Services
  const flightService = await prisma.service.create({
    data: {
      title: 'Flight Booking (Tokyo Route)',
      description: 'Unified air travel booking to Tokyo, Japan. Includes seat selection.',
      duration: 720,
      price: 720.0,
      isActive: true,
    },
  });

  const trainService = await prisma.service.create({
    data: {
      title: 'Bullet Train (Kyoto Route)',
      description: 'Premium Shinkansen rail booking with green carriage privileges.',
      duration: 180,
      price: 150.0,
      isActive: true,
    },
  });

  const carService = await prisma.service.create({
    data: {
      title: 'SUV Car Rental (Jeep Wrangler)',
      description: '4x4 Offroad vehicle rental with full insurance coverage.',
      duration: 1440,
      price: 95.0,
      isActive: true,
    },
  });

  const inactiveService = await prisma.service.create({
    data: {
      title: 'Hyperloop Transit (Mock Service)',
      description: 'Next-gen high-speed vacuum tube transit service.',
      duration: 45,
      price: 500.0,
      isActive: false,
    },
  });

  console.log('✅ Created sample services');

  // 4. Create Sample Booking
  const sampleBooking = await prisma.booking.create({
    data: {
      customerName: 'Rachana R Tunga',
      customerEmail: 'user1@gmail.com',
      customerPhone: '+919876543210',
      serviceId: flightService.id,
      bookingDate: new Date('2026-08-15'),
      bookingTime: '14:30',
      status: BookingStatus.PENDING,
      notes: 'Window seat requested.',
    },
  });
  console.log(`✅ Created sample booking ID: ${sampleBooking.id} for customer: ${sampleBooking.customerName}`);

  console.log('🌱 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
