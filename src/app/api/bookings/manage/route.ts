import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const phone = searchParams.get('phone');

    if (!code || !phone) {
      return NextResponse.json({ error: 'Please provide both your Booking ID and Phone number.' }, { status: 400 });
    }

    const booking = await prisma.appointment.findFirst({
      where: {
        bookingCode: code.trim().toUpperCase(),
        customerPhone: { contains: phone.trim() }
      },
      include: { service: true }
    });

    if (!booking) {
      return NextResponse.json({ error: 'No matching booking found. Please check your Booking ID and Phone number.' }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Manage booking lookup error:", error);
    return NextResponse.json({ error: 'Failed to look up booking.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingCode, phone, action, newDate, newTimeSlot } = body;

    if (!bookingCode || !phone || !action) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const booking = await prisma.appointment.findFirst({
      where: {
        bookingCode: bookingCode.trim().toUpperCase(),
        customerPhone: { contains: phone.trim() }
      }
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    if (booking.status === 'CANCELLED') {
      return NextResponse.json({ error: 'This appointment is already cancelled.' }, { status: 400 });
    }

    // Check 4-hour cancellation / reschedule policy
    const bookingDateTime = new Date(`${booking.date}T${booking.timeSlot.includes('PM') && !booking.timeSlot.startsWith('12') ? parseInt(booking.timeSlot.split(':')[0]) + 12 : booking.timeSlot.split(':')[0]}:00:00`);
    const now = new Date();
    const diffHours = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (action === 'cancel') {
      if (diffHours < 4 && diffHours > 0) {
        // Less than 4 hours notice
        await prisma.appointment.update({
          where: { id: booking.id },
          data: { status: 'CANCELLED', specialRequest: (booking.specialRequest || '') + ' [Late cancellation (<4h notice)]' }
        });
        return NextResponse.json({
          success: true,
          message: 'Appointment cancelled. Please note that according to our 4-hour policy, late cancellations are subject to a fee.'
        });
      }

      await prisma.appointment.update({
        where: { id: booking.id },
        data: { status: 'CANCELLED' }
      });

      return NextResponse.json({
        success: true,
        message: 'Your appointment has been successfully cancelled.'
      });
    }

    if (action === 'reschedule') {
      if (!newDate || !newTimeSlot) {
        return NextResponse.json({ error: 'Please choose a new date and time.' }, { status: 400 });
      }

      // Check slot availability for new date & time
      const conflict = await prisma.appointment.findFirst({
        where: {
          date: newDate,
          timeSlot: newTimeSlot,
          status: { in: ['CONFIRMED', 'PENDING'] },
          id: { not: booking.id }
        }
      });

      if (conflict) {
        return NextResponse.json({ error: `The slot ${newTimeSlot} on ${newDate} is already booked. Please pick another time.` }, { status: 409 });
      }

      const updated = await prisma.appointment.update({
        where: { id: booking.id },
        data: {
          date: newDate,
          timeSlot: newTimeSlot,
          status: 'RESCHEDULED'
        },
        include: { service: true }
      });

      return NextResponse.json({
        success: true,
        message: 'Your appointment has been successfully rescheduled!',
        booking: updated
      });
    }

    return NextResponse.json({ error: 'Invalid action requested.' }, { status: 400 });
  } catch (error) {
    console.error("Manage booking action error:", error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
