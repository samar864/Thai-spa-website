import { 
  Sparkles, Coffee, Bath, Wind, Lock, Wifi, Car, Gift, Heart, Shield 
} from "lucide-react";

const facilities = [
  {
    icon: Sparkles,
    title: "Private Suites",
    description: "Quiet, single-occupancy sanctuary rooms with dim ambient lighting."
  },
  {
    icon: Heart,
    title: "Couple's Suites",
    description: "Spacious private suites with dual massage beds and floral hydrotherapy tubs."
  },
  {
    icon: Bath,
    title: "Shower & Hydrotherapy",
    description: "En-suite rain showers, herbal steam facilities, and organic botanical body washes."
  },
  {
    icon: Lock,
    title: "Changing & Lockers",
    description: "Secure electronic lockers, vanity mirrors, and luxury hair-care amenities."
  },
  {
    icon: Coffee,
    title: "Relaxation Lounge",
    description: "Post-treatment tranquil tea sanctuary overlooking botanical gardens."
  },
  {
    icon: Shield,
    title: "Organic Aromatherapy",
    description: "100% pure cold-pressed botanical oils imported from northern Thai farms."
  },
  {
    icon: Wind,
    title: "Towels & Thai Robes",
    description: "Sanitized high-thread-count cotton robes, slippers, and plush linens."
  },
  {
    icon: Wifi,
    title: "Complimentary Wi-Fi",
    description: "High-speed internet access available throughout the guest lounge."
  },
  {
    icon: Car,
    title: "Valet Parking",
    description: "Dedicated on-site parking and valet service for all spa guests."
  },
  {
    icon: Gift,
    title: "Luxury Gift Cards",
    description: "Elegantly boxed gift vouchers available for all treatments and packages."
  }
];

export default function FacilitiesSection() {
  return (
    <section id="facilities" className="py-24 bg-white border-t border-b border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Thoughtful Comforts</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-foreground mt-2 mb-4">
            World-Class Spa Facilities
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Every detail is designed to preserve your privacy, hygiene, and absolute relaxation before, during, and after your session.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-6 rounded-sm border border-amber-900/10 hover:border-primary/40 hover:shadow-md transition-all text-center flex flex-col items-center justify-between group"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm mb-4">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-gray-900 mb-1">
                    {fac.title}
                  </h3>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {fac.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <div className="text-center mt-12 text-xs text-muted-foreground italic">
          * Facilities may vary slightly depending on suite configuration and therapy booked.
        </div>
      </div>
    </section>
  );
}
