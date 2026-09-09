import React from 'react';
import { motion } from 'framer-motion';
import { Award, UtensilsCrossed, Users, Heart } from 'lucide-react';
import { useTheme } from '../context/themecontext';

export default function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const stats = [
    { icon: UtensilsCrossed, label: "Dishes Served Daily", value: "500+" },
    { icon: Award, label: "Culinary Awards", value: "12" },
    { icon: Users, label: "Happy Guests", value: "15k+" },
    { icon: Heart, label: "Years of Excellence", value: "8" },
  ];

  return (
    <div className={`py-16 px-5 md:px-8 max-w-7xl mx-auto overflow-hidden transition-colors duration-300 ${
      isDark ? 'text-white' : 'text-[#12100e]'
    }`}>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <p className="font-script text-[#C79A44] text-3xl mb-1">Our Culinary Journey</p>
        <h1 className={`font-serif text-4xl sm:text-5xl font-bold ${
          isDark ? 'text-white' : 'text-[#12100e]'
        }`}>
          About Savannah Kitchen
        </h1>
        <div className="w-24 h-0.5 bg-[#C79A44] mx-auto mt-4" />
      </motion.div>

      {/* Main Story Grid */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        
        {/* Left Side: Images */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className={`aspect-[4/3] rounded-2xl overflow-hidden border shadow-2xl ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}>
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80" 
              alt="Restaurant Interior" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`absolute -bottom-6 -right-6 w-1/2 aspect-square rounded-2xl overflow-hidden border-4 shadow-2xl hidden sm:block ${
            isDark ? 'border-[#12100e]' : 'border-[#fcfbf7]'
          }`}>
            <img 
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80" 
              alt="Executive Chef" 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Right Side: Narrative */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <h2 className={`font-sans text-3xl font-bold leading-snug ${
            isDark ? 'text-white' : 'text-[#12100e]'
          }`}>
            Crafting Unforgettable Flavors Since 2018
          </h2>
          <p className={`text-sm leading-relaxed ${
            isDark ? 'text-stone-300' : 'text-stone-700'
          }`}>
            Savannah Kitchen was born out of a relentless passion for authentic, wholesome cooking and warm hospitality. What started as an intimate family dining spot has grown into a premier culinary destination celebrated for its rich flavors and vibrant atmosphere.
          </p>
          <p className={`text-sm leading-relaxed ${
            isDark ? 'text-stone-300' : 'text-stone-700'
          }`}>
            Every dish on our menu is a celebration of fresh local produce, imported Italian specialty ingredients, and time-honored cooking traditions. Whether you are joining us for a family dinner or a romantic evening, we welcome you like family.
          </p>
          
          <div className="pt-2">
            <p className="font-script text-2xl text-[#C79A44]">Chef Marcus Vance</p>
            <p className={`text-xs uppercase tracking-widest ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}>
              Head Executive Chef
            </p>
          </div>
        </motion.div>

      </div>

      {/* Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className={`grid grid-cols-2 lg:grid-cols-4 gap-6 border rounded-2xl p-8 text-center transition-colors duration-300 ${
          isDark 
            ? 'bg-[#1a1714] border-white/10' 
            : 'bg-white border-black/10 shadow-md'
        }`}
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#C79A44]/10 border border-[#C79A44]/30 flex items-center justify-center mx-auto text-[#C79A44]">
                <Icon size={20} />
              </div>
              <p className={`font-sans text-2xl font-bold ${
                isDark ? 'text-white' : 'text-[#12100e]'
              }`}>
                {stat.value}
              </p>
              <p className={`text-xs uppercase tracking-wider ${
                isDark ? 'text-stone-400' : 'text-stone-500'
              }`}>
                {stat.label}
              </p>
            </div>
          );
        })}
      </motion.div>

    </div>
  );
}