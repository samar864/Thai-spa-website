"use client";

import { useState, useEffect } from "react";
import { Clock, MapPin, Phone, Send, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";

export default function SpaHoursLocation() {
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [currentTimeBKK, setCurrentTimeBKK] = useState("");

  // Enquiry form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);

  // Check Bangkok Time (UTC+7)
  useEffect(() => {
    const checkBangkokHours = () => {
      try {
        const bkkFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Bangkok",
          hour: "numeric",
          minute: "numeric",
          hour12: false
        });
        const parts = bkkFormatter.formatToParts(new Date());
        const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "12");

        // Open 10:00 to 22:00
        const isSpaOpen = hour >= 10 && hour < 22;
        setIsOpenNow(isSpaOpen);

        const timeString = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Bangkok",
          hour: "numeric",
          minute: "numeric",
          hour12: true
        }).format(new Date());

        setCurrentTimeBKK(timeString);
      } catch {
        setIsOpenNow(true);
      }
    };

    checkBangkokHours();
    const interval = setInterval(checkBangkokHours, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setEnquiryError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        setEnquiryError(data.error || "Failed to submit enquiry.");
      } else {
        setEnquirySuccess(true);
      }
    } catch {
      setEnquiryError("Network error. Please try calling us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Find Us in Bangkok</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-foreground mt-2 mb-4">
            Visit Our Urban Sanctuary
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Conveniently nestled in Phrom Phong on Sukhumvit Soi 39, offering peaceful seclusion just moments away from EmQuartier and BTS Phrom Phong.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Hours, Location & Details */}
          <div className="bg-white p-8 rounded-sm shadow-sm border border-amber-900/10 space-y-8">
            
            {/* Live Opening Hours Status */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Clock className="text-primary" size={24} />
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-gray-900">Opening Hours</h3>
                    <p className="text-xs text-muted-foreground">Monday — Sunday</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    isOpenNow
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isOpenNow ? "bg-green-600 animate-pulse" : "bg-red-600"}`} />
                    <span>{isOpenNow ? "OPEN NOW" : "CLOSED"}</span>
                  </div>
                  {currentTimeBKK && (
                    <span className="block text-[10px] text-muted-foreground mt-1">
                      Bangkok: {currentTimeBKK}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-semibold block text-gray-800">Operating Schedule</span>
                  <span>10:00 AM – 10:00 PM Daily</span>
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Last Appointment</span>
                  <span>09:00 PM (60m sessions)</span>
                </div>
              </div>
            </div>

            {/* Address & Directions */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="text-primary shrink-0 mt-1" size={22} />
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">Sanctuary Address</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    88/1 Sukhumvit Soi 39, Phrom Phong, Watthana,<br />
                    Bangkok 10110, Thailand (Near BTS Phrom Phong)
                  </p>
                  <a
                    href="https://maps.google.com/?q=88+Sukhumvit+Soi+39+Bangkok"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-semibold text-primary hover:text-accent uppercase tracking-wider underline"
                  >
                    GET DIRECTIONS VIA GOOGLE MAPS →
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <a
                href="tel:+6621234567"
                className="flex items-center space-x-2 p-3 rounded border border-gray-200 hover:border-primary/50 hover:bg-amber-50/50 transition-colors"
              >
                <Phone size={16} className="text-primary shrink-0" />
                <div>
                  <span className="font-bold block text-gray-800">Call Concierge</span>
                  <span className="text-gray-500">+66 2 123 4567</span>
                </div>
              </a>

              <a
                href="https://wa.me/66812345678"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 p-3 rounded border border-green-200 hover:border-green-400 bg-green-50/50 hover:bg-green-50 transition-colors"
              >
                <MessageCircle size={16} className="text-green-600 shrink-0" />
                <div>
                  <span className="font-bold block text-green-900">WhatsApp Chat</span>
                  <span className="text-green-700">+66 81 234 5678</span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Enquiry Form */}
          <div className="bg-white p-8 rounded-sm shadow-sm border border-amber-900/10">
            <h3 className="font-serif text-xl font-medium text-gray-900 mb-2">
              Send a General Enquiry
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Have questions regarding bespoke private bookings, group packages, or customized wellness rituals? Send our concierge a message.
            </p>

            {enquirySuccess ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded text-center space-y-3">
                <CheckCircle2 size={36} className="text-green-600 mx-auto" />
                <h4 className="font-serif text-lg text-green-900">Enquiry Received</h4>
                <p className="text-xs text-green-800 max-w-sm mx-auto">
                  Thank you for reaching out. Our spa host will respond to your email or WhatsApp message promptly.
                </p>
                <button
                  onClick={() => {
                    setEnquirySuccess(false);
                    setFormData({ name: "", email: "", phone: "", service: "", date: "", time: "", message: "" });
                  }}
                  className="text-xs font-semibold text-primary underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                {enquiryError && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200 flex items-center space-x-2">
                    <AlertCircle size={14} />
                    <span>{enquiryError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 uppercase block mb-1">
                      Your Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Sarah Connor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 uppercase block mb-1">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 uppercase block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+66..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 uppercase block mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-700 uppercase block mb-1">
                      Preferred Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2:00 PM"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-700 uppercase block mb-1">
                    Message or Special Inquiry *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="How can we assist your spa retreat?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border border-gray-300 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Send size={13} />
                  <span>{submitting ? "SENDING..." : "SEND ENQUIRY"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
