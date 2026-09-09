import React from 'react';
import { UtensilsCrossed, ChefHat, HeartHandshake, Award } from 'lucide-react';
import { useTheme } from '../context/themecontext';

export default function Features() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const items = [
    {
      icon: UtensilsCrossed,
      title: "SIGNATURE DISHES",
      desc: "Handcrafted meals inspired by African and global flavors"
    },
    {
      icon: ChefHat,
      title: "MASTER CHEFS",
      desc: "Passionate chefs bringing years of culinary excellence"
    },
    {
      icon: HeartHandshake,
      title: "WARM ATMOSPHERE",
      desc: "A cozy space for family, friends, and celebrations"
    },
    {
      icon: Award,
      title: "EXCEPTIONAL SERVICE",
      desc: "Hospitality that makes you feel at home"
    }
  ];

  return (
    <section className={`py-16 border-t border-b transition-colors duration-300 relative ${
      isDark 
        ? 'bg-[#12100e] text-white border-white/10' 
        : 'bg-[#fcfbf7] text-[#12100e] border-black/10'
    }`}>
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 divide-y sm:divide-y-0 sm:divide-x ${
          isDark ? 'divide-white/10' : 'divide-black/10'
        }`}>
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center pt-6 sm:pt-0 px-4 group">
                <div className={`w-14 h-14 rounded-full border flex items-center justify-center mb-5 transition-colors duration-300 ${
                  isDark 
                    ? 'bg-[#C79A44]/10 border-[#C79A44]/30 text-[#C79A44] group-hover:bg-[#C79A44] group-hover:text-[#12100e]' 
                    : 'bg-[#C79A44]/15 border-[#C79A44]/50 text-[#C79A44] group-hover:bg-[#C79A44] group-hover:text-white'
                }`}>
                  <Icon size={24} />
                </div>
                <h3 className={`font-sans text-sm font-bold tracking-[0.2em] mb-2 ${
                  isDark ? 'text-white' : 'text-[#12100e]'
                }`}>
                  {item.title}
                </h3>
                <p className={`text-xs leading-relaxed max-w-[220px] ${
                  isDark ? 'text-stone-400' : 'text-stone-600'
                }`}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}