import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, Mail, Phone, ShoppingBag, ArrowLeft, CheckCircle2, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { useTheme } from '../context/themecontext';
import { useApp } from '../context/appcontext';
import InteractiveMap from '../components/interactivemap';

export default function CheckoutPage({ cart = [], onClearCart }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  // Destructure addOrder along with currentUser from useApp
  const { currentUser, addOrder } = useApp() || {};
  const isDark = theme === 'dark';

  // --- Form State ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money'); // 'mobile_money' | 'card' | 'cash'
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Auto-fill User Data If Logged In ---
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || '');
      setLastName(currentUser.last_name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
    }
  }, [currentUser]);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 5.00 : 0.00;
  const grandTotal = subtotal + deliveryFee;

  // --- Paystack Configuration for Mobile Money & Cards ---
  const paystackConfig = {
    reference: `PS_${(new Date()).getTime()}`,
    email: email || "guest@savannahkitchen.com",
    amount: Math.round(grandTotal * 100), // Convert GHS to Pesewas
    currency: 'GHS',
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_b44345f14c8f67d109654f483054778493211bb2',
    channels: paymentMethod === 'mobile_money' ? ['mobile_money'] : ['card', 'bank', 'ussd'],
  };

  const initializePaystack = usePaystackPayment(paystackConfig);

  // Prevent Enter key from submitting form
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  // --- Process Final Order Submission ---
  const processFinalOrder = async (referenceCode = null, gateway = 'CASH') => {
    setIsSubmitting(true);
    const itemSummary = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');

    try {
      // Use AppContext's addOrder method to ensure global state sync
      await addOrder({
        customer: `${firstName} ${lastName}`.trim() || 'Guest Customer',
        email,
        phone,
        address,
        items: itemSummary,
        total: grandTotal.toFixed(2),
        payment_method: `${paymentMethod.toUpperCase()} (${gateway})`,
        payment_reference: referenceCode || 'CASH_ON_DELIVERY'
      });

      alert(`Order successfully placed via ${gateway}!`);
      if (onClearCart) onClearCart();
      navigate('/my-orders'); // Redirect directly to live order tracking
    } catch (error) {
      console.error("Checkout submission failed:", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Form Submit Router ---
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (paymentMethod === 'cash') {
      processFinalOrder(null, 'CASH');
    } else {
      // Trigger Paystack popup for both Mobile Money and Cards
      initializePaystack(
        (response) => {
          processFinalOrder(response.reference, `PAYSTACK_${paymentMethod.toUpperCase()}`);
        },
        () => {
          alert("Paystack payment canceled or closed.");
        }
      );
    }
  };

  return (
    <div className={`min-h-screen py-10 px-4 md:px-8 transition-colors duration-300 ${
      isDark ? 'bg-[#12100e] text-white' : 'bg-[#fcfbf7] text-[#12100e]'
    }`}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-stone-500/20 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C79A44] hover:underline cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Menu
          </button>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-center">Checkout</h1>
          <div className="w-16" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Delivery Details & Interactive Map */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Account Recognition Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              currentUser 
                ? 'bg-[#C79A44]/10 border-[#C79A44]/30 text-[#C79A44]' 
                : isDark ? 'bg-white/5 border-white/10 text-stone-400' : 'bg-black/5 border-black/10 text-stone-600'
            }`}>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 size={16} />
                {currentUser ? `Autofilled details for ${currentUser.first_name}` : 'Checking out as Guest'}
              </div>
            </div>

            {/* Customer Details Form */}
            <form 
              id="checkout-form" 
              onSubmit={handleSubmitOrder} 
              onKeyDown={handleKeyDown} 
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">First Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`w-full border rounded-xl py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#C79A44] ${
                        isDark ? 'bg-[#1a1714] border-white/15 text-white' : 'bg-white border-black/15 text-[#12100e]'
                      }`}
                    />
                    <User size={14} className="absolute left-3 top-3 text-stone-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Last Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`w-full border rounded-xl py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#C79A44] ${
                        isDark ? 'bg-[#1a1714] border-white/15 text-white' : 'bg-white border-black/15 text-[#12100e]'
                      }`}
                    />
                    <User size={14} className="absolute left-3 top-3 text-stone-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#C79A44] ${
                        isDark ? 'bg-[#1a1714] border-white/15 text-white' : 'bg-white border-black/15 text-[#12100e]'
                      }`}
                    />
                    <Mail size={15} className="absolute left-3 top-3 text-stone-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Mobile Money / Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="+233 24 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#C79A44] ${
                        isDark ? 'bg-[#1a1714] border-white/15 text-white' : 'bg-white border-black/15 text-[#12100e]'
                      }`}
                    />
                    <Phone size={15} className="absolute left-3 top-3 text-stone-400" />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Delivery Address</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Search street name, city, landmark or drag map pin..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full border rounded-xl py-3 pl-10 pr-4 text-xs outline-none focus:border-[#C79A44] ${
                      isDark ? 'bg-[#1a1714] border-white/15 text-white' : 'bg-white border-black/15 text-[#12100e]'
                    }`}
                  />
                  <MapPin size={16} className="absolute left-3 top-3.5 text-[#C79A44]" />
                </div>
              </div>
            </form>

            {/* Interactive Map */}
            <div className={`border rounded-2xl p-4 space-y-2 ${
              isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C79A44] uppercase tracking-wider">
                  <MapPin size={14} /> Drag Marker Pin to Choose Location
                </div>
                <span className="text-[10px] text-stone-400 font-semibold">
                  Move pin to update address
                </span>
              </div>

              <InteractiveMap 
                address={address} 
                onAddressChange={(newAddress) => setAddress(newAddress)} 
              />
            </div>

          </div>

          {/* Right Column: Order Summary & Payment Selection */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className={`p-6 border rounded-3xl space-y-6 transition-colors ${
              isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10 shadow-lg'
            }`}>
              <div className="flex items-center gap-2 border-b border-stone-500/20 pb-4">
                <ShoppingBag size={20} className="text-[#C79A44]" />
                <h3 className="font-serif text-lg font-bold">Order Summary</h3>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-xs text-stone-400 text-center py-4">No items in checkout.</p>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="font-bold text-[#C79A44]">{item.quantity}x</span>
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="font-bold shrink-0">₵{(Number(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Totals Breakdown */}
          {/* Totals Breakdown */}
                <div className="border-t border-stone-500/20 pt-4 space-y-2 text-xs">
                <div className={`flex justify-between ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    <span>Subtotal</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-[#12100e]'}`}>
                    ₵{subtotal.toFixed(2)}
                    </span>
                </div>
                <div className={`flex justify-between ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    <span>Delivery Fee</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-[#12100e]'}`}>
                    ₵{deliveryFee.toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-stone-500/20 pt-3">
                    <span>Total Amount</span>
                    <span className="text-[#C79A44] text-lg">GHS {grandTotal.toFixed(2)}</span>
                </div>
                </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="block text-[10px] uppercase font-bold text-stone-400">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`py-3 px-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'mobile_money'
                        ? 'bg-[#C79A44] text-[#12100e] border-[#C79A44]'
                        : isDark ? 'border-white/15 text-stone-300' : 'border-black/15 text-stone-700'
                    }`}
                  >
                    <Smartphone size={16} /> Mobile Money
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 px-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#C79A44] text-[#12100e] border-[#C79A44]'
                        : isDark ? 'border-white/15 text-stone-300' : 'border-black/15 text-stone-700'
                    }`}
                  >
                    <CreditCard size={16} /> Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-3 px-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'bg-[#C79A44] text-[#12100e] border-[#C79A44]'
                        : isDark ? 'border-white/15 text-stone-300' : 'border-black/15 text-stone-700'
                    }`}
                  >
                    <Banknote size={16} /> Cash
                  </button>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting || cart.length === 0}
                className="w-full bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-[#b3872f] transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting
                  ? 'Processing...'
                  : paymentMethod === 'mobile_money'
                  ? 'Pay with Paystack (Mobile Money)'
                  : paymentMethod === 'card'
                  ? 'Pay with Paystack (Card)'
                  : 'Confirm & Place Order'}
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}