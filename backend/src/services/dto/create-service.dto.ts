import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Flight Reservation', description: 'Service title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Direct one-way flight booking service', description: 'Detailed description of the service' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 120, description: 'Duration of the service slot/transit in minutes' })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty({ example: 350.0, description: 'Pricing for the service in USD' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
