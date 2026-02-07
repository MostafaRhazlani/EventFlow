import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event, EventSchema } from './schemas/event.schema';
import { AuthModule } from 'src/auth/auth.module';
import { PdfService } from './pdf.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    AuthModule,
    UserModule,
  ],
  controllers: [EventController],
  providers: [EventService, PdfService],
  exports: [EventService],
})
export class EventModule {}
