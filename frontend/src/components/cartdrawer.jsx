import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/themecontext';
import { useApp } from '../context/appcontext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const { theme } = useTheme();
  const { currentUser, addOrder } = useApp() || {};
  const isDark = theme === 'dark';
  const navigate = useNavigate();


  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 5.00 : 0.00;
  const grandTotal = subtotal + deliveryFee;

  // Resolve image source cleanly (supports Base64, public folder URLs, or fallback img)
  const resolveImage = (item) => {
    return item.image_url || item.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
  };

  // Checkout action that sends order to Admin Dashboard using active user credentials
  const handleProceedToCheckout = async () => {
    if (cart.length === 0) return;
    navigate('/checkout');
    onClose();

    
    // Account-specific details fallback logic
    const customerName = currentUser?.first_name 
      ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() 
      : "Guest Customer";
      
    const customerEmail = currentUser?.email || "guest@example.com";

    try {
      await addOrder({
        customer: customerName,
        email: customerEmail,
        items: itemSummary,
        total: grandTotal.toFixed(2)
      });

      //alert("Order successfully placed and sent to Admin Dashboard!");
     // if (onClearCart) onClearCart();
    //  onClose();
    } catch (error) {
      console.error("Checkout Error:", error);
     // alert("Failed to submit order. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`w-screen max-w-md border-l shadow-2xl flex flex-col justify-between transition-colors duration-300 ${
                isDark 
                  ? 'bg-[#1a1714] border-white/10 text-white' 
                  : 'bg-[#fcfbf7] border-black/10 text-[#12100e]'
              }`}
            >
              <div className={`p-6 border-b flex items-center justify-between ${
                isDark ? 'border-white/10' : 'border-black/10'
              }`}>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#C79A44]" />
                  <h2 className={`font-sans text-xl font-bold ${isDark ? 'text-white' : 'text-[#12100e]'}`}>
                    Your Order Cart
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    isDark 
                      ? 'bg-white/5 hover:bg-[#C79A44] hover:text-[#12100e] text-stone-300' 
                      : 'bg-black/5 hover:bg-[#C79A44] hover:text-[#12100e] text-stone-700'
                  }`}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-white/5 text-stone-500' : 'bg-black/5 text-stone-400'
                    }`}>
                      <ShoppingBag size={32} />
                    </div>
                    <p className={`font-sans text-lg font-bold ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                      Your Cart is Empty
                    </p>
                    <p className={`text-xs max-w-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      Looks like you haven't added any culinary delights to your cart yet.
                    </p>
                    <a
                      href="/menu"
                      onClick={onClose}
                      className="mt-4 inline-block bg-[#C79A44] text-[#12100e] text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-full hover:bg-[#b3872f] transition-colors"
                    >
                      Browse Menu
                    </a>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div
                      key={item.id ? `cart-item-${item.id}` : `cart-idx-${index}`}
                      className={`border rounded-2xl p-4 flex gap-4 items-center justify-between transition-colors ${
                        isDark 
                          ? 'bg-[#12100e] border-white/10' 
                          : 'bg-white border-black/10 shadow-sm'
                      }`}
                    >
                      <img
                        src={resolveImage(item)}
                        alt={item.name}
                        className={`w-16 h-16 rounded-xl object-cover shrink-0 border ${
                          isDark ? 'border-white/10' : 'border-black/10'
                        }`}
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className={`font-sans font-bold text-sm truncate ${isDark ? 'text-white' : 'text-[#12100e]'}`}>
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#C79A44] font-bold mt-0.5">₵{Number(item.price).toFixed(2)} each</p>

                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer transition-colors ${
                              isDark 
                                ? 'bg-white/10 hover:bg-white/20 text-white' 
                                : 'bg-black/5 hover:bg-black/10 text-[#12100e]'
                            }`}
                          >
                            <Minus size={12} />
                          </button>
                          <span className={`text-xs font-bold px-1 ${isDark ? 'text-white' : 'text-[#12100e]'}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className={`w-6 h-6 rounded flex items-center justify-center text-xs cursor-pointer transition-colors ${
                              isDark 
                                ? 'bg-white/10 hover:bg-white/20 text-white' 
                                : 'bg-black/5 hover:bg-black/10 text-[#12100e]'
                            }`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between self-stretch">
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className={`cursor-pointer transition-colors p-1 ${
                            isDark ? 'text-stone-500 hover:text-red-400' : 'text-stone-400 hover:text-red-600'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                        <p className={`font-sans font-bold text-sm ${isDark ? 'text-white' : 'text-[#12100e]'}`}>
                          ₵{(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className={`p-6 border-t space-y-4 transition-colors ${
                  isDark ? 'border-white/10 bg-[#12100e]' : 'border-black/10 bg-white'
                }`}>
                  <div className="space-y-2 text-xs">
                    <div className={`flex justify-between ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      <span>Subtotal</span>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#12100e]'}`}>
                        ₵{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className={`flex justify-between ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                      <span>Estimated Delivery Fee</span>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#12100e]'}`}>
                        ₵{deliveryFee.toFixed(2)}
                      </span>
                    </div>
                    <div className={`flex justify-between text-sm font-sans font-bold pt-2 border-t ${
                      isDark ? 'text-white border-white/10' : 'text-[#12100e] border-black/10'
                    }`}>
                      <span>Grand Total</span>
                      <span className="text-[#C79A44] text-lg">₵{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase cursor-pointer tracking-widest py-4 rounded-xl hover:bg-[#b3872f] transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}