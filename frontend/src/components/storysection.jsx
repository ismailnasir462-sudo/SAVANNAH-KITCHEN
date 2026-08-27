import React from 'react';
import { ArrowRight } from 'lucide-react';
import {motion} from 'framer-motion';

export default function StorySection() {
  return (
    <section className="relative bg-[#12100e] text-white py-24 overflow-hidden border-b border-white/10">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1800&q=80" 
          alt="Restaurant kitchen background" 
          className="w-full h-full object-cover opacity-200"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#12100e] via-[#12100e]/80 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="font-script text-[#C79A44] text-2xl mb-2">Our Story</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 text-white">
            Cooking with Heart<br />
            <span className="text-[#C79A44]">Serving with Love</span>
          </h2>
          
          <p className="text-stone-300 text-sm md:text-base leading-relaxed mb-8">
            At Savannah Kitchen, we believe food is more than a meal...it’s an experience. From traditional recipes to modern twists, we bring people together through flavor, culture, and warmth.</p>

          <button className="inline-flex items-center gap-2 bg-[#7A2A32] text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#632127] transition-colors shadow-lg">
            Read More About Us <ArrowRight size={16} />
          </button>
        </motion.div>

        {/* Right Side: High-End Food Dish Photo Collage */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative w-full max-w-[480px] aspect-square rounded-full overflow-hidden border-4 border-[#C79A44]/30 shadow-2xl p-2 bg-[#1a1714]">
            <img 
              src="https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1000&q=80" 
              alt="Fresh gourmet pasta dish" 
              className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}