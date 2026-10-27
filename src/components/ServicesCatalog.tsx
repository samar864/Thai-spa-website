"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Filter } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  imageUrl?: string | null;
}

interface ServicesCatalogProps {
  initialServices: Service[];
}

const CATEGORIES = [
  "All",
  "Thai Massage",
  "Oil Massage",
  "Body Treatments",
  "Foot Treatments",
  "Couples",
  "Spa Packages",
  "Wellness Treatments"
];

export default function ServicesCatalog({ initialServices }: ServicesCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  // Filtering
  const filteredServices = initialServices
    .filter((s) => {
      if (selectedCategory !== "All" && s.category !== selectedCategory) return false;
      if (selectedDuration === "short" && s.duration > 60) return false;
      if (selectedDuration === "medium" && s.duration !== 90) return false;
      if (selectedDuration === "long" && s.duration < 120) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "price-asc") return a.price - b.price;
      if (sortOrder === "price-desc") return b.price - a.price;
      if (sortOrder === "duration") return a.duration - b.duration;
      return 0;
    });

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Curated Menu</span>
          <h2 className="text-3xl sm:text-5xl font-serif text-foreground mt-2 mb-4">
            Signature Spa Therapies
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Rooted in ancestral Thai healing traditions, each therapy combines cold-pressed organic botanicals, therapeutic acupressure, and deep rhythmic strokes.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#FAF8F5] p-5 rounded-lg border border-amber-900/10 mb-12 space-y-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-amber-100/60 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Filters: Duration & Price Sort */}
          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-amber-900/10 text-xs text-gray-600 gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={14} className="text-primary" />
              <span className="font-medium">Filter Duration:</span>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="border border-gray-300 rounded px-2.5 py-1.5 bg-white text-xs outline-none"
              >
                <option value="All">All Durations</option>
                <option value="short">30 – 60 Minutes</option>
                <option value="medium">90 Minutes</option>
                <option value="long">120+ Minutes</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-medium">Sort By:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-300 rounded px-2.5 py-1.5 bg-white text-xs outline-none"
              >
                <option value="default">Featured / Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration">Duration</option>
              </select>
            </div>

            <div className="text-muted-foreground font-medium">
              Showing {filteredServices.length} {filteredServices.length === 1 ? 'treatment' : 'treatments'}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white border border-border rounded-sm overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-60 w-full overflow-hidden bg-muted">
                  <Image
                    src={service.imageUrl || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80"}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {service.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl font-medium text-foreground leading-snug group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center space-x-1">
                      <Clock size={13} className="text-accent" />
                      <span>{service.duration} mins</span>
                    </span>
                    <span className="font-serif text-lg font-bold text-primary">
                      ฿{service.price.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <Link
                  href="#book"
                  className="block w-full text-center border border-primary text-primary hover:bg-primary hover:text-white py-2.5 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors"
                >
                  RESERVE THIS SESSION
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
