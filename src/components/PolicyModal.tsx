"use client";

import { X } from "lucide-react";

interface PolicyModalProps {
  policyType: "cancellation" | "terms" | "privacy" | "refund" | null;
  onClose: () => void;
}

export default function PolicyModal({ policyType, onClose }: PolicyModalProps) {
  if (!policyType) return null;

  const contentMap: Record<string, { title: string; body: React.ReactNode }> = {
    cancellation: {
      title: "Cancellation & Rescheduling Policy",
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-gray-700">
          <p className="font-semibold text-primary">
            &quot;Appointments may be cancelled or rescheduled up to 4 hours before the scheduled appointment. Late cancellations or no-shows may be subject to a cancellation fee.&quot;
          </p>
          <p>
            At Baan Bua Spa, our therapists prepare natural herbal compresses, tailored essential oil blends, and private suites well in advance of your arrival.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Up to 4 hours prior:</strong> Free cancellation and unlimited date/time rescheduling via our website or telephone.</li>
            <li><strong>Under 4 hours notice:</strong> Late cancellation fee of up to 50% may apply.</li>
            <li><strong>No-show:</strong> Non-refundable for advance deposits; future online booking privileges may be restricted.</li>
          </ul>
        </div>
      )
    },
    terms: {
      title: "Terms & Conditions",
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-gray-700">
          <p>Welcome to Baan Bua Spa. By booking a therapy or accessing our services, you agree to these operational terms.</p>
          <p><strong>Health & Wellness Disclosure:</strong> Guests are required to inform our receptionists of any existing medical conditions, pregnancies, high blood pressure, or recent surgical procedures prior to therapy.</p>
          <p><strong>Sanctuary Etiquette:</strong> To preserve the quiet serenity of all guests, mobile phones must be silenced upon entering the spa reception.</p>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-gray-700">
          <p>Baan Bua Spa respects your personal data. We only collect details essential for confirming your reservations and sending appointment reminders via Email or WhatsApp.</p>
          <p>We do not sell, rent, or share customer contact records with third-party advertisers under any circumstances.</p>
        </div>
      )
    },
    refund: {
      title: "Refund Policy",
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-gray-700">
          <p>Advance deposits for treatments cancelled with at least 4 hours advance notice will be credited back to your original payment method or issued as a spa credit voucher valid for 12 months.</p>
        </div>
      )
    }
  };

  const current = contentMap[policyType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="font-serif text-2xl text-primary font-medium mb-4 pb-2 border-b border-gray-100">
          {current.title}
        </h3>

        {current.body}

        <div className="mt-6 pt-4 border-t border-gray-100 text-right">
          <button
            onClick={onClose}
            className="bg-primary text-white px-5 py-2 rounded text-xs font-semibold hover:bg-primary/90"
          >
            I UNDERSTAND
          </button>
        </div>
      </div>
    </div>
  );
}
