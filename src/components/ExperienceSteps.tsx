export default function ExperienceSteps() {
  const steps = [
    {
      step: "01",
      title: "ARRIVE",
      subtitle: "Leave the Outside World Behind",
      description: "Step across our water garden into a cool teak reception. Slip into soft slippers, sip chilled pandan herbal tea, and consult on your treatment goals."
    },
    {
      step: "02",
      title: "RELAX",
      subtitle: "Surrender Mind & Musculature",
      description: "In your private suite, certified therapists perform traditional foot washing followed by rhythmic acupressure and warm botanical compresses."
    },
    {
      step: "03",
      title: "REJUVENATE",
      subtitle: "Depart Transformed & Renewed",
      description: "Awaken gradually with warm lemongrass tea and Thai herbal delicacies in our garden pavilion, restored in body, mind, and spirit."
    }
  ];

  return (
    <section className="py-24 bg-[#1C201F] text-white border-t border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">The Sanctuary Ritual</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white mt-2 mb-4">
            Your 3-Step Journey
          </h2>
          <p className="text-white/60 text-sm max-w-lg mx-auto">
            From the instant you cross our threshold, every gesture is designed to ease away city fatigue and restore total balance.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 p-8 rounded-sm hover:border-accent/40 transition-all text-center relative flex flex-col justify-between"
            >
              <div>
                <span className="text-5xl font-serif font-bold text-accent/30 block mb-2">
                  {s.step}
                </span>
                <h3 className="font-serif text-xl font-medium tracking-wider uppercase text-amber-200 mb-1">
                  {s.title}
                </h3>
                <h4 className="text-xs text-white/80 font-medium uppercase tracking-wider mb-4">
                  {s.subtitle}
                </h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
