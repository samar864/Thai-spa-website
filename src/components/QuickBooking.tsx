"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock, User, Phone, Mail, CheckCircle2, AlertCircle, Tag, CreditCard, ShieldCheck } from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
}

interface SlotInfo {
  time: string;
  available: boolean;
  reason: string;
}

interface BookingConfirmation {
  bookingCode: string;
  customerName: string;
  date: string;
  timeSlot: string;
  therapist?: string;
  guests: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  service?: {
    name: string;
  };
}

export default function QuickBooking() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [therapists] = useState<string[]>([
    "Any Available Therapist",
    "Khun Mali (Master Practitioner)",
    "Khun Somchai (Deep Tissue Specialist)",
    "Khun Siriporn (Aromatherapy Expert)",
    "Khun Anong (Reflexology Specialist)"
  ]);

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const [formData, setFormData] = useState({
    serviceId: "",
    date: todayStr,
    timeSlot: "",
    guests: "1",
    therapist: "Any Available Therapist",
    name: "",
    phone: "",
    email: "",
    specialRequest: "",
    couponCode: "",
    paymentMethod: "PAY_AT_SPA"
  });

  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [isDayBlocked, setIsDayBlocked] = useState(false);
  const [blockedReason, setBlockedReason] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingConfirmation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch services on mount
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data);
          if (data.length > 0 && !formData.serviceId) {
            setFormData((prev) => ({ ...prev, serviceId: data[0].id }));
          }
        }
      })
      .catch((err) => console.error("Error loading services:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch slot availability whenever date changes
  useEffect(() => {
    if (!formData.date) return;
    setSlotsLoading(true);
    fetch(`/api/availability?date=${formData.date}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.isDayBlocked) {
          setIsDayBlocked(true);
          setBlockedReason(data.reason || "Spa is closed on this date.");
          setSlots([]);
        } else {
          setIsDayBlocked(false);
          setBlockedReason("");
          setSlots(data.slots || []);
          // If current selected slot is no longer available, reset it
          const currentValid = data.slots?.find((s: SlotInfo) => s.time === formData.timeSlot && s.available);
          if (!currentValid && data.slots?.length > 0) {
            const firstAvail = data.slots.find((s: SlotInfo) => s.available);
            setFormData((prev) => ({ ...prev, timeSlot: firstAvail ? firstAvail.time : "" }));
          }
        }
      })
      .catch((err) => console.error("Error loading availability:", err))
      .finally(() => setSlotsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.date]);

  const selectedService = services.find((s) => s.id === formData.serviceId);
  const guestsCount = parseInt(formData.guests) || 1;
  const subtotal = (selectedService?.price || 0) * guestsCount;
  const discountVal = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discountVal);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!formData.couponCode.trim()) return;

    const code = formData.couponCode.trim().toUpperCase();

    // Validate coupon locally or check conditions
    if (code === "FIRST20") {
      if (subtotal < 1500) {
        setCouponError("FIRST20 requires a minimum booking amount of ฿1,500.");
        setAppliedCoupon(null);
        return;
      }
      const disc = Math.round(subtotal * 0.20);
      setAppliedCoupon({ code, discountPercent: 20, discountAmount: disc });
    } else if (code === "COUPLE15") {
      if (selectedService?.category !== "Couples" && subtotal < 8000) {
        setCouponError("COUPLE15 is valid on couple therapies or minimum spend of ฿8,000.");
        setAppliedCoupon(null);
        return;
      }
      const disc = Math.round(subtotal * 0.15);
      setAppliedCoupon({ code, discountPercent: 15, discountAmount: disc });
    } else if (code === "WEEKDAY25") {
      const dateObj = new Date(formData.date);
      const day = dateObj.getDay();
      if (day === 0 || day === 5 || day === 6) {
        setCouponError("WEEKDAY25 is valid Monday through Thursday only.");
        setAppliedCoupon(null);
        return;
      }
      const disc = Math.round(subtotal * 0.25);
      setAppliedCoupon({ code, discountPercent: 25, discountAmount: disc });
    } else if (code === "FESTIVE30") {
      if (subtotal < 4000) {
        setCouponError("FESTIVE30 requires a minimum package spend of ฿4,000.");
        setAppliedCoupon(null);
        return;
      }
      const disc = Math.round(subtotal * 0.30);
      setAppliedCoupon({ code, discountPercent: 30, discountAmount: disc });
    } else {
      setCouponError(`Coupon '${formData.couponCode}' is not recognized or invalid.`);
      setAppliedCoupon(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.timeSlot) {
      setErrorMessage("Please select an available appointment time slot.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to confirm booking.");
      } else {
        setBookingResult(data.booking);
      }
    } catch {
      setErrorMessage("Network error occurred while booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // CONFIRMATION SCREEN
  // -------------------------------------------------------------
  if (bookingResult) {
    const calendarStartTime = `${bookingResult.date.replace(/-/g, '')}T100000Z`;
    const calendarEndTime = `${bookingResult.date.replace(/-/g, '')}T120000Z`;
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Spa Session at Baan Bua Spa: ${bookingResult.service?.name}`
    )}&dates=${calendarStartTime}/${calendarEndTime}&details=${encodeURIComponent(
      `Booking ID: ${bookingResult.bookingCode}\nTherapist: ${bookingResult.therapist}\nTotal: ฿${bookingResult.totalAmount}\nLocation: 88/1 Sukhumvit Soi 39, Bangkok`
    )}&location=88/1+Sukhumvit+Soi+39+Bangkok`;

    const whatsappMessage = encodeURIComponent(
      `Sawadee khrup! I have booked an appointment at Baan Bua Spa.\n\nBooking ID: ${bookingResult.bookingCode}\nTreatment: ${bookingResult.service?.name}\nDate: ${bookingResult.date} at ${bookingResult.timeSlot}\nGuests: ${bookingResult.guests}\nTherapist: ${bookingResult.therapist}\nTotal: ฿${bookingResult.totalAmount?.toLocaleString()}`
    );
    const whatsappUrl = `https://wa.me/66812345678?text=${whatsappMessage}`;

    return (
      <div id="book" className="max-w-4xl mx-auto px-4 -mt-16 sm:-mt-24 relative z-20 mb-16">
        <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-10 border-t-8 border-primary text-center">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} />
          </div>

          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Appointment Confirmed</span>
          <h2 className="text-2xl sm:text-4xl font-serif text-foreground mt-1 mb-2">
            Your Sanctuary Awaits
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-8">
            Thank you, <strong className="text-foreground">{bookingResult.customerName}</strong>. A confirmation has been generated and recorded.
          </p>

          {/* Booking Summary Card */}
          <div className="bg-amber-50/50 border border-amber-900/10 rounded-lg p-6 max-w-2xl mx-auto text-left mb-8 space-y-3">
            <div className="flex justify-between items-center border-b border-amber-900/10 pb-3">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider block">Booking Reference ID</span>
                <span className="font-mono text-2xl font-bold text-primary tracking-wider">{bookingResult.bookingCode}</span>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider">
                {bookingResult.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
              <div>
                <span className="text-xs text-muted-foreground block">Treatment</span>
                <span className="font-medium text-gray-900">{bookingResult.service?.name}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Date & Time</span>
                <span className="font-medium text-gray-900">{bookingResult.date} at {bookingResult.timeSlot}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Therapist</span>
                <span className="font-medium text-gray-900">{bookingResult.therapist || "Any Available"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Number of Guests</span>
                <span className="font-medium text-gray-900">{bookingResult.guests} {bookingResult.guests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Payment Option</span>
                <span className="font-medium text-gray-900">
                  {bookingResult.paymentMethod === 'PAY_AT_SPA' ? 'Pay at Spa upon Arrival' : 'Advance Payment Recorded'}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Total Amount</span>
                <span className="font-serif text-xl font-bold text-primary">฿{bookingResult.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-amber-900/10 pt-3 text-xs text-gray-600 flex items-center space-x-2">
              <ShieldCheck size={16} className="text-primary shrink-0" />
              <span>Complimentary organic herbal tea & foot ritual included. Please arrive 10 minutes prior.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white border border-gray-300 text-gray-800 px-5 py-3 rounded text-xs font-semibold tracking-wider hover:bg-gray-50 shadow-sm transition-all"
            >
              <Calendar size={16} className="text-primary" />
              <span>ADD TO GOOGLE CALENDAR</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-[#25D366] text-white px-5 py-3 rounded text-xs font-semibold tracking-wider hover:bg-[#20ba5a] shadow-sm transition-all"
            >
              <span>SEND TO WHATSAPP</span>
            </a>

            <button
              onClick={() => {
                setBookingResult(null);
                setAppliedCoupon(null);
              }}
              className="inline-flex items-center space-x-2 bg-primary text-white px-5 py-3 rounded text-xs font-semibold tracking-wider hover:bg-primary/90 shadow-sm transition-all"
            >
              <span>BOOK ANOTHER SESSION</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // BOOKING WIDGET FORM
  // -------------------------------------------------------------
  return (
    <div id="book" className="max-w-6xl mx-auto px-4 -mt-16 sm:-mt-24 relative z-20 mb-16">
      <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-10 border-t-8 border-primary">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Real-Time Reservation</span>
          <h2 className="text-2xl sm:text-4xl font-serif text-foreground mt-1">
            Reserve Your Thai Wellness Experience
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Select your therapy, preferred therapist, and appointment slot with real-time confirmation.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded text-sm flex items-start space-x-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Reservation Notice</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Treatment Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center space-x-1">
                <span>Select Therapy</span>
              </label>
              <select
                required
                name="serviceId"
                value={formData.serviceId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2.5 rounded text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.duration}m) — ฿{s.price.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center space-x-1">
                <Calendar size={12} className="text-primary" />
                <span>Select Date</span>
              </label>
              <input
                required
                type="date"
                name="date"
                min={todayStr}
                value={formData.date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2.5 rounded text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            {/* Guests */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center space-x-1">
                <User size={12} className="text-primary" />
                <span>Guests</span>
              </label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2.5 rounded text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              >
                {[1, 2, 3, 4].map((g) => (
                  <option key={g} value={g}>
                    {g} {g === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            {/* Therapist Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Preferred Therapist
              </label>
              <select
                name="therapist"
                value={formData.therapist}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2.5 rounded text-sm bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              >
                {therapists.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real-time Time Slots Selector */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center space-x-1">
                <Clock size={12} className="text-primary" />
                <span>Available Time Slots ({formData.date})</span>
              </label>
              <span className="text-[11px] text-muted-foreground">
                Operating Hours: 10:00 AM – 10:00 PM (Bangkok Time)
              </span>
            </div>

            {isDayBlocked ? (
              <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded border border-amber-200">
                {blockedReason}
              </div>
            ) : slotsLoading ? (
              <div className="py-4 text-center text-xs text-muted-foreground">Checking live availability...</div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {slots.map((s) => {
                  const isSelected = formData.timeSlot === s.time;
                  return (
                    <button
                      key={s.time}
                      type="button"
                      disabled={!s.available}
                      onClick={() => setFormData((prev) => ({ ...prev, timeSlot: s.time }))}
                      className={`py-2 px-2.5 rounded text-xs font-medium border transition-all text-center ${
                        isSelected
                          ? "bg-primary text-white border-primary shadow-sm"
                          : s.available
                          ? "bg-white text-gray-800 border-gray-200 hover:border-primary/50 hover:bg-amber-50/40"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through"
                      }`}
                      title={s.available ? "Click to select slot" : s.reason}
                    >
                      {s.time}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Guest Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 uppercase tracking-wider flex items-center space-x-1">
                <User size={12} className="text-primary" />
                <span>Full Name *</span>
              </label>
              <input
                required
                type="text"
                name="name"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2.5 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 uppercase tracking-wider flex items-center space-x-1">
                <Phone size={12} className="text-primary" />
                <span>Phone / WhatsApp *</span>
              </label>
              <input
                required
                type="tel"
                name="phone"
                placeholder="+66 or digits"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2.5 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 uppercase tracking-wider flex items-center space-x-1">
                <Mail size={12} className="text-primary" />
                <span>Email Address *</span>
              </label>
              <input
                required
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2.5 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Special Requests & Coupon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-700 uppercase tracking-wider block mb-1">
                Special Requests or Focus Areas
              </label>
              <input
                type="text"
                name="specialRequest"
                placeholder="e.g. Lower back stiffness, extra firm pressure, aromatic flower preference..."
                value={formData.specialRequest}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2.5 rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            {/* Coupon Code Field */}
            <div>
              <label className="text-xs font-medium text-gray-700 uppercase tracking-wider flex items-center space-x-1 mb-1">
                <Tag size={12} className="text-accent" />
                <span>Promo / Coupon Code (e.g. FIRST20, COUPLE15, WEEKDAY25)</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="couponCode"
                  placeholder="Enter code"
                  value={formData.couponCode}
                  onChange={handleInputChange}
                  className="flex-1 border border-gray-300 p-2.5 rounded text-sm uppercase tracking-wider focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-amber-900 text-white px-4 py-2.5 rounded text-xs font-semibold hover:bg-amber-800 transition-colors"
                >
                  APPLY
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-xs text-green-700 mt-1 flex items-center space-x-1">
                  <CheckCircle2 size={12} />
                  <span>Coupon {appliedCoupon.code} applied: {appliedCoupon.discountPercent}% OFF (-฿{appliedCoupon.discountAmount.toLocaleString()})</span>
                </p>
              )}
              {couponError && (
                <p className="text-xs text-red-600 mt-1">{couponError}</p>
              )}
            </div>
          </div>

          {/* Payment & Price Summary Box */}
          <div className="bg-amber-50/50 border border-amber-900/10 rounded-lg p-5 flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Payment Method Selector */}
            <div className="space-y-1 w-full md:w-auto">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider block">
                Payment Option
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { id: "PAY_AT_SPA", label: "Pay at Spa on Arrival" },
                  { id: "PARTIAL", label: "50% Advance Guarantee" },
                  { id: "FULL", label: "Full Payment (Instant)" }
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`cursor-pointer px-3 py-2 rounded border transition-colors flex items-center space-x-1.5 ${
                      formData.paymentMethod === opt.id
                        ? "bg-white border-primary text-primary font-semibold shadow-sm"
                        : "bg-white/60 border-gray-200 text-gray-700 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.id}
                      checked={formData.paymentMethod === opt.id}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <CreditCard size={12} />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Calculation */}
            <div className="text-right w-full md:w-auto">
              <div className="text-xs text-muted-foreground">
                {selectedService?.name || "Therapy"} ({guestsCount}x) : ฿{subtotal.toLocaleString()}
              </div>
              {discountVal > 0 && (
                <div className="text-xs text-green-700">
                  Discount ({appliedCoupon?.code}) : -฿{discountVal.toLocaleString()}
                </div>
              )}
              <div className="text-2xl font-serif font-bold text-primary">
                Total: ฿{grandTotal.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={submitting || isDayBlocked}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-sm text-sm font-semibold tracking-widest uppercase transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {submitting ? "CONFIRMING APPOINTMENT..." : "CONFIRM APPOINTMENT"}
            </button>
            <p className="text-center text-[11px] text-muted-foreground mt-2">
              Free cancellation up to 4 hours prior. No upfront payment required when selecting Pay at Spa.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
