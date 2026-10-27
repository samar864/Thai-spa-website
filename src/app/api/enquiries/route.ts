import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, service, date, time, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Please enter your name, email, and message.' }, { status: 400 });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : '',
        service: service || null,
        date: date || null,
        time: time || null,
        message: message.trim()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Our spa concierge will contact you shortly.',
      enquiry
    }, { status: 201 });
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json({ error: 'Failed to submit enquiry.' }, { status: 500 });
  }
}
