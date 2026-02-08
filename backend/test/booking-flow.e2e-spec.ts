import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import cookieParser from 'cookie-parser';
import { AuthModule } from '../src/auth/auth.module';
import { UserModule } from '../src/user/user.module';
import { EventModule } from '../src/event/event.module';
import { ConfigModule } from '@nestjs/config';
import { EventStatus } from '../src/event/enums/event-status.enum';
import { BookingStatus } from '../src/event/enums/booking-status.enum';

const TEST_DB_URI =
  process.env.TEST_MONGODB_URI ||
  'mongodb://localhost:27017/eventflow_booking_test';

describe('Booking Flow E2E', () => {
  let app: INestApplication<App>;
  let connection: Connection;

  let organizerToken: string;
  let participantToken: string;
  let participantId: string;
  let eventId: string;

  const extractCookies = (res: request.Response): string => {
    const cookies = res.headers['set-cookie'];
    return Array.isArray(cookies) ? cookies.join('; ') : cookies || '';
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        MongooseModule.forRoot(TEST_DB_URI),
        AuthModule,
        UserModule,
        EventModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
    connection = moduleFixture.get<Connection>(getConnectionToken());
    await connection.dropDatabase();
  }, 30000);

  afterAll(async () => {
    if (connection) {
      await connection.dropDatabase();
      await connection.close();
    }
    if (app) await app.close();
  });

  it('organizer registers', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        first_name: 'Organizer',
        last_name: 'User',
        email: 'organizer@test.com',
        password: 'organizer123',
        role: 'ORGANIZER',
      })
      .expect(201);

    expect(res.body.role).toBe('ORGANIZER');
  });

  it('participant registers', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        first_name: 'Participant',
        last_name: 'User',
        email: 'participant@test.com',
        password: 'participant123',
      })
      .expect(201);

    participantId = res.body._id;
    expect(res.body.role).toBe('PARTICIPANT');
  });

  it('organizer logs in', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'organizer@test.com', password: 'organizer123' })
      .expect(200);

    organizerToken = extractCookies(res);
    expect(organizerToken).toBeTruthy();
  });

  it('participant logs in', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'participant@test.com', password: 'participant123' })
      .expect(200);

    participantToken = extractCookies(res);
    expect(participantToken).toBeTruthy();
  });

  it('organizer creates event', async () => {
    const res = await request(app.getHttpServer())
      .post('/events')
      .set('Cookie', organizerToken)
      .field('title', 'Tech Meetup')
      .field('description', 'A tech meetup event')
      .field(
        'date',
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      )
      .field('location', 'Conference Room')
      .field('maxParticipants', 50)
      .expect(201);

    eventId = res.body._id;
    expect(res.body.status).toBe(EventStatus.DRAFT);
  });

  it('organizer publishes event', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/events/${eventId}/status`)
      .set('Cookie', organizerToken)
      .send({ status: EventStatus.PUBLISHED })
      .expect(200);

    expect(res.body.status).toBe(EventStatus.PUBLISHED);
  });

  it('participant books event', async () => {
    const res = await request(app.getHttpServer())
      .post(`/events/${eventId}/book`)
      .set('Cookie', participantToken)
      .expect(201);

    const booking = res.body.participants.find(
      (p: any) =>
        p.user === participantId || p.user?.toString() === participantId,
    );
    expect(booking.status).toBe(BookingStatus.PENDING);
  });

  it('organizer confirms participant booking', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/events/${eventId}/booking/${participantId}`)
      .set('Cookie', organizerToken)
      .send({ status: BookingStatus.CONFIRMED })
      .expect(200);

    const booking = res.body.participants.find(
      (p: any) =>
        p.user === participantId || p.user?.toString() === participantId,
    );
    expect(booking.status).toBe(BookingStatus.CONFIRMED);
  });
});
