import React from 'react';
import { UtensilsCrossed, MapPin, Phone, Mail, Send } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagramSquare, FaYoutube,} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#0c0a09] text-stone-400 pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#C79A44]/20 flex items-center justify-center border border-[#C79A44]/40">
                <UtensilsCrossed size={18} className="text-[#C79A44]" />
              </div>
              <div className="leading-tight text-left">
                <p className="font-serif font-bold text-white text-base tracking-widest">SAVANNAH</p>
                <p className="text-[9px] tracking-[0.25em] text-[#C79A44] font-semibold">KITCHEN</p>
              </div>
            </div>
            
            <p className="text-xs font-sans leading-relaxed">
              Good food, good mood. Join us for an unforgettable dining experience.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[FaFacebookF, FaInstagramSquare, FaTwitter, FaYoutube].map((Icon, idx) => (
                <a key={idx} href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#C79A44] hover:text-[#12100e] hover:border-[#C79A44] transition-all">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-sans  text-sm font-bold tracking-[0.15em] text-white uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {['Home', 'About Us', 'Menu', 'Reservation', 'Contact Us'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-[#C79A44] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Menu */}
          <div className="space-y-3">
            <h4 className="font-sans  text-sm font-bold tracking-[0.15em] text-white uppercase">
              Our Menu
            </h4>
            <ul className="space-y-2 text-xs">
              {['Pizza', 'Burgers', 'Pasta', 'Salads', 'Desserts', 'Drinks'].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-[#C79A44] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="space-y-3">
            <h4 className="font-sans  text-sm font-bold tracking-[0.15em] text-white uppercase">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#C79A44] shrink-0 mt-0.5" />
                <span>12 Cantonments Road, Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#C79A44] shrink-0" />
                <span>+233 24 000 0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#C79A44] shrink-0" />
                <span>hello@savannahkitchen.com</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-sans  text-sm font-bold tracking-[0.15em] text-white uppercase">
              Newsletter
            </h4>
            <p className="text-xs text-stone-400">
              Subscribe to get the latest updates and offers from Savannah Kitchen.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex items-center bg-[#1a1714] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#C79A44] transition-colors">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent text-xs text-white px-3.5 py-3 outline-none w-full"
              />
              <button type="submit" className="bg-[#C79A44] text-[#12100e] px-4 py-3 hover:bg-[#b3872f] transition-colors shrink-0">
                <Send size={15} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© 2026 Savannah Kitchen. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Terms & Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
}