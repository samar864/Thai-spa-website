import { Sparkles, ShieldCheck, HeartHandshake, Flower2, Droplets, Users } from "lucide-react";

const reasons = [
  {
    icon: Flower2,
    title: "Authentic Thai Healing",
    description: "Centuries-old Wat Pho & northern Lanna massage traditions passed down through generations."
  },
  {
    icon: Users,
    title: "Certified Master Therapists",
    description: "Senior practitioners licensed by Thailand’s Ministry of Public Health with 8–15 years experience."
  },
  {
    icon: Droplets,
    title: "Organic Botanical Formulations",
    description: "Pure cold-pressed virgin coconut, wild lemongrass, ginger, and plai extracts with zero chemicals."
  },
  {
    icon: ShieldCheck,
    title: "Hospital-Grade Hygiene Standards",
    description: "Freshly sterilized linens for every guest, single-use slippers, and continuous air purification."
  },
  {
    icon: Sparkles,
    title: "Serene Private Suites",
    description: "Tranquil water walls, acoustic dampening, and aromatic diffusers create total peaceful seclusion."
  },
  {
    icon: HeartHandshake,
    title: "Personalized Consultations",
    description: "Therapies customized to your specific posture fatigue, trigger zones, and preferred pressure level."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">The Baan Bua Difference</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-foreground mt-2 mb-4">
            Why Guests Choose Baan Bua Spa
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Honored with Bangkok’s luxury wellness accolades for our uncompromising pursuit of authenticity, serenity, and guest wellbeing.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-8 rounded-sm border border-amber-900/10 hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm mb-6">
                  <Icon size={24} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2">
                  {r.title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {r.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
