"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Clock, Copy, Check } from "lucide-react";

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: number;
  code: string;
  validUntil?: Date | string | null;
}

interface SpecialOffersProps {
  offers: Offer[];
}

export default function SpecialOffers({ offers }: SpecialOffersProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Countdown timer for festive offer
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers" className="py-24 bg-[#F8F5EE] border-t border-b border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-200/60 text-amber-900 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Exclusive Seasonal Privileges</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-foreground mb-4">
            Relax More. Save More.
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Take advantage of our curated seasonal promotions. Claim your preferential rate when reserving online.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer) => {
            const isFestive = offer.code === "FESTIVE30";
            return (
              <div
                key={offer.id}
                className={`bg-white rounded-sm p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all border flex flex-col justify-between relative ${
                  isFestive ? "border-accent ring-1 ring-accent" : "border-amber-900/10"
                }`}
              >
                {isFestive && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] uppercase font-bold tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                    Limited Period
                  </span>
                )}

                <div>
                  <h3 className="font-serif text-lg font-medium text-gray-900 mb-1">
                    {offer.title}
                  </h3>
                  
                  <div className="my-4">
                    <span className="text-4xl font-serif font-bold text-primary">
                      {offer.discount}% OFF
                    </span>
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                    {offer.description}
                  </p>

                  {/* Countdown timer for festive special */}
                  {isFestive && (
                    <div className="mb-6 p-3 bg-amber-50 rounded border border-amber-200/60">
                      <div className="flex items-center space-x-1 text-[11px] font-semibold text-amber-900 mb-2">
                        <Clock size={12} />
                        <span>OFFER ENDS IN:</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-center font-mono text-xs">
                        <div className="bg-white p-1 rounded border text-gray-800">
                          <span className="font-bold">{timeLeft.days}</span>
                          <span className="block text-[8px] text-gray-500 font-sans">DAYS</span>
                        </div>
                        <div className="bg-white p-1 rounded border text-gray-800">
                          <span className="font-bold">{timeLeft.hours}</span>
                          <span className="block text-[8px] text-gray-500 font-sans">HRS</span>
                        </div>
                        <div className="bg-white p-1 rounded border text-gray-800">
                          <span className="font-bold">{timeLeft.minutes}</span>
                          <span className="block text-[8px] text-gray-500 font-sans">MIN</span>
                        </div>
                        <div className="bg-white p-1 rounded border text-gray-800">
                          <span className="font-bold">{timeLeft.seconds}</span>
                          <span className="block text-[8px] text-gray-500 font-sans">SEC</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between bg-muted/60 p-2 rounded text-xs">
                    <span className="font-mono font-bold text-gray-800 tracking-wider">
                      CODE: {offer.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(offer.code)}
                      className="text-primary hover:text-accent transition-colors flex items-center space-x-1"
                      title="Copy code"
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check size={12} className="text-green-600" />
                          <span className="text-[10px] text-green-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <Link
                    href="#book"
                    className="block w-full text-center bg-primary hover:bg-primary/90 text-white py-2.5 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    CLAIM OFFER
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
