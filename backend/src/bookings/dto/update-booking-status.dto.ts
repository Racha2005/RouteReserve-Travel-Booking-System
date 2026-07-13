import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus, example: 'CONFIRMED' })
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus;
}
