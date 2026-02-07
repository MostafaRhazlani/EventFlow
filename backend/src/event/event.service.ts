import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Event } from './schemas/event.schema';
import { Payload } from 'src/auth/dto/payload.dto';
import { Roles } from 'src/user/enums/roles.enum';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(createEventDto: CreateEventDto) {
    const createdEvent = await this.eventModel.create(createEventDto);
    return createdEvent.save();
  }

  async findAll() {
    return this.eventModel
      .find()
      .populate('organizer', 'first_name last_name email')
      .exec();
  }

  async findMyEvents(organizerId: string) {
    return this.eventModel
      .find({ organizer: organizerId })
      .populate('organizer', 'first_name last_name email')
      .exec();
  }

  async findOne(id: string) {
    const event = await this.eventModel
      .findById(id)
      .populate('organizer', 'first_name last_name email')
      .exec();
    if (!event) {
      throw new NotFoundException(`Event not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, user: Payload) {
    const query: { _id: string; organizer?: string } = { _id: id };
    if (user.role === Roles.ORGANIZER) {
      query.organizer = user.sub;
    }

    const updatedEvent = await this.eventModel
      .findOneAndUpdate(query, updateEventDto, { new: true })
      .exec();
    if (!updatedEvent) {
      throw new NotFoundException(`Event not found or you are not authorized`);
    }
    return updatedEvent;
  }

  async remove(id: string, user: Payload) {
    const query: { _id: string; organizer?: string } = { _id: id };
    if (user.role === Roles.ORGANIZER) {
      query.organizer = user.sub;
    }

    const deletedEvent = await this.eventModel.findOneAndDelete(query).exec();
    if (!deletedEvent) {
      throw new NotFoundException(`Event not found or you are not authorized`);
    }
    return deletedEvent;
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateStatusDto,
    user: Payload,
  ) {
    const query: { _id: string; organizer?: string } = { _id: id };
    if (user.role === Roles.ORGANIZER) {
      query.organizer = user.sub;
    }

    const updatedEvent = await this.eventModel
      .findOneAndUpdate(
        query,
        { status: updateStatusDto.status },
        { new: true },
      )
      .exec();
    if (!updatedEvent) {
      throw new NotFoundException(`Event not found or you are not authorized`);
    }
    return updatedEvent;
  }

  async bookEvent(id: string, userId: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');

    if (event.participants?.some((a) => a.toString() === userId)) {
      throw new BadRequestException('You have already booked this event');
    }

    if ((event.participants?.length || 0) >= event.maxParticipants) {
      throw new BadRequestException('Event is fully booked');
    }

    const updatedEvent = await this.eventModel.findOneAndUpdate(
      {
        _id: id,
        $expr: {
          $lt: [
            { $size: { $ifNull: ['$participants', []] } },
            '$maxParticipants',
          ],
        },
      },
      { $addToSet: { participants: userId } },
      { new: true },
    );

    if (!updatedEvent) {
      // Double check strictly why it failed if it wasn't caught above
      const freshEvent = await this.eventModel.findById(id);
      if (
        freshEvent &&
        (freshEvent.participants?.length || 0) >= freshEvent.maxParticipants
      ) {
        throw new BadRequestException('Event is fully booked');
      }
      throw new BadRequestException('Booking failed');
    }

    return updatedEvent;
  }
}
