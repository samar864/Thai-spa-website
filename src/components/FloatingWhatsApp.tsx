import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const phoneNumber = "66812345678";
  const message = encodeURIComponent("Hi, I would like to book an appointment at Baan Bua Spa. Please help me with available slots.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 sm:bottom-6 right-6 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-40 flex items-center justify-center group"
      aria-label="Chat with Baan Bua Concierge on WhatsApp"
    >
      <MessageCircle size={26} />
      <span className="absolute right-16 bg-white text-gray-800 px-3 py-1.5 rounded shadow-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100">
        Chat with Concierge
      </span>
    </a>
  );
}
