# Thai-spa-website — Baan Bua Spa Bangkok

A luxury, mobile-first web application and online booking platform for **Baan Bua Spa & Wellness Center** located in Bangkok, Thailand. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM** with **SQLite**.

---

## ✨ Features

### 🌿 Public Guest Experience
- **Luxury Aesthetic**: Calming color palette (warm beige, cream, soft gold, earthy brown, deep green), Playfair Display serif headings, and subtle animations.
- **Full-Menu Showcase**: Signature Thai Massage, Aroma Oil, Hot Stone, Couple Treatments, and Multi-Hour Spa Packages priced in **Thai Baht (฿)**.
- **Dynamic Filtering**: Filter therapies by category (*Thai Massage*, *Oil Massage*, *Couples*, *Spa Packages*, etc.), duration (*30-60m*, *90m*, *120m+*), or price sorting.
- **Real-Time Booking Engine**:
  - Live slot availability checking to prevent double-booking.
  - Therapist preference selection (*Khun Mali*, *Khun Somchai*, *Khun Siriporn*, *Khun Anong*, or *Any Available*).
  - Promo coupon validation engine (`FIRST20`, `WEEKDAY25`, `COUPLE15`, `FESTIVE30`) enforcing minimum spends and category restrictions.
  - Payment options: Pay at Spa, 50% Advance Guarantee, Full Payment.
  - Post-booking confirmation with Reference ID (e.g., `BB-8921`), one-click **Google Calendar** integration, and **WhatsApp** chat confirmation.
- **Self-Service "My Booking"**: Guests can look up their booking by ID + Phone number to reschedule or cancel with policy enforcement (up to 4 hours in advance).
- **Bangkok Time Live Status**: Dynamically calculates and displays whether the spa is `OPEN NOW` or `CLOSED` based on Bangkok local time (`Asia/Bangkok`, UTC+7).
- **Interactive Lightbox Gallery**: Full-screen photo gallery with touch/keyboard navigation.
- **Limited-Time Offers**: Seasonal promotions featuring live ticking countdown timers.
- **Contact & Enquiry Form**: Submits messages directly to the staff inbox in the admin portal.

### 🛡️ Staff & Admin Management Portal (`/admin`)
- **Password-Protected Access**: Staff demo password: `spa2026`.
- **Appointments Management**: Search, filter by status (*Confirmed*, *Rescheduled*, *Completed*, *Cancelled*), approve, reschedule, or cancel bookings.
- **Services & Rates**: Add therapies, update rates in Baht, modify durations, and manage categories.
- **Offers & Coupons**: Create new promo codes, configure discount percentages, set minimum spend rules, and toggle active status.
- **Availability & Slot Blocking**: Block full dates (for private events) or specific time slots (for maintenance).
- **Guest History**: Aggregated customer list highlighting VIP repeat visitors and total spend.
- **Reviews & Enquiries**: Moderate guest testimonials and view customer contact submissions.
- **Website Settings**: Configure spa name, address, telephone, WhatsApp number, and cancellation policy.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Date Handling**: date-fns

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/samar864/Thai-spa-website.git
cd Thai-spa-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Initialize the database
```bash
# Push Prisma schema to SQLite database
npx prisma db push

# Seed initial services, therapists, offers, reviews, and settings
node seed.cjs
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001`) in your browser to view the website.

To access the Admin Portal, navigate to:
[http://localhost:3000/admin](http://localhost:3000/admin) (Password: `spa2026`).

---

## 📂 Project Structure

```
├── prisma/
│   └── schema.prisma        # Database schema (Service, Appointment, Offer, etc.)
├── src/
│   ├── app/
│   │   ├── admin/           # Admin dashboard portal & layout
│   │   ├── api/             # REST API routes (availability, bookings, admin, etc.)
│   │   ├── globals.css      # Theme colors & styling variables
│   │   ├── layout.tsx       # Root layout with navbar, footer, floating WhatsApp
│   │   └── page.tsx         # Main landing page with all 12 luxury sections
│   ├── components/          # Reusable UI & section components
│   │   ├── FacilitiesSection.tsx
│   │   ├── FloatingWhatsApp.tsx
│   │   ├── Footer.tsx
│   │   ├── GallerySection.tsx
│   │   ├── Hero.tsx
│   │   ├── ManageBookingModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── PackagesSection.tsx
│   │   ├── PolicyModal.tsx
│   │   ├── QuickBooking.tsx
│   │   ├── ReviewsSection.tsx
│   │   ├── ServicesCatalog.tsx
│   │   ├── SpaHoursLocation.tsx
│   │   └── SpecialOffers.tsx
│   └── lib/
│       └── db.ts            # Prisma client singleton
├── seed.ts / seed.cjs       # Database seed scripts with Bangkok rates
└── tailwind.config.ts       # Tailwind CSS configuration
```

---

## 📄 License
MIT © 2026 Baan Bua Spa
