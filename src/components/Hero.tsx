"use client";
import { Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center pt-20">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white mt-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium mb-6 leading-tight"
        >
          Your Journey to Deep<br/>Relaxation Begins Here.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light"
        >
          Experience authentic Thai-inspired wellness therapies designed to relax your body, calm your mind, and rejuvenate your spirit.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
        >
          <Link href="#book" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-sm text-sm font-semibold tracking-wider transition-all shadow-lg hover:shadow-xl">
            BOOK AN APPOINTMENT
          </Link>
          <Link href="#services" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-sm text-sm font-semibold tracking-wider transition-all">
            EXPLORE SERVICES
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-white/80"
        >
          {['Professional Therapists', 'Premium Products', 'Relaxing Ambience', 'Hygienic Environment'].map((feature) => (
            <div key={feature} className="flex items-center space-x-2">
              <Check size={16} className="text-accent" />
              <span>{feature}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-white/70"
      >
        <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
        <div className="w-[1px] h-12 bg-white/30 relative">
          <div className="absolute top-0 w-[1px] h-1/2 bg-white animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
}
