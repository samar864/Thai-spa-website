"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface GalleryImage {
  src: string;
  title: string;
  category: string;
}

const galleryImages: GalleryImage[] = [
  {
    src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=85",
    title: "Sanctuary Entrance & Courtyard",
    category: "Spa Entrance"
  },
  {
    src: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1200&q=85",
    title: "VIP Couple's Hydrotherapy Suite",
    category: "Couple Rooms"
  },
  {
    src: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=1200&q=85",
    title: "Aromatic Essential Oils & Thai Compresses",
    category: "Products"
  },
  {
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=85",
    title: "Herbal Relaxation Lounge",
    category: "Relaxation Lounge"
  },
  {
    src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=85",
    title: "Private Teak Massage Chamber",
    category: "Massage Rooms"
  },
  {
    src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=85",
    title: "Floral Foot Ritual & Botanical Soak",
    category: "Treatment Areas"
  }
];

export default function GallerySection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const openLightbox = (index: number) => setActiveIdx(index);
  const closeLightbox = () => setActiveIdx(null);

  const prevImage = () => {
    if (activeIdx !== null) {
      setActiveIdx((activeIdx - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const nextImage = () => {
    if (activeIdx !== null) {
      setActiveIdx((activeIdx + 1) % galleryImages.length);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Visual Tour</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-foreground mt-2 mb-4">
            The Baan Bua Sanctuary
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Take a visual glimpse into our serene Bangkok haven, crafted with authentic northern Thai architecture, calming water features, and aromatic herbal suites.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="group relative h-72 rounded-sm overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
            >
              <Image
                src={img.src}
                alt={img.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-white">
                <span className="text-xs text-amber-300 uppercase tracking-widest font-sans">{img.category}</span>
                <div className="flex justify-between items-center mt-1">
                  <h4 className="font-serif text-lg">{img.title}</h4>
                  <ZoomIn size={18} className="text-amber-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 sm:p-8">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X size={28} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 sm:left-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Previous Image"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 sm:right-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Next Image"
          >
            <ChevronRight size={28} />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full h-[70vh] flex flex-col items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={galleryImages[activeIdx].src}
                alt={galleryImages[activeIdx].title}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <h3 className="font-serif text-xl">{galleryImages[activeIdx].title}</h3>
              <p className="text-xs text-amber-200 uppercase tracking-widest mt-1">
                {galleryImages[activeIdx].category} ({activeIdx + 1} of {galleryImages.length})
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
