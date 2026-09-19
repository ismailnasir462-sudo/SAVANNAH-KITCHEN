import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Utensils, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/themecontext';
import { useApp } from '../context/appcontext';

export default function ReservationPage() {
  const { theme } = useTheme();
  const { addReservation } = useApp();
  const isDark = theme === 'dark';
  const location = useLocation();

  // Initial State initialized from ReservationSection navigation state if present
  const initialData = location.state || {};

  const [date, setDate] = useState(initialData.date || '');
  const [time, setTime] = useState(initialData.time || '');
  const [people, setPeople] = useState(initialData.people || '');
  const [seating, setSeating] = useState('Indoor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  // Sync state if user navigates back and forth or passes state via router
  useEffect(() => {
    if (location.state) {
      if (location.state.date) setDate(location.state.date);
      if (location.state.time) setTime(location.state.time);
      if (location.state.people) setPeople(location.state.people);
    }
  }, [location.state]);

  const validateEmail = (emailStr) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  const validatePhone = (phoneStr) => /^(\+233\d{9}|0\d{9})$/.test(phoneStr.trim());

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !date || !time || !people) {
      setError('Please fill out all required fields.');
      return;
    }

    if (!validatePhone(phone)) {
      setError('Invalid phone number. Use +233 followed by 9 digits or 10 digits starting with 0.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    // Send reservation to Admin context & backend (includes MySQL field mappings)
    addReservation({
      name,
      email,
      phone,
      guests: people,
      date,
      res_date: date,
      time,
      res_time: time,
      seating,
      specialRequest,
      special_request: specialRequest
    });

    setError('');
    setIsSubmitted(true);
  };

  return (
    <div className={`py-16 px-5 md:px-8 max-w-7xl mx-auto transition-colors duration-300 ${
      isDark ? 'text-white' : 'text-[#12100e]'
    }`}>
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80" 
          alt="Restaurant Atmosphere" 
          className={`w-full h-full object-cover scale-195 filter blur-[3px] transition-opacity duration-300 ${
            isDark ? 'opacity-40' : 'opacity-90'
          }`}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-script text-[#C79A44] text-3xl mb-1">Reserve Your Experience</p>
          <h1 className={`font-serif text-4xl sm:text-5xl font-bold ${
            isDark ? 'text-white' : 'text-[#12100e]'
          }`}>
            Book A Table
          </h1>
          <div className="w-24 h-0.5 bg-[#C79A44] mx-auto mt-4" />
        </motion.div>

        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`border rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl transition-colors duration-300 ${
              isDark 
                ? 'bg-[#1a1714] border-[#C79A44]/40 text-white' 
                : 'bg-white border-[#C79A44]/50 text-[#12100e]'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-[#C79A44]/20 border border-[#C79A44] flex items-center justify-center mx-auto text-[#C79A44] mb-6">
              <CheckCircle2 size={36} />
            </div>
            <h2 className={`font-serif text-2xl sm:text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-[#12100e]'
            }`}>
              Reservation Confirmed!
            </h2>
            <p className={`text-sm mb-6 leading-relaxed ${
              isDark ? 'text-stone-300' : 'text-stone-700'
            }`}>
              Thank you, <span className="text-[#C79A44] font-bold">{name}</span>. We have reserved a table for <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#12100e]'}`}>{people}</span> ({seating} Seating) on <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#12100e]'}`}>{date}</span> at <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#12100e]'}`}>{time}</span>.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-full hover:bg-[#b3872f] transition-colors cursor-pointer shadow-md"
            >
              Make Another Booking
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={`border rounded-3xl p-6 sm:p-10 shadow-2xl transition-colors duration-300 ${
              isDark 
                ? 'bg-[#1a1714] border-white/10' 
                : 'bg-white border-black/10'
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Contact Details */}
              <div>
                <h3 className={`font-sans text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2 ${
                  isDark ? 'text-white border-white/10' : 'text-[#12100e] border-black/10'
                }`}>
                  <span className="text-[#C79A44]">1.</span> Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-[11px] uppercase tracking-wider font-bold mb-1.5 ${
                      isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}>
                      Full Name *
                    </label>
                    <input 
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(''); }}
                      className={`w-full border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C79A44] transition-colors ${
                        isDark 
                          ? 'bg-[#12100e] border-white/15 text-white placeholder-stone-500' 
                          : 'bg-[#fcfbf7] border-black/15 text-[#12100e] placeholder-stone-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] uppercase tracking-wider font-bold mb-1.5 ${
                      isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}>
                      Email Address *
                    </label>
                    <input 
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      className={`w-full border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C79A44] transition-colors ${
                        isDark 
                          ? 'bg-[#12100e] border-white/15 text-white placeholder-stone-500' 
                          : 'bg-[#fcfbf7] border-black/15 text-[#12100e] placeholder-stone-400'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-[11px] uppercase tracking-wider font-bold mb-1.5 ${
                      isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}>
                      Phone Number *
                    </label>
                    <input 
                      type="tel"
                      placeholder="0241234567 or +233241234567"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setError(''); }}
                      className={`w-full border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C79A44] transition-colors ${
                        isDark 
                          ? 'bg-[#12100e] border-white/15 text-white placeholder-stone-500' 
                          : 'bg-[#fcfbf7] border-black/15 text-[#12100e] placeholder-stone-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Date & Guest Count */}
              <div>
                <h3 className={`font-sans text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2 ${
                  isDark ? 'text-white border-white/10' : 'text-[#12100e] border-black/10'
                }`}>
                  <span className="text-[#C79A44]">2.</span> Date & Guest Count
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div 
                    onClick={() => dateInputRef.current?.showPicker()}
                    className={`border rounded-xl p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
                      isDark ? 'bg-[#12100e]' : 'bg-[#fcfbf7]'
                    } ${
                      error && !date 
                        ? 'border-[#C79A44]' 
                        : isDark ? 'border-white/15 hover:border-[#C79A44]/50' : 'border-black/15 hover:border-[#C79A44]/50'
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`text-[10px] uppercase tracking-widest font-bold ${
                        isDark ? 'text-stone-400' : 'text-stone-500'
                      }`}>
                        DATE *
                      </p>
                      <p className={`text-xs font-semibold mt-0.5 truncate ${
                        isDark ? 'text-white' : 'text-[#12100e]'
                      }`}>
                        {date ? date : <span className="text-stone-400 font-normal">Select Date</span>}
                      </p>
                      <input 
                        ref={dateInputRef}
                        type="date" 
                        value={date} 
                        onChange={(e) => { setDate(e.target.value); setError(''); }}
                        className="sr-only" 
                      />
                    </div>
                    <Calendar size={18} className="text-[#C79A44] shrink-0 ml-2" />
                  </div>

                  <div 
                    onClick={() => timeInputRef.current?.showPicker()}
                    className={`border rounded-xl p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
                      isDark ? 'bg-[#12100e]' : 'bg-[#fcfbf7]'
                    } ${
                      error && !time 
                        ? 'border-[#C79A44]' 
                        : isDark ? 'border-white/15 hover:border-[#C79A44]/50' : 'border-black/15 hover:border-[#C79A44]/50'
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`text-[10px] uppercase tracking-widest font-bold ${
                        isDark ? 'text-stone-400' : 'text-stone-500'
                      }`}>
                        TIME *
                      </p>
                      <p className={`text-xs font-semibold mt-0.5 truncate ${
                        isDark ? 'text-white' : 'text-[#12100e]'
                      }`}>
                        {time ? time : <span className="text-stone-400 font-normal">Select Time</span>}
                      </p>
                      <input 
                        ref={timeInputRef}
                        type="time" 
                        value={time} 
                        onChange={(e) => { setTime(e.target.value); setError(''); }}
                        className="sr-only" 
                      />
                    </div>
                    <Clock size={18} className="text-[#C79A44] shrink-0 ml-2" />
                  </div>

                  <div 
                    className={`border rounded-xl p-3.5 flex items-center justify-between text-left transition-colors ${
                      isDark ? 'bg-[#12100e]' : 'bg-[#fcfbf7]'
                    } ${
                      error && !people 
                        ? 'border-[#C79A44]' 
                        : isDark ? 'border-white/15 hover:border-[#C79A44]/50' : 'border-black/15 hover:border-[#C79A44]/50'
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`text-[10px] uppercase tracking-widest font-bold ${
                        isDark ? 'text-stone-400' : 'text-stone-500'
                      }`}>
                        GUESTS *
                      </p>
                      <select 
                        value={people} 
                        onChange={(e) => { setPeople(e.target.value); setError(''); }}
                        className={`bg-transparent text-xs font-semibold outline-none w-full cursor-pointer mt-0.5 appearance-none ${
                          isDark ? 'text-white' : 'text-[#12100e]'
                        }`}
                      >
                        <option value="" disabled className={isDark ? 'bg-[#12100e] text-stone-500' : 'bg-white text-stone-400'}>
                          Select Guests
                        </option>
                        <option value="1 Person" className={isDark ? 'bg-[#12100e]' : 'bg-white'}>1 Person</option>
                        <option value="2 People" className={isDark ? 'bg-[#12100e]' : 'bg-white'}>2 People</option>
                        <option value="4 People" className={isDark ? 'bg-[#12100e]' : 'bg-white'}>4 People</option>
                        <option value="6 People" className={isDark ? 'bg-[#12100e]' : 'bg-white'}>6 People</option>
                        <option value="8+ Large Party" className={isDark ? 'bg-[#12100e]' : 'bg-white'}>8+ Large Party</option>
                      </select>
                    </div>
                    <Users size={18} className="text-[#C79A44] shrink-0 ml-2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Step 3: Preferences */}
              <div>
                <h3 className={`font-sans text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2 ${
                  isDark ? 'text-white border-white/10' : 'text-[#12100e] border-black/10'
                }`}>
                  <span className="text-[#C79A44]">3.</span> Preferences
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-[11px] uppercase tracking-wider font-bold mb-2 ${
                      isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}>
                      Seating Preference
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Indoor', 'Outdoor Terrace', 'Private Dining'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSeating(option)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            seating === option
                              ? 'bg-[#C79A44] text-[#12100e] border-[#C79A44] shadow-md'
                              : isDark 
                                ? 'bg-[#12100e] text-stone-300 border-white/15 hover:border-white/30' 
                                : 'bg-[#fcfbf7] text-stone-700 border-black/15 hover:border-black/30'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11px] uppercase tracking-wider font-bold mb-1.5 ${
                      isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}>
                      Special Requests (Optional)
                    </label>
                    <textarea 
                      rows="3"
                      placeholder="Dietary requirements, birthday setup, anniversary preferences..."
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C79A44] transition-colors ${
                        isDark 
                          ? 'bg-[#12100e] border-white/15 text-white placeholder-stone-500' 
                          : 'bg-[#fcfbf7] border-black/15 text-[#12100e] placeholder-stone-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-[#C79A44] text-xs font-medium bg-[#47151a] p-3 rounded-xl border border-[#C79A44]/40"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <button 
                type="submit"
                className="w-full bg-[#C79A44] text-[#12100e] font-bold cursor-pointer text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-[#b3872f] transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <Utensils size={16} /> Complete Reservation
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}