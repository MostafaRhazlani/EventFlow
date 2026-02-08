import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { getModelToken } from '@nestjs/mongoose';
import { Event } from './schemas/event.schema';
import { PdfService } from './pdf.service';
import { UserService } from '../user/user.service';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { EventStatus } from './enums/event-status.enum';
import { Roles } from '../user/enums/roles.enum';

describe('EventService', () => {
  let service: EventService;
  let eventModel: any;

  const organizerId = new Types.ObjectId().toString();
  const eventId = new Types.ObjectId().toString();

  const mockEvent = {
    _id: eventId,
    title: 'Test Event',
    description: 'Description',
    date: new Date('2026-03-15'),
    location: 'Test Location',
    status: EventStatus.DRAFT,
    maxParticipants: 100,
    participants: [],
    organizer: new Types.ObjectId(organizerId),
    save: jest.fn(),
  };

  const organizer = {
    sub: organizerId,
    first_name: 'Test',
    last_name: 'User',
    email: 'test@test.com',
    password: 'hash',
    role: Roles.ORGANIZER,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getModelToken(Event.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
          },
        },
        { provide: PdfService, useValue: {} },
        { provide: UserService, useValue: {} },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventModel = module.get(getModelToken(Event.name));
  });

  it('should create an event', async () => {
    const dto = { title: 'Test', description: 'Desc', date: new Date(), location: 'Loc', maxParticipants: 50, organizer: organizerId };
    const created = { ...mockEvent, save: jest.fn().mockResolvedValue(mockEvent) };
    eventModel.create.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(eventModel.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockEvent);
  });

  it('should find all published events', async () => {
    const events = [{ ...mockEvent, status: EventStatus.PUBLISHED }];
    eventModel.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(events) }),
    });

    const result = await service.findAll();

    expect(eventModel.find).toHaveBeenCalledWith({ status: EventStatus.PUBLISHED });
    expect(result).toEqual(events);
  });

  it('should find one event by id', async () => {
    eventModel.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockEvent) }),
      }),
    });

    const result = await service.findOne(eventId);

    expect(eventModel.findById).toHaveBeenCalledWith(eventId);
    expect(result).toEqual(mockEvent);
  });

  it('should throw NotFoundException if event not found', async () => {
    eventModel.findById.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      }),
    });

    await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
  });

  it('should update an event', async () => {
    const updated = { ...mockEvent, title: 'Updated' };
    eventModel.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(updated) });

    const result = await service.update(eventId, { title: 'Updated' }, organizer);

    expect(result.title).toBe('Updated');
  });

  it('should delete an event', async () => {
    eventModel.findOneAndDelete.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockEvent) });

    const result = await service.remove(eventId, organizer);

    expect(result).toEqual(mockEvent);
  });

  it('should update event status', async () => {
    const published = { ...mockEvent, status: EventStatus.PUBLISHED };
    eventModel.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue(published) });

    const result = await service.updateStatus(eventId, { status: EventStatus.PUBLISHED }, organizer);

    expect(result.status).toBe(EventStatus.PUBLISHED);
  });
});
