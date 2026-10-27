import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding Baan Bua Spa database...")

  // Clear existing data
  await prisma.appointment.deleteMany()
  await prisma.review.deleteMany()
  await prisma.offer.deleteMany()
  await prisma.service.deleteMany()
  await prisma.therapist.deleteMany()
  await prisma.blockedSlot.deleteMany()
  await prisma.enquiry.deleteMany()
  await prisma.setting.deleteMany()

  // Seed Settings
  const settings = [
    { key: 'spa_name', value: 'Baan Bua Spa' },
    { key: 'tagline', value: 'Relax. Rejuvenate. Rediscover Yourself.' },
    { key: 'currency', value: '฿' },
    { key: 'address', value: '88/1 Sukhumvit Soi 39, Phrom Phong, Watthana, Bangkok 10110, Thailand' },
    { key: 'phone', value: '+66 2 123 4567' },
    { key: 'whatsapp', value: '66812345678' },
    { key: 'email', value: 'concierge@baanbuaspa.com' },
    { key: 'open_time', value: '10:00' },
    { key: 'close_time', value: '22:00' },
    { key: 'last_appointment', value: '21:00' },
    { key: 'timezone', value: 'Asia/Bangkok' },
    { key: 'admin_password', value: 'spa2026' },
    { key: 'cancellation_policy', value: 'Appointments may be cancelled or rescheduled up to 4 hours before the scheduled appointment. Late cancellations or no-shows may be subject to a 50% cancellation fee.' }
  ]

  for (const s of settings) {
    await prisma.setting.create({ data: s })
  }

  // Seed Therapists
  const therapists = [
    { name: 'Any Available Therapist', title: 'Senior Spa Specialist' },
    { name: 'Khun Mali', title: 'Master Thai Traditional Practitioner • 14 yrs experience' },
    { name: 'Khun Somchai', title: 'Deep Tissue & Musculoskeletal Specialist • 10 yrs experience' },
    { name: 'Khun Siriporn', title: 'Aromatherapy & Holistic Herbal Expert • 9 yrs experience' },
    { name: 'Khun Anong', title: 'Acupressure & Reflexology Specialist • 8 yrs experience' },
  ]

  for (const t of therapists) {
    await prisma.therapist.create({ data: t })
  }

  // Seed Services with authentic Bangkok luxury rates (in THB ฿)
  const services = [
    {
      name: 'Traditional Thai Massage',
      description: 'Ancient healing therapy combining rhythmic acupressure, gentle stretching, and energy meridian balancing without oils.',
      duration: 60,
      price: 1800,
      category: 'Thai Massage',
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'
    },
    {
      name: 'Traditional Thai Massage (Extended)',
      description: 'Extended full-body restorative session delivering profound tension release and full muscular decompression.',
      duration: 90,
      price: 2500,
      category: 'Thai Massage',
      imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80'
    },
    {
      name: 'Royal Thai Herbal Compress Massage',
      description: 'Heated medicinal herbal compresses infused with lemongrass, plai, turmeric, and camphor pressed along energy lines.',
      duration: 90,
      price: 2900,
      category: 'Thai Massage',
      imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80'
    },
    {
      name: 'Organic Aroma Oil Massage',
      description: 'Swedish and Balinese strokes using warm cold-pressed organic botanical oils to soothe the nervous system.',
      duration: 60,
      price: 2200,
      category: 'Oil Massage',
      imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80'
    },
    {
      name: 'Deep Tissue Herbal Oil Therapy',
      description: 'Targeted slow-stroke trigger point therapy focusing on chronic muscular knots, shoulder stiffness, and lower back fatigue.',
      duration: 90,
      price: 3500,
      category: 'Oil Massage',
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'
    },
    {
      name: 'Volcanic Hot Stone Body Revival',
      description: 'Polished heated volcanic basalt stones glide seamlessly across tense muscles, melting chronic stiffness.',
      duration: 90,
      price: 3800,
      category: 'Oil Massage',
      imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80'
    },
    {
      name: 'Signature Baan Bua Imperial Ritual',
      description: 'The definitive 150-minute sanctuary ritual: organic floral foot bath, lemongrass body scrub, Thai herbal compress, and aroma oil massage.',
      duration: 150,
      price: 5500,
      category: 'Wellness Treatments',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80'
    },
    {
      name: "Sacred Sanctuary Couple's Retreat",
      description: 'A romantic dual session in our VIP couple suite with floral bath, synchronized body massages, and herbal tea celebration.',
      duration: 90,
      price: 8200,
      category: 'Couples',
      imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80'
    },
    {
      name: "Royal Golden Orchid Couple's Indulgence",
      description: 'Two hours of bespoke couple pampering: exfoliating jasmine rice scrub, private hydrotherapy soak, and deep restorative oil massage.',
      duration: 120,
      price: 9800,
      category: 'Couples',
      imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80'
    },
    {
      name: 'Traditional Foot Reflexology & Herbal Soak',
      description: 'Warm kaffir lime and sea salt foot bath followed by therapeutic pressure point stimulation across vital reflex zones.',
      duration: 60,
      price: 1200,
      category: 'Foot Treatments',
      imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80'
    },
    {
      name: 'Head, Neck & Shoulder Tension Relief',
      description: 'Concentrated acupressure therapy designed for computer posture syndrome and stress relief in the cervical spine.',
      duration: 45,
      price: 1100,
      category: 'Body Treatments',
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'
    },
    {
      name: 'Serenity Wellness Package',
      description: '60-min Traditional Thai Massage paired with 60-min Organic Facial or Foot Reflexology with premium herbal tea.',
      duration: 120,
      price: 4200,
      category: 'Spa Packages',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80'
    },
    {
      name: 'Bangkok Luxury Rejuvenation Package',
      description: '3 hours of pure bliss: Tamarind body polish, 90-min Hot Stone Massage, and hydrating organic botanical wrap.',
      duration: 180,
      price: 6800,
      category: 'Spa Packages',
      imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80'
    },
    {
      name: 'The Imperial Wellness Odyssey',
      description: 'The pinnacle 4-hour wellness journey: complete head-to-toe hydrotherapy, multi-layer body treatments, and private gourmet dining.',
      duration: 240,
      price: 11000,
      category: 'Spa Packages',
      imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80'
    }
  ]

  for (const s of services) {
    await prisma.service.create({ data: s })
  }

  // Seed Offers with countdown expiration dates
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)

  const offers = [
    {
      title: 'FIRST VISIT WELCOME',
      description: 'Complimentary 20% savings for all first-time guests experiencing Baan Bua Spa.',
      discount: 20,
      code: 'FIRST20',
      minSpend: 1500,
      firstVisitOnly: true,
      validUntil: null
    },
    {
      title: "COUPLE'S ESCAPE",
      description: 'Special 15% discount for any luxury couple spa suite booking.',
      discount: 15,
      code: 'COUPLE15',
      minSpend: 8000,
      categoryLimit: 'Couples',
      validUntil: null
    },
    {
      title: 'WEEKDAY WELLNESS',
      description: 'Flat 25% OFF Monday through Thursday between 11:00 AM and 4:00 PM.',
      discount: 25,
      code: 'WEEKDAY25',
      minSpend: 1800,
      validUntil: null
    },
    {
      title: 'FESTIVE REJUVENATION',
      description: 'Seasonal celebratory special: up to 30% OFF luxury wellness packages.',
      discount: 30,
      code: 'FESTIVE30',
      minSpend: 4000,
      validUntil: nextWeek
    }
  ]

  for (const o of offers) {
    await prisma.offer.create({ data: o })
  }

  // Seed Reviews
  const reviews = [
    {
      customer: 'Lady Penelope H.',
      rating: 5,
      treatment: 'Signature Baan Bua Imperial Ritual',
      comment: 'An oasis of utter tranquility in the heart of Sukhumvit. The therapists have mastered their craft with supreme grace and precision. The herbal tea ritual was divine.'
    },
    {
      customer: 'Tanawat P.',
      rating: 5,
      treatment: 'Volcanic Hot Stone Body Revival',
      comment: 'The finest spa experience in Bangkok. The private suite ambience, aromatic essential oils, and hot stone technique melted all my stress.'
    },
    {
      customer: 'Michael & Sarah C.',
      rating: 5,
      treatment: "Royal Golden Orchid Couple's Indulgence",
      comment: 'We booked the couple sanctuary for our anniversary. Pure luxury from start to finish. The herbal compress and aroma therapy relieved all our travel fatigue.'
    },
    {
      customer: 'Dr. Lisa Chen',
      rating: 5,
      treatment: 'Traditional Thai Massage',
      comment: 'World-class authentic technique. Professional therapists, spotless hygiene standards, and soothing environment. Highly recommended.'
    }
  ]

  for (const r of reviews) {
    await prisma.review.create({ data: r })
  }

  // Seed sample appointment
  const firstService = await prisma.service.findFirst()
  if (firstService) {
    await prisma.appointment.create({
      data: {
        bookingCode: 'BB-8921',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '02:00 PM',
        status: 'CONFIRMED',
        customerName: 'Marcus Vance',
        customerEmail: 'marcus@example.com',
        customerPhone: '+66 89 555 1234',
        guests: 1,
        therapist: 'Khun Mali',
        specialRequest: 'Focus on lower back tension please.',
        serviceId: firstService.id,
        couponCode: 'FIRST20',
        discountAmount: firstService.price * 0.2,
        totalAmount: firstService.price * 0.8,
        paymentMethod: 'PAY_AT_SPA',
        paymentStatus: 'PENDING'
      }
    })
  }

  console.log("Seeding Baan Bua Spa completed successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
