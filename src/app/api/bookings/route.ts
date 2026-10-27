import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      serviceId,
      date,
      timeSlot,
      guests,
      name,
      phone,
      email,
      therapist,
      specialRequest,
      couponCode,
      paymentMethod
    } = body;

    // Validate inputs
    if (!serviceId || !date || !timeSlot || !name || !phone || !email) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ error: 'Selected treatment was not found.' }, { status: 404 });
    }

    // 1. Prevent double-booking
    const existingBooking = await prisma.appointment.findFirst({
      where: {
        date,
        timeSlot,
        status: { in: ['CONFIRMED', 'PENDING'] }
      }
    });

    if (existingBooking) {
      return NextResponse.json({
        error: `The ${timeSlot} slot on ${date} is already reserved. Please select another slot.`
      }, { status: 409 });
    }

    // Check if slot or whole day is blocked by admin
    const blocked = await prisma.blockedSlot.findFirst({
      where: {
        date,
        OR: [{ timeSlot: null }, { timeSlot }]
      }
    });

    if (blocked) {
      return NextResponse.json({
        error: `This appointment slot is currently unavailable (${blocked.reason || 'Reserved'}).`
      }, { status: 409 });
    }

    const numGuests = parseInt(guests) || 1;
    const baseAmount = service.price * numGuests;
    let discountAmount = 0;
    let validatedCoupon = null;

    // 2. Validate Coupon Code
    if (couponCode && typeof couponCode === 'string') {
      const codeClean = couponCode.trim().toUpperCase();
      const offer = await prisma.offer.findUnique({
        where: { code: codeClean }
      });

      if (!offer || !offer.isActive) {
        return NextResponse.json({ error: `Coupon code '${couponCode}' is invalid or has expired.` }, { status: 400 });
      }

      if (offer.validUntil && new Date() > new Date(offer.validUntil)) {
        return NextResponse.json({ error: `Coupon code '${couponCode}' has expired.` }, { status: 400 });
      }

      if (baseAmount < offer.minSpend) {
        return NextResponse.json({
          error: `Coupon '${couponCode}' requires a minimum spend of ฿${offer.minSpend.toLocaleString()}. Current total: ฿${baseAmount.toLocaleString()}`
        }, { status: 400 });
      }

      if (offer.categoryLimit && service.category !== offer.categoryLimit) {
        return NextResponse.json({
          error: `Coupon '${couponCode}' is only applicable to '${offer.categoryLimit}' therapies.`
        }, { status: 400 });
      }

      // Check first-visit rule
      if (offer.firstVisitOnly) {
        const pastBookings = await prisma.appointment.findFirst({
          where: {
            OR: [
              { customerEmail: email.toLowerCase() },
              { customerPhone: phone }
            ]
          }
        });
        if (pastBookings) {
          return NextResponse.json({
            error: `Coupon '${couponCode}' is valid for first-time guests only.`
          }, { status: 400 });
        }
      }

      // Check weekday wellness (Mon-Thu 11am-4pm)
      if (codeClean === 'WEEKDAY25') {
        const bookingDateObj = new Date(date);
        const day = bookingDateObj.getDay(); // 0 is Sunday, 1 is Monday... 4 is Thursday
        if (day === 0 || day === 5 || day === 6) {
          return NextResponse.json({
            error: `Coupon 'WEEKDAY25' is valid Monday through Thursday only.`
          }, { status: 400 });
        }
      }

      // Valid coupon
      discountAmount = Math.round((baseAmount * offer.discount) / 100);
      validatedCoupon = codeClean;
    }

    const totalAmount = Math.max(0, baseAmount - discountAmount);

    // Generate friendly booking code (e.g. BB-8392)
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `BB-${randomDigits}`;

    const appointment = await prisma.appointment.create({
      data: {
        bookingCode,
        date,
        timeSlot,
        status: 'CONFIRMED',
        customerName: name.trim(),
        customerEmail: email.trim().toLowerCase(),
        customerPhone: phone.trim(),
        guests: numGuests,
        therapist: therapist || "Any Available",
        specialRequest: specialRequest || null,
        serviceId: service.id,
        couponCode: validatedCoupon,
        discountAmount,
        totalAmount,
        paymentMethod: paymentMethod || 'PAY_AT_SPA',
        paymentStatus: paymentMethod === 'FULL' ? 'PAID' : 'PENDING'
      },
      include: {
        service: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment successfully confirmed!',
      booking: appointment
    }, { status: 201 });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: 'Failed to process booking. Please try again.' }, { status: 500 });
  }
}
