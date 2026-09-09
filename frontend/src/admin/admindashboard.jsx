import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Calendar, 
  ShoppingBag, 
  MessageSquare, 
  DollarSign,
  RefreshCw,
  TrendingUp,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  MapPin,
  CreditCard,
  Mail,
  Send,
  X
} from 'lucide-react';
import axios from 'axios';
import { useApp } from '../context/appcontext';
import AdminLogin from './components/adminlogin';
import MenuEditor from './components/menueditor';

export default function AdminDashboard() {
  // --- Independent Local Admin Theme State ---
  const [adminTheme, setAdminTheme] = useState(() => {
    return localStorage.getItem('savannah_admin_theme') || 'dark';
  });
  const isDark = adminTheme === 'dark';

  const toggleAdminTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setAdminTheme(nextTheme);
    localStorage.setItem('savannah_admin_theme', nextTheme);
  };

  const { 
    orders, updateOrderStatus,
    reservations, updateReservationStatus,
    messages, fetchAllData, loading
  } = useApp();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });

  const [activeTab, setActiveTab] = useState('overview');

  // --- In-App Email Reply Modal State ---
  const [replyModal, setReplyModal] = useState({ open: false, msg: null });
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const inactivityTimerRef = useRef(null);
  const INACTIVITY_LIMIT_MS = 15 * 60 * 1000;

  // Sync database when switching to 'orders' or 'overview' tabs
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [activeTab, isAuthenticated]);

  const handleAuthSuccess = (status) => {
    setIsAuthenticated(status);
    if (status) {
      sessionStorage.setItem('admin_authenticated', 'true');
    } else {
      sessionStorage.removeItem('admin_authenticated');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const resetInactivityTimer = () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

      inactivityTimerRef.current = setTimeout(() => {
        alert("Session expired due to 15 minutes of inactivity. Logging out.");
        handleAuthSuccess(false);
      }, INACTIVITY_LIMIT_MS);
    };

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach(event => window.addEventListener(event, resetInactivityTimer));

    resetInactivityTimer();

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
    };
  }, [isAuthenticated]);

  // Handler to send email reply via Express API
  const handleSendReply = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await axios.post('http://localhost:5000/api/contact/reply', {
        to: replyModal.msg.email,
        subject: replyModal.msg.subject,
        message: replyText,
        originalMessage: replyModal.msg.text,
        messageId: replyModal.msg.id
      });

      alert(`Reply sent successfully to ${replyModal.msg.email}!`);
      setReplyModal({ open: false, msg: null });
      setReplyText('');
      fetchAllData(); // Refresh list to reflect updated status
    } catch (error) {
      console.error("Failed to send email:", error);
      alert(error.response?.data?.message || "Failed to send reply. Please check server email configurations.");
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onAuthSuccess={() => handleAuthSuccess(true)} />;
  }

  // --- Analytics Calculations ---
  const totalSales = orders.reduce((sum, order) => sum + (Number(order.total || order.total_amount) || 0), 0);
  const pendingOrders = orders.filter(o => o.status?.toLowerCase() === 'pending').length;
  const preparingOrders = orders.filter(o => o.status?.toLowerCase() === 'preparing').length;
  const completedOrders = orders.filter(o => ['completed', 'delivered'].includes(o.status?.toLowerCase())).length;
  const pendingReservations = reservations.filter(r => r.status?.toLowerCase() === 'pending').length;

  const salesByStatus = [
    { label: 'Completed / Delivered', value: completedOrders, color: '#22c55e' },
    { label: 'Preparing', value: preparingOrders, color: '#3b82f6' },
    { label: 'Pending', value: pendingOrders, color: '#ef4444' }
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${
      isDark ? 'bg-[#12100e] text-white' : 'bg-[#fcfbf7] text-[#12100e]'
    }`}>

      {/* Sidebar */}
      <aside className={`w-full md:w-64 border-r p-6 shrink-0 flex flex-col justify-between ${
        isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10'
      }`}>
        <div>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="font-script text-[#C79A44] text-xl">Savannah Kitchen</p>
              <h2 className="font-sans font-bold text-lg">Admin Portal</h2>
            </div>
            <button 
              onClick={() => handleAuthSuccess(false)}
              className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer text-xs font-bold"
            >
              Exit
            </button>
          </div>

          {/* Manual Database Refresh Button */}
          <button 
            onClick={fetchAllData}
            className="w-full mb-4 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#C79A44]/40 text-[#C79A44] text-xs font-bold hover:bg-[#C79A44]/10 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Sync Database
          </button>

          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'orders', label: 'Live Orders', icon: ShoppingBag, count: pendingOrders },
              { id: 'reservations', label: 'Reservations', icon: Calendar, count: pendingReservations },
              { id: 'messages', label: 'Messages', icon: MessageSquare, count: messages.filter(m => m.status === 'Unread').length },
              { id: 'menu', label: 'Menu Editor', icon: Utensils }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#C79A44] text-[#12100e] shadow-md'
                      : isDark ? 'hover:bg-white/5 text-stone-300' : 'hover:bg-black/5 text-stone-700'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={16} /> {tab.label}
                  </span>
                  {tab.count > 0 && (
                    <span className="bg-red-500 text-white rounded-full text-[10px] px-2 py-0.5 font-bold animate-pulse">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Theme Switcher */}
        <div className="pt-6 border-t border-stone-500/20 mt-6">
          <button
            onClick={toggleAdminTheme}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isDark 
                ? 'bg-[#12100e] border-white/10 text-stone-300 hover:text-white' 
                : 'bg-[#fcfbf7] border-black/10 text-stone-700 hover:text-black'
            }`}
          >
            <span className="flex items-center gap-2">
              {isDark ? <Moon size={16} className="text-[#C79A44]" /> : <Sun size={16} className="text-[#C79A44]" />}
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <span className="text-[10px] uppercase font-semibold text-[#C79A44] px-2 py-0.5 rounded bg-[#C79A44]/10">
              Toggle
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        
        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h1 className="font-serif text-3xl font-bold">Dashboard Overview</h1>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Revenue", val: `₵${totalSales.toFixed(2)}`, icon: DollarSign, color: "text-emerald-500" },
                { title: "Live Food Orders", val: orders.length, icon: ShoppingBag, color: "text-[#C79A44]" },
                { title: "Bookings", val: reservations.length, icon: Calendar, color: "text-blue-500" },
                { title: "Messages", val: messages.length, icon: MessageSquare, color: "text-purple-500" }
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className={`p-6 border rounded-2xl flex items-center justify-between ${
                    isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10 shadow-sm'
                  }`}>
                    <div>
                      <p className="text-xs font-bold text-stone-400 uppercase">{card.title}</p>
                      <p className="font-sans text-3xl font-bold mt-2">{card.val}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-white/5 ${card.color}`}>
                      <Icon size={24} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Visual Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`p-6 border rounded-3xl space-y-4 ${
                isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#C79A44] uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={16} /> Order Status Distribution
                  </h3>
                  <span className="text-xs text-stone-400">{orders.length} Total Orders</span>
                </div>

                <div className="space-y-3 pt-2">
                  {salesByStatus.map((statusItem, idx) => {
                    const percentage = orders.length > 0 ? ((statusItem.value / orders.length) * 100).toFixed(0) : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span>{statusItem.label}</span>
                          <span>{statusItem.value} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-stone-700/20 h-3 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all duration-500 rounded-full"
                            style={{ width: `${percentage}%`, backgroundColor: statusItem.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`p-6 border rounded-3xl space-y-4 ${
                isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10 shadow-sm'
              }`}>
                <h3 className="font-bold text-sm text-[#C79A44] uppercase tracking-wider flex items-center gap-2">
                  <Clock size={16} /> Real-time Restaurant Metrics
                </h3>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className={`p-4 border rounded-2xl space-y-1 ${isDark ? 'bg-[#12100e] border-white/10' : 'bg-[#fcfbf7] border-black/10'}`}>
                    <div className="flex items-center gap-2 text-red-500">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                      </span>
                      <span className="text-xs font-bold uppercase">Action Required</span>
                    </div>
                    <p className="text-2xl font-bold">{pendingOrders}</p>
                    <p className="text-[11px] text-stone-400">Pending Kitchen Orders</p>
                  </div>

                  <div className={`p-4 border rounded-2xl space-y-1 ${isDark ? 'bg-[#12100e] border-white/10' : 'bg-[#fcfbf7] border-black/10'}`}>
                    <div className="flex items-center gap-2 text-blue-500">
                      <UserCheck size={14} />
                      <span className="text-xs font-bold uppercase">Pending Tables</span>
                    </div>
                    <p className="text-2xl font-bold">{pendingReservations}</p>
                    <p className="text-[11px] text-stone-400">Awaiting Booking Confirmation</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- LIVE ORDERS TAB --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-serif text-3xl font-bold">Live Food Orders</h1>
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Live Database Stream
              </span>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No customer orders in database.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map(o => {
                  const customerName = o.customer || o.customer_name || 'Guest';
                  const customerEmail = o.email || o.customer_email || 'No Email';
                  const customerPhone = o.phone || o.customer_phone || '';
                  const totalAmount = Number(o.total || o.total_amount || 0).toFixed(2);
                  const isPending = o.status?.toLowerCase() === 'pending';

                  return (
                    <div 
                      key={o.id} 
                      className={`p-6 border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                        isPending 
                          ? isDark 
                            ? 'bg-red-950/20 border-red-500/40 shadow-lg shadow-red-950/20' 
                            : 'bg-red-50 border-red-300 shadow-md'
                          : isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1.5 max-w-xl">
                        <div className="flex items-center gap-3">
                          {isPending && (
                            <span className="relative flex h-3 w-3" title="New Live Order!">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                            </span>
                          )}
                          <p className="font-bold text-[#C79A44] text-sm">ORD-{o.id} • {customerName}</p>
                        </div>

                        <p className="text-xs text-stone-400">{customerEmail} {customerPhone ? `• ${customerPhone}` : ''}</p>
                        
                        {o.address && (
                          <p className="text-xs text-stone-300 flex items-center gap-1">
                            <MapPin size={12} className="text-[#C79A44] shrink-0" />
                            <span className="truncate">{o.address}</span>
                          </p>
                        )}

                        <p className="text-xs font-semibold mt-1">{o.items}</p>

                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-sm font-bold text-[#C79A44]">₵{totalAmount}</p>

                          {o.payment_method && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#C79A44]/10 text-[#C79A44] px-2.5 py-1 rounded-md border border-[#C79A44]/20 flex items-center gap-1">
                              <CreditCard size={12} />
                              {o.payment_method} {o.payment_reference ? `(${o.payment_reference})` : ''}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {['pending', 'preparing', 'out for delivery', 'delivered'].map(st => {
                          const isActive = o.status?.toLowerCase() === st.toLowerCase();
                          return (
                            <button 
                              key={st} 
                              onClick={() => updateOrderStatus(o.id, st)} 
                              className={`px-3 py-2 rounded-xl text-[10px] font-bold border cursor-pointer transition-all capitalize ${
                                isActive 
                                  ? 'bg-[#C79A44] text-[#12100e] border-[#C79A44] shadow-md scale-105' 
                                  : isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'
                              }`}
                            >
                              {st}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- RESERVATIONS TAB --- */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold">Table Reservations</h1>
            {reservations.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No reservations in database.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reservations.map(r => {
                  const isPending = r.status?.toLowerCase() === 'pending';
                  return (
                    <div 
                      key={r.id} 
                      className={`p-6 border rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
                        isPending 
                          ? isDark 
                            ? 'bg-amber-950/20 border-amber-500/40' 
                            : 'bg-amber-50 border-amber-300 shadow-sm'
                          : isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10 shadow-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {isPending && (
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                            </span>
                          )}
                          <p className="font-bold text-[#C79A44] text-sm">RES-{r.id} • {r.name}</p>
                        </div>
                        <p className="text-xs text-stone-400">{r.email} • {r.phone}</p>
                        <p className="text-xs font-semibold mt-1">{r.guests} Guests • {r.seating || 'Indoor'} Seating</p>
                        <p className="text-xs font-bold text-[#C79A44] mt-0.5">{r.res_date} at {r.res_time}</p>
                        {r.special_request && (
                          <p className="text-[11px] text-stone-400 italic mt-1">Note: "{r.special_request}"</p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map(st => (
                          <button 
                            key={st} 
                            onClick={() => updateReservationStatus(r.id, st)} 
                            className={`px-3 py-2 rounded-xl text-[10px] font-bold border cursor-pointer transition-all ${
                              r.status === st 
                                ? 'bg-[#C79A44] text-[#12100e] border-[#C79A44] shadow-md scale-105' 
                                : isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* --- MESSAGES TAB --- */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold">Customer Messages</h1>
            {messages.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No messages in database.</p>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`p-6 border rounded-2xl space-y-4 ${
                    isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10 shadow-sm'
                  }`}>
                    <div className="flex justify-between items-start border-b pb-3 border-stone-500/20">
                      <div>
                        <h3 className="font-bold text-sm">{msg.name} ({msg.email})</h3>
                        <p className="text-xs text-[#C79A44] mt-0.5">Subject: {msg.subject}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-[#C79A44]/10 text-[#C79A44]">
                          {msg.status || 'Received'}
                        </span>

                        <button
                          onClick={() => setReplyModal({ open: true, msg })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C79A44] text-[#12100e] text-xs font-bold hover:bg-[#b3872f] transition-colors cursor-pointer"
                        >
                          <Mail size={14} /> Reply
                        </button>
                      </div>
                    </div>

                    <p className={`text-xs leading-relaxed ${
                      isDark ? 'text-white' : 'text-[#12100e]'
                    }`}>
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* In-App Email Reply Popup Modal */}
            {replyModal.open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className={`w-full max-w-lg rounded-3xl border p-6 space-y-4 shadow-2xl ${
                  isDark ? 'bg-[#1a1714] border-white/10 text-white' : 'bg-white border-black/10 text-[#12100e]'
                }`}>
                  <div className="flex items-center justify-between border-b pb-3 border-stone-500/20">
                    <h3 className="font-serif font-bold text-lg">Reply to {replyModal.msg?.name}</h3>
                    <button 
                      onClick={() => setReplyModal({ open: false, msg: null })} 
                      className="cursor-pointer text-stone-400 hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSendReply} className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">To</label>
                      <input
                        type="text"
                        disabled
                        value={`${replyModal.msg?.name} <${replyModal.msg?.email}>`}
                        className="w-full border rounded-xl py-2 px-3 text-xs opacity-60 bg-stone-500/10 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Reply Message</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Type your reply here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className={`w-full border rounded-xl p-3 text-xs outline-none focus:border-[#C79A44] ${
                          isDark ? 'bg-[#12100e] border-white/15' : 'bg-[#fcfbf7] border-black/15'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase py-3 rounded-xl hover:bg-[#b3872f] transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send size={14} /> {sending ? 'Sending Email...' : 'Send Reply'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- MENU EDITOR TAB --- */}
        {activeTab === 'menu' && <MenuEditor isDark={isDark} />}
      </main>
    </div>
  );
}