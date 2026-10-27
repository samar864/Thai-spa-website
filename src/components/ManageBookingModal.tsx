"use client";

import { useState } from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";

interface BookingDetail {
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  guests: number;
  therapist?: string;
  totalAmount: number;
  status: string;
  specialRequest?: string;
  service?: {
    name: string;
  };
}

interface ManageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageBookingModal({ isOpen, onClose }: ManageBookingModalProps) {
  const [bookingCode, setBookingCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingDetail | null>(null);

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState("");

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/bookings/manage?code=${encodeURIComponent(bookingCode)}&phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Booking not found.");
      } else {
        setBooking(data.booking);
      }
    } catch {
      setError("Failed to look up booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!booking) return;
    if (!confirm("Are you sure you wish to cancel this appointment?")) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingCode: booking.bookingCode,
          phone,
          action: "cancel"
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to cancel.");
      } else {
        setMessage(data.message);
        setBooking({ ...booking, status: "CANCELLED" });
      }
    } catch {
      setError("Cancellation request failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;
    if (!newDate || !newTimeSlot) {
      setError("Please choose both a new date and time slot.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingCode: booking.bookingCode,
          phone,
          action: "reschedule",
          newDate,
          newTimeSlot
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to reschedule.");
      } else {
        setMessage(data.message);
        setBooking(data.booking);
        setIsRescheduling(false);
      }
    } catch {
      setError("Rescheduling request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={22} />
        </button>

        <div className="text-center mb-6">
          <h3 className="font-serif text-2xl text-primary font-medium">Manage My Booking</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Review, reschedule, or cancel your appointment at Baan Bua Spa.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm flex items-start space-x-2">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm flex items-start space-x-2">
            <CheckCircle size={18} className="shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {!booking ? (
          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                Booking ID
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BB-8921"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-sm uppercase tracking-wider focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                Phone Number (used during booking)
              </label>
              <input
                type="tel"
                required
                placeholder="+66 or digits"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-300 rounded p-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "SEARCHING..." : "FIND APPOINTMENT"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-md space-y-2 text-sm">
              <div className="flex justify-between items-center border-b border-amber-200/50 pb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Booking ID</span>
                <span className="font-mono font-bold text-primary">{booking.bookingCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Treatment:</span>
                <span className="font-medium text-gray-900">{booking.service?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium text-gray-900">{booking.date} at {booking.timeSlot}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Therapist:</span>
                <span className="font-medium text-gray-900">{booking.therapist || "Any Available"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium text-gray-900">{booking.guests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Price:</span>
                <span className="font-bold text-primary">฿{booking.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-amber-200/50">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                  booking.status === 'RESCHEDULED' ? 'bg-blue-100 text-blue-800' :
                  booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>

            {booking.status !== 'CANCELLED' && !isRescheduling && (
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsRescheduling(true)}
                  className="flex-1 bg-amber-700 text-white py-2.5 rounded text-sm font-medium hover:bg-amber-800 transition-colors"
                >
                  Reschedule
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 border border-red-300 text-red-700 py-2.5 rounded text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            )}

            {isRescheduling && (
              <form onSubmit={handleReschedule} className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-800">Select New Date & Time</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">New Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full border rounded p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">New Time</label>
                    <select
                      required
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      className="w-full border rounded p-2 text-sm"
                    >
                      <option value="">Select time...</option>
                      {[
                        "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM",
                        "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
                        "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"
                      ].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-white py-2 rounded text-sm font-medium hover:bg-primary/90"
                  >
                    Confirm Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRescheduling(false)}
                    className="px-4 border rounded text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}

            <button
              type="button"
              onClick={() => { setBooking(null); setError(null); setMessage(null); }}
              className="w-full text-center text-xs text-muted-foreground hover:underline"
            >
              ← Search Another Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
