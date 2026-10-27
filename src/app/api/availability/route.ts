import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    const defaultSlots = [
      "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
      "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
      "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
    ];

    if (!date) {
      return NextResponse.json({ slots: defaultSlots });
    }

    // Check if whole day is blocked
    const blockedFullDay = await prisma.blockedSlot.findFirst({
      where: { date, timeSlot: null }
    });

    if (blockedFullDay) {
      return NextResponse.json({
        isDayBlocked: true,
        reason: blockedFullDay.reason || "Spa is closed on this date",
        slots: []
      });
    }

    // Get individually blocked time slots
    const blockedSlots = await prisma.blockedSlot.findMany({
      where: { date, timeSlot: { not: null } }
    });
    const blockedTimes = new Set(blockedSlots.map(b => b.timeSlot));

    // Get confirmed or pending appointments for that date to prevent double-booking
    const appointments = await prisma.appointment.findMany({
      where: {
        date,
        status: { in: ['CONFIRMED', 'PENDING'] }
      }
    });
    const bookedTimes = new Set(appointments.map(a => a.timeSlot));

    // Filter available slots
    const slotAvailability = defaultSlots.map(time => {
      const isBlocked = blockedTimes.has(time);
      const isBooked = bookedTimes.has(time);
      return {
        time,
        available: !isBlocked && !isBooked,
        reason: isBlocked ? 'Maintenance/Reserved' : isBooked ? 'Already Booked' : 'Available'
      };
    });

    return NextResponse.json({ isDayBlocked: false, slots: slotAvailability });
  } catch (error) {
    console.error("Availability error:", error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}
