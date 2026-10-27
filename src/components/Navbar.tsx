"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, CalendarCheck, Shield } from "lucide-react";
import ManageBookingModal from "@/components/ManageBookingModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Packages", href: "#packages" },
    { name: "Offers", href: "#offers" },
    { name: "Facilities", href: "#facilities" },
    { name: "Gallery", href: "#gallery" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav className={`fixed w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 shadow-md backdrop-blur-md py-3.5 border-b border-amber-900/10"
          : "bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="group flex flex-col">
                <span className={`font-serif text-2xl sm:text-3xl font-medium tracking-wider transition-colors ${
                  isScrolled ? "text-primary" : "text-white drop-shadow-md"
                }`}>
                  BAAN BUA SPA
                </span>
                <span className={`text-[10px] tracking-[0.25em] uppercase font-sans -mt-1 ${
                  isScrolled ? "text-accent" : "text-amber-200/90"
                }`}>
                  BANGKOK LUXURY WELLNESS
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-7">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    isScrolled ? "text-foreground/90 hover:text-primary" : "text-white/90 hover:text-amber-200"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="hidden sm:flex items-center space-x-3">
              <button
                onClick={() => setIsManageModalOpen(true)}
                className={`text-xs font-medium px-3 py-2 rounded flex items-center space-x-1.5 transition-colors border ${
                  isScrolled
                    ? "border-amber-900/20 text-gray-700 hover:bg-gray-50"
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                <CalendarCheck size={14} />
                <span>My Booking</span>
              </button>

              <Link
                href="#book"
                className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-sm text-xs font-semibold tracking-wider transition-all shadow-sm hover:shadow-md"
              >
                BOOK APPOINTMENT
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsManageModalOpen(true)}
                className={`p-2 rounded sm:hidden ${isScrolled ? "text-primary" : "text-white"}`}
                aria-label="Manage Booking"
              >
                <CalendarCheck size={22} />
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded ${isScrolled ? "text-primary" : "text-white"}`}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-amber-900/10 shadow-2xl absolute w-full left-0">
            <div className="px-5 pt-3 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-amber-50 hover:text-primary rounded-md"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-3 border-t border-gray-100 flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsManageModalOpen(true);
                  }}
                  className="w-full text-center border border-gray-300 text-gray-700 px-4 py-2.5 rounded text-sm font-medium"
                >
                  Manage / Reschedule Booking
                </button>
                <Link 
                  href="#book" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center bg-primary text-white px-4 py-3 rounded-sm text-sm font-semibold tracking-wider hover:bg-primary/90"
                >
                  BOOK AN APPOINTMENT
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center text-xs text-gray-500 py-1 flex items-center justify-center space-x-1"
                >
                  <Shield size={12} />
                  <span>Staff Portal (Login)</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Manage Booking Modal */}
      <ManageBookingModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
      />
    </>
  );
}
