import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/themecontext';
import Picture1 from '/images/picture1.jpg';

export default function CategoriesSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categories = [
    { name: "PIZZA", items: "8 Items", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80", path: "/menu" },
    { name: "BURGERS", items: "4 Items", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", path: "/menu" },
    { name: "PASTA", items: "7 Items", img: Picture1, path: "/menu" },
    { name: "SALADS", items: "4 Items", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80", path: "/menu" },
    { name: "DESSERTS", items: "12 Items", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80", path: "/menu" },
    { name: "DRINKS", items: "14 Items", img: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=600&q=80", path: "/menu" }
  ];

 return (
    <section className={`py-24 border-b transition-colors duration-300 overflow-hidden ${
      isDark ? 'bg-[#12100e] text-white border-white/10' : 'bg-[#fcfbf7] text-[#12100e] border-black/10'
    }`}>
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
          <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide ${
            isDark ? 'text-white' : 'text-[#12100e]'
          }`}>
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
            >
              <Link 
                to={cat.path}
                state={{ reset: true }}
                onClick={() => window.scrollTo(0, 0)}
                className="group cursor-pointer flex flex-col items-center"
              >
                {/* Circular Image Card */}
                <div className={`relative w-36 h-36 md:w-40 md:h-40 rounded-full p-1.5 border group-hover:border-[#C79A44] transition-colors duration-300 shadow-xl mb-4 ${
                  isDark ? 'bg-[#1a1714] border-[#C79A44]/40' : 'bg-white border-[#C79A44]/60'
                }`}>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img 
                      src={cat.img} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                </div>

                {/* Category Name & Count */}
                <h3 className={`font-sans text-sm font-bold tracking-[0.2em] group-hover:text-[#C79A44] transition-colors ${
                  isDark ? 'text-white' : 'text-[#12100e]'
                }`}>
                  {cat.name}
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  {cat.items}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}