import { Star, CheckCircle } from "lucide-react";

interface Review {
  id: string;
  customer: string;
  rating: number;
  comment: string;
  treatment?: string | null;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <section id="reviews" className="py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Guest Endorsements</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-foreground mt-2 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Discover why international travelers, expats, and Bangkok residents trust Baan Bua Spa for their deepest relaxation.
          </p>

          {/* Overall Rating Badge */}
          <div className="mt-6 inline-flex items-center space-x-3 bg-white px-5 py-2.5 rounded-full shadow-sm border border-amber-900/10">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <span className="font-serif font-bold text-gray-900 text-sm">4.9 / 5</span>
            <span className="text-gray-400">|</span>
            <span className="text-xs text-muted-foreground flex items-center space-x-1">
              <CheckCircle size={12} className="text-green-600" />
              <span>Based on 280+ verified reviews</span>
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-7 rounded-sm shadow-sm hover:shadow-md transition-shadow border border-amber-900/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex text-amber-500 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed italic mb-6">
                  &quot;{rev.comment}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <span className="font-semibold text-xs text-gray-900 block">
                  {rev.customer}
                </span>
                {rev.treatment && (
                  <span className="text-[10px] text-primary font-medium block mt-0.5">
                    {rev.treatment}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
