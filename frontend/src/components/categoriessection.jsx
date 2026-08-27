import React from 'react';
import { motion } from 'framer-motion';
import Picture1 from '../assets/images/picture1.jpg';

export default function CategoriesSection() {
  const categories = [
    {
      name: "PIZZA",
      items: "15 Items",
      img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "BURGERS",
      items: "12 Items",
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "PASTA",
      items: "10 Items",
      img: Picture1
    },
    {
      name: "SALADS",
      items: "9 Items",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "DESSERTS",
      items: "8 Items",
      img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "DRINKS",
      items: "20 Items",
      img: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=600&q=80" // Replaced with a reliable drink link below
    }
  ];

  return (
    <section className="bg-[#12100e] text-white py-24 border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-script text-[#C79A44] text-2xl mb-2">Explore Our Menu</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide">
            Our Delicious Categories
          </h2>
          <div className="w-24 h-0.5 bg-[#C79A44] mx-auto mt-4" />
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer flex flex-col items-center"
            >
              {/* Circular Image Card with Gold Ring */}
              <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full p-1.5 border border-[#C79A44]/40 group-hover:border-[#C79A44] transition-colors duration-300 shadow-xl mb-4 bg-[#1a1714]">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
              </div>

              {/* Category Name & Item Count */}
              <h3 className="font-sans text-sm font-bold tracking-[0.2em] text-white group-hover:text-[#C79A44] transition-colors">
                {cat.name}
              </h3>
              <p className="text-stone-400 text-xs mt-1">
                {cat.items}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}