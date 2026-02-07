import { IsEnum, IsNotEmpty } from 'class-validator';
import { EventStatus } from '../enums/event-status.enum';

export class UpdateStatusDto {
  @IsEnum(EventStatus)
  @IsNotEmpty()
  status: EventStatus;
}
