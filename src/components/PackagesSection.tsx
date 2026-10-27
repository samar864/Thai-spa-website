import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

const packages = [
  {
    name: "Serenity Wellness Package",
    duration: "120 Minutes",
    price: 4200,
    description: "Harmonious two-hour full body restoration combining ancient Thai massage with refreshing foot therapy.",
    features: [
      "60-minute Traditional Thai Acupressure Massage",
      "30-minute Foot Reflexology & Herbal Foot Soak",
      "30-minute Head, Neck & Shoulder Tension Relief",
      "Complimentary Organic Lemongrass & Pandan Herbal Tea"
    ],
    highlight: false
  },
  {
    name: "Bangkok Luxury Rejuvenation",
    duration: "180 Minutes",
    price: 6800,
    description: "Our signature three-hour head-to-toe holistic journey crafted to relieve travel exhaustion and city fatigue.",
    features: [
      "30-minute Organic Tamarind & Honey Body Scrub",
      "90-minute Volcanic Hot Stone & Herbal Compress Therapy",
      "30-minute Restorative Botanical Facial Treatment",
      "30-minute Hydrotherapy Floral Herbal Bath",
      "Private Suite Amenities & Thai Herbal Refreshments"
    ],
    highlight: true
  },
  {
    name: "The Imperial Wellness Odyssey",
    duration: "240 Minutes",
    price: 11000,
    description: "The ultimate four-hour luxury retreat in our VIP Master Suite with personalized multi-stage treatments.",
    features: [
      "Welcome Foot Cleansing & Jasmine Garland Ritual",
      "45-minute Body Exfoliation & White Clay Cocoon Wrap",
      "90-minute Signature Baan Bua Herbal Oil Massage",
      "45-minute Anti-Aging Jade Stone Facial",
      "30-minute VIP Herbal Steam & Jacuzzi Session",
      "Private Chef Thai Wellness High Tea & Fresh Coconut"
    ],
    highlight: false
  }
];

export default function PackagesSection() {
  return (
    <section id="packages" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Immersion Journeys</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-foreground mt-2 mb-4">
            Curated Spa Packages
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Experience complete physical renewal with multi-hour wellness rituals performed in our private treatment chambers.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`rounded-sm p-8 flex flex-col justify-between transition-all relative ${
                pkg.highlight
                  ? "bg-white border-2 border-primary shadow-2xl scale-100 lg:-translate-y-2"
                  : "bg-white/80 border border-amber-900/10 shadow-md hover:shadow-xl"
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow flex items-center space-x-1">
                  <Sparkles size={11} className="text-amber-300" />
                  <span>Most Popular Choice</span>
                </div>
              )}

              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs text-primary font-semibold uppercase tracking-wider">{pkg.duration}</span>
                </div>

                <h3 className="font-serif text-2xl font-medium text-gray-900 mb-3">
                  {pkg.name}
                </h3>

                <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                  {pkg.description}
                </p>

                <div className="mb-8 pb-6 border-b border-gray-100">
                  <span className="font-serif text-3xl font-bold text-primary">
                    ฿{pkg.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">/ person</span>
                </div>

                <div className="space-y-3 mb-8">
                  <span className="text-xs font-semibold text-gray-800 uppercase tracking-wider block">
                    Journey Inclusions:
                  </span>
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start space-x-2 text-xs text-gray-600">
                      <Check size={14} className="text-accent mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  href="#book"
                  className={`block w-full text-center py-3 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm ${
                    pkg.highlight
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : "border border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  BOOK THIS PACKAGE
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
