import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './schemas/event.schema';

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

  async findOne(id: string) {
    const event = await this.eventModel
      .findById(id)
      .populate('organizer', 'first_name last_name email')
      .populate('participants', 'first_name last_name email')
      .exec();
    if (!event) {
      throw new NotFoundException(`Event not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();
    if (!updatedEvent) {
      throw new NotFoundException(`Event not found`);
    }
    return updatedEvent;
  }

  async remove(id: string) {
    const deletedEvent = await this.eventModel.findByIdAndDelete(id).exec();
    if (!deletedEvent) {
      throw new NotFoundException(`Event not found`);
    }
    return deletedEvent;
  }
}
