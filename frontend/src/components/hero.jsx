import React, { useState, useEffect } from 'react';
import { Utensils, Play } from 'lucide-react';
import EatingVideo from '../assets/images/video-1.mp4';

export default function Hero() {
  const slides = [
    {
      type: 'video',
      url: EatingVideo,
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1800&q=80',
    },
    {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1800&q=80',
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically cycle through slides every 7 seconds with a smooth flow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#12100e] text-white">
      {/* Background Media Container with Smooth Cross-fade */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {slide.type === 'video' ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-100 scale-105"
              >
                <source src={slide.url} type="video/mp4" />
              </video>
            ) : (
              <img 
                src={slide.url} 
                alt="Restaurant slide background" 
                className="w-full h-full object-cover opacity-100 scale-105" 
              />
            )}
          </div>
        ))}
        {/* Dark Gradient Overlay for readability (placed above background media with high z-index) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12100e] via-[#12100e]/80 to-transparent z-20 pointer-events-none" />
      </div>
      
      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-20 w-full grid md:grid-cols-2 items-center gap-10 z-30">
        <div>
          <p className="font-script text-[#C79A44] text-3xl md:text-4xl mb-3 tracking-wide drop-shadow-md">
            Welcome to Savannah Kitchen
          </p>
          
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] text-white tracking-wide">
            Great Food<br />
            <span className="text-[#C79A44]">Warm Vibes</span>
          </h1>
          <p className="text-stone-300 mt-6 max-w-md text-base leading-relaxed">
            Experience rich, soulful dishes made with fresh ingredients and a touch of home. Every bite tells a story.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button className="bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-[#b3872f] transition-colors flex items-center gap-2 shadow-lg">
              Explore Menu <Utensils size={15} />
            </button>
            <button className="border border-white/30 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><Play size={12} className="fill-current" /></span> Our Story
            </button>
          </div>
        </div>
      </div>

      {/* Slide Swap Indicators / Pagination Dots */}
      <div className="absolute bottom-6 right-8 z-30 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-500 rounded-full border border-[#C79A44] ${
              currentIndex === index 
                ? 'w-8 h-2.5 bg-[#C79A44]' 
                : 'w-2.5 h-2.5 bg-transparent hover:bg-[#C79A44]/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}