"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Shield } from "lucide-react";
import PolicyModal from "@/components/PolicyModal";

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState<"cancellation" | "terms" | "privacy" | "refund" | null>(null);

  return (
    <>
      <footer className="bg-[#191C1B] text-white/80 pt-16 pb-24 sm:pb-12 border-t-4 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Story */}
            <div>
              <h2 className="text-2xl font-serif text-white tracking-wider mb-1">BAAN BUA SPA</h2>
              <span className="text-[10px] tracking-[0.25em] text-accent uppercase block mb-4">
                BANGKOK LUXURY WELLNESS
              </span>
              <p className="italic text-white/60 mb-6 font-serif text-sm">
                &quot;Relax. Rejuvenate. Rediscover Yourself.&quot;
              </p>
              <div className="flex space-x-3 text-xs">
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-colors font-medium">IG</a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-colors font-medium">FB</a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-colors font-medium">YT</a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-colors font-medium">LINE</a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Quick Navigation
              </h3>
              <ul className="space-y-2.5 text-xs text-white/70">
                {['Home', 'About', 'Services', 'Packages', 'Offers', 'Facilities', 'Gallery', 'Reviews', 'Contact'].map((link) => (
                  <li key={link}>
                    <Link href={`#${link.toLowerCase()}`} className="hover:text-accent transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Concierge & Hours */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Spa Concierge
              </h3>
              <ul className="space-y-3 text-xs text-white/70">
                <li className="flex items-start space-x-2.5">
                  <Phone size={14} className="text-accent mt-0.5 shrink-0" />
                  <span>+66 2 123 4567 / +66 81 234 5678</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <Mail size={14} className="text-accent mt-0.5 shrink-0" />
                  <span>concierge@baanbuaspa.com</span>
                </li>
                <li className="pt-2 text-white/60">
                  <strong className="text-white block text-xs">Opening Hours (Bangkok Time):</strong>
                  Monday — Sunday: 10:00 AM – 10:00 PM<br />
                  <span className="text-[11px] text-amber-200">Last Appointment: 09:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Address & Staff Access */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Location
              </h3>
              <div className="flex items-start space-x-2.5 text-xs text-white/70 mb-4">
                <MapPin size={14} className="text-accent mt-0.5 shrink-0" />
                <span>
                  88/1 Sukhumvit Soi 39, Phrom Phong,<br />
                  Watthana, Bangkok 10110, Thailand<br />
                  <span className="text-[11px] text-amber-200">300m from BTS Phrom Phong (Valet available)</span>
                </span>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-1.5 text-xs text-white/50 hover:text-white transition-colors"
                >
                  <Shield size={12} className="text-accent" />
                  <span>Staff Portal (Password: spa2026)</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/50">
            <p>© 2026 Baan Bua Spa Bangkok. All Rights Reserved.</p>
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-4 md:mt-0">
              <button onClick={() => setActivePolicy("privacy")} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => setActivePolicy("terms")} className="hover:text-white transition-colors">Terms & Conditions</button>
              <button onClick={() => setActivePolicy("cancellation")} className="hover:text-white transition-colors underline font-medium text-amber-200/90">Cancellation Policy</button>
              <button onClick={() => setActivePolicy("refund")} className="hover:text-white transition-colors">Refund Policy</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Bottom Bar on Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 p-2.5 px-4 flex items-center justify-between shadow-2xl">
        <a
          href="tel:+6621234567"
          className="flex flex-col items-center text-gray-700 hover:text-primary px-3 py-1"
        >
          <Phone size={18} />
          <span className="text-[10px] mt-0.5 font-medium">Call Us</span>
        </a>

        <Link
          href="#book"
          className="flex-1 ml-3 bg-primary text-white py-2.5 px-4 rounded-sm text-xs font-bold uppercase tracking-wider text-center shadow-md hover:bg-primary/90"
        >
          BOOK NOW
        </Link>
      </div>

      <PolicyModal
        policyType={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </>
  );
}
