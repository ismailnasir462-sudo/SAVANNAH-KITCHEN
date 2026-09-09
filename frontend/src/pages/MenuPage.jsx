import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Search, X, Plus, Minus, Utensils, ShieldCheck, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/themecontext';
import { useApp } from '../context/appcontext';

export default function MenuPage({ onAddToCart }) {
  const { theme } = useTheme();
  const { menuItems, loading, fetchAllData } = useApp();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const categories = ["All", "Pizza", "Burgers", "Pasta", "Salads", "Desserts", "Drinks"];

  // Resolve image source cleanly (supports Base64, public folder URLs, and HTTP URLs)
  const resolveImage = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
    return url;
  };

  // Helper to parse ingredients JSON array
  const parseIngredients = (data) => {
    if (Array.isArray(data)) return data;
    try {
      return JSON.parse(data);
    } catch {
      return ["Fresh Ingredients", "House Special"];
    }
  };

  const filteredItems = (menuItems || []).filter((item) => {
    const matchesCategory = activeTab === "All" || item.category === activeTab;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleAddToCart = (e, item, qty = 1) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(item, qty);
    }
    if (selectedItem) handleCloseModal();
  };

  return (
    <div className={`py-16 px-5 md:px-8 max-w-7xl mx-auto overflow-hidden relative transition-colors duration-300 ${
      isDark ? 'text-white' : 'text-[#12100e]'
    }`}>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <p className="font-script text-[#C79A44] text-3xl mb-1">Culinary Delights</p>
        <h1 className={`font-serif text-4xl sm:text-5xl font-bold ${
          isDark ? 'text-white' : 'text-[#12100e]'
        }`}>
          Our Full Menu
        </h1>
        <div className="w-24 h-0.5 bg-[#C79A44] mx-auto mt-4" />
      </motion.div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer uppercase tracking-wider transition-all ${
                activeTab === cat 
                  ? 'bg-[#C79A44] text-[#12100e] shadow-lg scale-105' 
                  : isDark 
                    ? 'bg-white/5 text-stone-300 hover:bg-white/10' 
                    : 'bg-black/5 text-stone-700 hover:bg-black/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full border rounded-full py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#C79A44] transition-colors ${
              isDark 
                ? 'bg-[#1a1714] border-white/15 text-white placeholder-stone-400' 
                : 'bg-white border-black/15 text-[#12100e] placeholder-stone-400 shadow-sm'
            }`}
          />
          <Search size={15} className={`absolute left-3.5 top-3 ${isDark ? 'text-stone-400' : 'text-stone-500'}`} />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <RefreshCw size={28} className="animate-spin text-[#C79A44] mb-3" />
          <p className="text-xs font-semibold">Loading menu...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 text-stone-400 space-y-3">
          <p className="text-base font-bold">No dishes found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id ? `db-item-${item.id}` : `menu-index-${index}`}
              onClick={() => handleOpenModal(item)}
              className={`border rounded-2xl overflow-hidden group flex flex-col justify-between cursor-pointer ${
                isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10 shadow-md'
              }`}
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img 
                    src={resolveImage(item.image_url)} 
                    alt={item.name} 
                    loading="lazy" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-3 right-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full text-[11px] text-[#C79A44] font-bold flex items-center gap-1">
                    <Star size={12} className="fill-[#C79A44]" /> {item.rating || 4.8}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="font-bold text-[#C79A44] text-lg">₵{Number(item.price).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-stone-400 line-clamp-2">{item.description}</p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button 
                  onClick={(e) => handleAddToCart(e, item, 1)}
                  className="w-full bg-[#C79A44]/10 hover:bg-[#C79A44] text-[#C79A44] hover:text-[#12100e] font-bold text-xs uppercase py-3 rounded-xl transition-colors flex items-center justify-center gap-2 border border-[#C79A44]/30"
                >
                  <ShoppingBag size={14} /> Add To Order
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={handleCloseModal} className="fixed inset-0 bg-black/70 backdrop-blur-md" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative border rounded-3xl max-w-2xl w-full overflow-hidden z-10 p-6 sm:p-8 space-y-6 ${
                isDark ? 'bg-[#1a1714] text-white border-white/10' : 'bg-white text-[#12100e] border-black/10'
              }`}
            >
              <button onClick={handleCloseModal} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 cursor-pointer">
                <X size={18} />
              </button>

              <div className="h-64 rounded-2xl overflow-hidden relative">
                <img src={resolveImage(selectedItem.image_url)} alt={selectedItem.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
                  <span className="text-2xl font-bold text-[#C79A44]">₵{(Number(selectedItem.price) * quantity).toFixed(2)}</span>
                </div>
                <p className="text-xs text-stone-400 mt-2">{selectedItem.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 border rounded-xl p-1.5">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 font-bold"><Minus size={14} /></button>
                  <span className="font-bold text-sm">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 font-bold"><Plus size={14} /></button>
                </div>
                <button 
                  onClick={(e) => handleAddToCart(e, selectedItem, quantity)}
                  className="flex-1 bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase py-3.5 rounded-xl hover:bg-[#b3872f] transition-colors"
                >
                  Add {quantity} To Order • ${(Number(selectedItem.price) * quantity).toFixed(2)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}