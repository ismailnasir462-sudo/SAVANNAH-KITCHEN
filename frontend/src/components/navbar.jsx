import React from "react";
import { useLocation } from "react-router-dom";
import { ShoppingCart, UtensilsCrossed, Menu as MenuIcon } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "ABOUT US", path: "/about" },
    { label: "MENU", path: "/menu" },
    { label: "RESERVATION", path: "/reservation" },
    { label: "CONTACT US", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#12100e]/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Logo - Standard <a> Tag for full page refresh */}
        <a href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#C79A44]/20 flex items-center justify-center border border-[#C79A44]/40">
            <UtensilsCrossed size={18} className="text-[#C79A44]" />
          </div>
          <div className="leading-tight text-left">
            <p className="font-serif font-bold text-white text-base tracking-widest">SAVANNAH</p>
            <p className="text-[9px] tracking-[0.25em] text-[#C79A44] font-semibold">KITCHEN</p>
          </div>
        </a>

        {/* Desktop Links - Standard <a> Tags for full page refresh */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.path}
              className={`text-xs font-bold tracking-wider transition-colors ${
                location.pathname === item.path ? 'text-[#C79A44]' : 'text-stone-300 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-white/80 transition-colors">
            <ShoppingCart size={18} />
          </button>
          <a href="/menu" className="hidden md:inline-flex items-center gap-1.5 bg-[#C79A44] text-[#12100e] text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-full hover:bg-[#b3872f] transition-colors">
            Order Online
          </a>
          <button className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-white">
            <MenuIcon size={20} />
          </button>
        </div>

      </div>
    </header>
  );
}