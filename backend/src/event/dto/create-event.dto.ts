import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
  IsOptional,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EventStatus } from '../enums/event-status.enum';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber()
  @Min(1)
  maxParticipants: number;

  @IsMongoId()
  @IsOptional()
  organizer?: string;
}
