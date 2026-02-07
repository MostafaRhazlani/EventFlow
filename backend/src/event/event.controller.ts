import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequireRoles } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/user/enums/roles.enum';
import { multerConfig } from 'src/config/multer.config';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Payload } from 'src/auth/dto/payload.dto';

import { BookingStatus } from './enums/booking-status.enum';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.ORGANIZER)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  create(
    @Body() createEventDto: CreateEventDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: Payload,
  ) {
    if (file) {
      createEventDto.image = file.path;
    }
    createEventDto.organizer = user.sub;
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get('my-events')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.ORGANIZER)
  findMyEvents(@CurrentUser() user: Payload) {
    return this.eventService.findMyEvents(user.sub);
  }

  @Get('my-bookings')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.PARTICIPANT)
  findMyBookings(@CurrentUser() user: Payload) {
    return this.eventService.findMyBookings(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.ORGANIZER)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: Payload,
  ) {
    if (file) {
      updateEventDto.image = file.path;
    }
    return this.eventService.update(id, updateEventDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.ORGANIZER)
  remove(@Param('id') id: string, @CurrentUser() user: Payload) {
    return this.eventService.remove(id, user);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.ADMIN, Roles.ORGANIZER)
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @CurrentUser() user: Payload,
  ) {
    return this.eventService.updateStatus(id, updateStatusDto, user);
  }

  @Post(':id/book')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.PARTICIPANT)
  bookEvent(@Param('id') id: string, @CurrentUser() user: Payload) {
    return this.eventService.bookEvent(id, user.sub);
  }

  @Patch(':id/booking/:userId')
  @UseGuards(AuthGuard, RolesGuard)
  @RequireRoles(Roles.ORGANIZER)
  updateBookingStatus(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body('status') status: BookingStatus,
    @CurrentUser() user: Payload,
  ) {
    return this.eventService.updateBookingStatus(id, userId, status, user.sub);
  }
}
