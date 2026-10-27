import prisma from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import QuickBooking from "@/components/QuickBooking";
import ServicesCatalog from "@/components/ServicesCatalog";
import PackagesSection from "@/components/PackagesSection";
import SpecialOffers from "@/components/SpecialOffers";
import WhyChooseUs from "@/components/WhyChooseUs";
import FacilitiesSection from "@/components/FacilitiesSection";
import ExperienceSteps from "@/components/ExperienceSteps";
import GallerySection from "@/components/GallerySection";
import ReviewsSection from "@/components/ReviewsSection";
import SpaHoursLocation from "@/components/SpaHoursLocation";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch real data from SQLite database
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { category: "asc" }
  });

  const rawOffers = await prisma.offer.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  const offers = rawOffers.map((o) => ({
    ...o,
    validUntil: o.validUntil ? o.validUntil.toISOString() : null
  }));

  const reviews = await prisma.review.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Quick Booking Widget */}
      <QuickBooking />

      {/* 3. About Section */}
      <section id="about" className="py-24 bg-white border-b border-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Story */}
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-accent">
                Our Heritage & Philosophy
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-foreground mt-2 mb-6 leading-tight">
                A Sanctuary Away <br className="hidden sm:inline" /> From The Everyday.
              </h2>
              
              <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                <p>
                  Founded as an oasis of quiet grace amidst the vibrant energy of Bangkok, <strong>Baan Bua Spa</strong> is dedicated to reviving the sacred, restorative arts of traditional Thai medicine and holistic herbal therapy.
                </p>
                <p>
                  Here, the sensory journey begins with chilled pandan tea, fragrant jasmine garlands, and the gentle whisper of water gardens. Every therapy is choreographed with ancestral wisdom—utilizing therapeutic acupressure along subtle energy meridians (<em>Sen Sib</em>) and warm medicinal herbal compresses harvested from sustainable Chiang Mai farms.
                </p>
                <p>
                  Our practitioners are certified masters of traditional healing, committed to tailoring each stroke to your body&apos;s unique contours and restoring profound physical and spiritual equilibrium.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 items-center">
                <Link
                  href="#services"
                  className="bg-primary hover:bg-primary/90 text-white px-7 py-3 rounded-sm text-xs font-semibold tracking-wider uppercase transition-all shadow-sm"
                >
                  EXPLORE THERAPIES
                </Link>
                <Link
                  href="#contact"
                  className="border border-primary text-primary hover:bg-primary hover:text-white px-7 py-3 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  VISIT SANCTUARY
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-[480px] w-full rounded-sm overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Baan Bua Spa Sanctuary Interior"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-sm border border-amber-900/10 shadow-lg text-xs">
                <span className="font-serif font-bold text-gray-900 block text-sm">
                  Certified Traditional Thai Sanctuary
                </span>
                <span className="text-muted-foreground">
                  88/1 Sukhumvit Soi 39, Phrom Phong, Watthana, Bangkok
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services Section with Interactive Filters */}
      <ServicesCatalog initialServices={services} />

      {/* 5. Curated Spa Packages */}
      <PackagesSection />

      {/* 6. Limited Time Offers with Countdown */}
      <SpecialOffers offers={offers} />

      {/* 7. Why Choose Us */}
      <WhyChooseUs />

      {/* 8. Facilities Section */}
      <FacilitiesSection />

      {/* 9. 3-Step Massage Experience */}
      <ExperienceSteps />

      {/* 10. Photo Gallery with Lightbox */}
      <GallerySection />

      {/* 11. Customer Reviews */}
      <ReviewsSection reviews={reviews} />

      {/* 12. Spa Hours, Location & Enquiry */}
      <SpaHoursLocation />
    </div>
  );
}
