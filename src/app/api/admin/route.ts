import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, password } = body;

    // Verify staff demo password: spa2026
    const passwordSetting = await prisma.setting.findUnique({ where: { key: 'admin_password' } });
    const expectedPassword = passwordSetting?.value || 'spa2026';

    if (password !== expectedPassword) {
      return NextResponse.json({ error: 'Incorrect staff access password.' }, { status: 401 });
    }

    // 1. Fetch full admin data
    if (action === 'getData') {
      const appointments = await prisma.appointment.findMany({
        orderBy: { createdAt: 'desc' },
        include: { service: true }
      });
      const services = await prisma.service.findMany({
        orderBy: { category: 'asc' }
      });
      const therapists = await prisma.therapist.findMany({
        orderBy: { createdAt: 'asc' }
      });
      const offers = await prisma.offer.findMany({
        orderBy: { createdAt: 'desc' }
      });
      const blockedSlots = await prisma.blockedSlot.findMany({
        orderBy: { date: 'asc' }
      });
      const reviews = await prisma.review.findMany({
        orderBy: { createdAt: 'desc' }
      });
      const enquiries = await prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' }
      });
      const settingsList = await prisma.setting.findMany();
      const settingsMap: Record<string, string> = {};
      settingsList.forEach(s => { settingsMap[s.key] = s.value; });

      // Stats
      const totalRevenue = appointments
        .filter(a => a.status !== 'CANCELLED')
        .reduce((sum, a) => sum + a.totalAmount, 0);

      return NextResponse.json({
        appointments,
        services,
        therapists,
        offers,
        blockedSlots,
        reviews,
        enquiries,
        settings: settingsMap,
        stats: {
          totalBookings: appointments.length,
          activeBookings: appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING').length,
          completedBookings: appointments.filter(a => a.status === 'COMPLETED').length,
          cancelledBookings: appointments.filter(a => a.status === 'CANCELLED').length,
          totalRevenue
        }
      });
    }

    // 2. Appointment Status change
    if (action === 'updateAppointmentStatus') {
      const { appointmentId, status } = body;
      const updated = await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status }
      });
      return NextResponse.json({ success: true, updated });
    }

    // 3. Reschedule Appointment
    if (action === 'rescheduleAppointment') {
      const { appointmentId, newDate, newTimeSlot } = body;
      const updated = await prisma.appointment.update({
        where: { id: appointmentId },
        data: { date: newDate, timeSlot: newTimeSlot, status: 'RESCHEDULED' }
      });
      return NextResponse.json({ success: true, updated });
    }

    // 4. Service Management
    if (action === 'addService') {
      const { name, description, duration, price, category, imageUrl } = body;
      const created = await prisma.service.create({
        data: {
          name,
          description,
          duration: parseInt(duration),
          price: parseFloat(price),
          category,
          imageUrl: imageUrl || null
        }
      });
      return NextResponse.json({ success: true, created });
    }

    if (action === 'editService') {
      const { id, name, description, duration, price, category } = body;
      const updated = await prisma.service.update({
        where: { id },
        data: {
          name,
          description,
          duration: parseInt(duration),
          price: parseFloat(price),
          category
        }
      });
      return NextResponse.json({ success: true, updated });
    }

    if (action === 'deleteService') {
      const { id } = body;
      await prisma.service.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    // 5. Offer Management
    if (action === 'addOffer') {
      const { title, description, discount, code, minSpend, categoryLimit, validUntil } = body;
      const created = await prisma.offer.create({
        data: {
          title,
          description,
          discount: parseFloat(discount),
          code: code.toUpperCase().trim(),
          minSpend: parseFloat(minSpend) || 0,
          categoryLimit: categoryLimit || null,
          validUntil: validUntil ? new Date(validUntil) : null
        }
      });
      return NextResponse.json({ success: true, created });
    }

    if (action === 'toggleOffer') {
      const { id, isActive } = body;
      const updated = await prisma.offer.update({
        where: { id },
        data: { isActive }
      });
      return NextResponse.json({ success: true, updated });
    }

    // 6. Block / Unblock Slots
    if (action === 'blockSlot') {
      const { date, timeSlot, reason } = body;
      const blocked = await prisma.blockedSlot.create({
        data: { date, timeSlot: timeSlot || null, reason: reason || null }
      });
      return NextResponse.json({ success: true, blocked });
    }

    if (action === 'unblockSlot') {
      const { id } = body;
      await prisma.blockedSlot.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    // 7. Reviews
    if (action === 'toggleReview') {
      const { id, isApproved } = body;
      const updated = await prisma.review.update({
        where: { id },
        data: { isApproved }
      });
      return NextResponse.json({ success: true, updated });
    }

    if (action === 'deleteReview') {
      const { id } = body;
      await prisma.review.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    // 8. Settings
    if (action === 'updateSettings') {
      const { settings } = body;
      for (const [key, value] of Object.entries(settings)) {
        await prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) }
        });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Action not supported' }, { status: 400 });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: 'Admin operation failed' }, { status: 500 });
  }
}
