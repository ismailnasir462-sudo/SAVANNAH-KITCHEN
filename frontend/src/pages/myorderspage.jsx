import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, ChefHat, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/themecontext';
import { useApp } from '../context/appcontext';

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser, orders, loading } = useApp() || {};
  const isDark = theme === 'dark';

  // Filter orders by matching either user_id OR email
  const userOrders = (orders || []).filter(order => {
    if (!currentUser) return false;

    const matchesUserId = order.user_id && Number(order.user_id) === Number(currentUser.id);
    const matchesEmail = order.email && currentUser.email && 
      order.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim();

    return matchesUserId || matchesEmail;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'preparing':
        return (
          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
            <ChefHat size={12}/> Preparing
          </span>
        );
      case 'out for delivery':
        return (
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
            <Truck size={12}/> Out For Delivery
          </span>
        );
      case 'delivered':
      case 'completed':
        return (
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
            <CheckCircle2 size={12}/> Delivered
          </span>
        );
      default:
        return (
          <span className="bg-stone-500/10 text-stone-400 border border-stone-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
            <Clock size={12}/> Pending
          </span>
        );
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <p className="text-sm text-stone-400 mb-4">Please sign in to view your order history and live tracking status.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-[#C79A44] text-[#12100e] text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-10 px-4 md:px-8 transition-colors duration-300 ${
      isDark ? 'bg-[#12100e] text-white' : 'bg-[#fcfbf7] text-[#12100e]'
    }`}>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-stone-500/20 pb-4">
          <button 
            onClick={() => navigate('/menu')} 
            className="flex items-center gap-2 text-xs font-bold uppercase text-[#C79A44] hover:underline cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Menu
          </button>
          <h1 className="font-serif text-2xl font-bold">My Orders</h1>
          <div className="w-16" />
        </div>

        {loading ? (
          <p className="text-center text-xs text-stone-400 py-10">Loading your orders...</p>
        ) : userOrders.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Package size={48} className="mx-auto text-stone-500" />
            <p className="text-sm font-bold">No orders placed yet for account: {currentUser.email}</p>
            <button 
              onClick={() => navigate('/menu')} 
              className="bg-[#C79A44] text-[#12100e] text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
            >
              Order Delicious Meals Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => (
              <div 
                key={order.id} 
                className={`border rounded-2xl p-5 space-y-4 transition-colors ${
                  isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10 shadow-md'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-500/10 pb-3">
                <div>
                    <span className="text-xs font-bold text-[#C79A44]">Order #{order.id}</span>
                    <p className={`text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {order.created_at ? new Date(order.created_at).toLocaleString() : 'Recently Placed'}
                    </p>
                </div>
                {getStatusBadge(order.status)}
                </div>

                {/* Items Summary */}
                <div className="text-xs space-y-1">
                <p className={`font-bold ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    Items Ordered:
                </p>
                <p className={isDark ? 'text-stone-400' : 'text-stone-600'}>
                    {order.items}
                </p>
                </div>

                

                {/* Footer Details */}
                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-stone-500/10 text-xs font-bold gap-2">
                <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>
                    Payment: <span className={isDark ? 'text-stone-200' : 'text-stone-900'}>{order.payment_method || 'CASH'}</span>
                </span>
                <span className="text-[#C79A44] text-sm">
                    Total: GHS {Number(order.total || order.total_amount || 0).toFixed(2)}
                </span>
                </div>
                </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}