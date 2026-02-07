import { Injectable } from '@nestjs/common';
import { jsPDF } from 'jspdf';
import { Event } from './schemas/event.schema';
import { User } from 'src/user/schemas/user.schema';

export interface TicketData {
  event: Event;
  user: User;
  bookingDate: Date;
}

@Injectable()
export class PdfService {
  generateTicketPdf(data: TicketData): Buffer {
    const { event, user, bookingDate } = data;

    // Generate PDF
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [210, 100],
    });

    const textColor = '#1f2937';
    const mutedColor = '#6b7280';

    // Main ticket background
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(5, 5, 200, 90, 4, 4, 'F');

    // Left purple accent bar
    doc.setFillColor(124, 58, 237);
    doc.roundedRect(5, 5, 8, 90, 4, 0, 'F');
    doc.rect(9, 5, 4, 90, 'F');

    // Ticket stub separator (dashed line)
    doc.setLineDashPattern([2, 2], 0);
    doc.setDrawColor(200, 200, 200);
    doc.line(160, 10, 160, 90);
    doc.setLineDashPattern([], 0);

    // === MAIN SECTION (Left) ===

    // Brand
    doc.setTextColor(124, 58, 237);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EventFlow', 20, 18);

    // Event Title
    doc.setTextColor(textColor);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const title =
      event.title.length > 30
        ? event.title.substring(0, 30) + '...'
        : event.title;
    doc.text(title, 20, 32);

    // Event details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor);

    // Date
    const eventDate = new Date(event.date);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text('DATE', 20, 45);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor);
    doc.text(
      eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      20,
      51,
    );

    // Time
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text('TIME', 70, 45);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor);
    doc.text(
      eventDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      70,
      51,
    );

    // Location
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text('LOCATION', 110, 45);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor);
    const location =
      event.location.length > 20
        ? event.location.substring(0, 20) + '...'
        : event.location;
    doc.text(location, 110, 51);

    // Attendee info
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text('ATTENDEE', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor);
    doc.text(`${user.first_name} ${user.last_name}`, 20, 71);
    doc.setFontSize(8);
    doc.text(user.email, 20, 77);

    // === STUB SECTION (Right) ===

    // Brand on stub
    doc.setTextColor(124, 58, 237);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('EventFlow', 168, 18);

    // Booking Reference
    doc.setTextColor(textColor);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('BOOKING REF', 168, 32);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const bookingRef = `EF-${event._id.toString().slice(-6).toUpperCase()}`;
    doc.text(bookingRef, 168, 39);

    // Ticket Number
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('TICKET NO', 168, 52);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`#${user._id.toString().slice(-4).toUpperCase()}`, 168, 59);

    // Date issued
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('ISSUED', 168, 72);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(mutedColor);
    doc.text(
      new Date(bookingDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      168,
      78,
    );

    // Valid entry text
    doc.setFontSize(6);
    doc.setTextColor(mutedColor);
    doc.text('Valid for one entry', 168, 88);

    // Return as buffer
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
  }
}
