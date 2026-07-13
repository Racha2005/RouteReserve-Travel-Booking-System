import { IsEmail, IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'Rachana R Tunga', description: 'Customer full name' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'user1@gmail.com', description: 'Customer contact email' })
  @IsEmail()
  @IsNotEmpty()
  customerEmail: string;

  @ApiProperty({ example: '+919876543210', description: 'Customer contact phone number' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ example: 1, description: 'Referenced Service ID' })
  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @ApiProperty({ example: '2026-08-15', description: 'ISO 8601 date string (YYYY-MM-DD)' })
  @IsISO8601()
  @IsNotEmpty()
  bookingDate: string;

  @ApiProperty({ example: '14:30', description: 'Booking slot time (HH:MM format)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'bookingTime must be in HH:MM format' })
  bookingTime: string;

  @ApiProperty({ example: 'Need window seat if possible', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
