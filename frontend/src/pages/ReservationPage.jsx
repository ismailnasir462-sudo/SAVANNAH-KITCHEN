import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Utensils, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ReservationPage() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState('');
  const [seating, setSeating] = useState('Indoor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Native input refs
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  // Validation Helpers
  const validateEmail = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr.trim());
  };

  const validatePhone = (phoneStr) => {
    // Matches +233 followed by 9 digits OR 0 followed by 9 digits (total 10 digits)
    const phoneRegex = /^(\+233\d{9}|0\d{9})$/;
    return phoneRegex.test(phoneStr.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Check for empty required fields
    if (!name.trim() || !email.trim() || !phone.trim() || !date || !time || !people) {
      setError('Please fill out all required fields.');
      return;
    }

    // 2. Validate Phone Number
    if (!validatePhone(phone)) {
      setError('Invalid phone number. Use +233 followed by 9 digits (e.g. +233241234567) or 10 digits starting with 0 (e.g. 0241234567).');
      return;
    }

    // 3. Validate Email Address
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address (e.g. example@domain.com).');
      return;
    }

    setError('');
    setIsSubmitted(true);
  };

  return (
    <div className="py-16 px-5 md:px-8 max-w-5xl mx-auto ">
         <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80" 
          alt="Restaurant Atmosphere" 
          className="w-full h-full object-cover scale-196 filter blur-l opacity-50"
        />
        <div className="absolute -inset-90 bg-gradient-to-b from-[#12100e]/70 via-[#12100e]/50 to-[#12100e]/80" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <p className="font-script text-[#C79A44] text-3xl mb-1">Reserve Your Experience</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">Book A Table</h1>
        <div className="w-24 h-0.5 bg-[#C79A44] mx-auto mt-4" />
      </motion.div>

      {isSubmitted ? (
        /* Success Screen */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1a1714] border border-[#C79A44]/40 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-[#C79A44]/20 border border-[#C79A44] flex items-center justify-center mx-auto text-[#C79A44] mb-6">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">Reservation Confirmed!</h2>
          <p className="text-stone-300 text-sm mb-6 leading-relaxed">
            Thank you, <span className="text-[#C79A44] font-bold">{name}</span>. We have reserved a table for <span className="text-white font-semibold">{people}</span> ({seating} Seating) on <span className="text-white font-semibold">{date}</span> at <span className="text-white font-semibold">{time}</span>.
          </p>
          <p className="text-stone-400 text-xs mb-8">
            A confirmation summary has been sent to <span className="text-stone-200">{email}</span>.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-full hover:bg-[#b3872f] transition-colors"
          >
            Make Another Booking
          </button>
        </motion.div>
      ) : (
        /* Reservation Form Card */
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-[#1a1714] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Step 1: Personal Details */}
            <div>
              <h3 className="font-sans text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-[#C79A44]">1.</span> Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-1.5">Full Name *</label>
                  <input 
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(''); }}
                    className="w-full bg-[#12100e] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-500 outline-none focus:border-[#C79A44]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-1.5">Email Address *</label>
                  <input 
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="w-full bg-[#12100e] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-500 outline-none focus:border-[#C79A44]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-1.5">Phone Number *</label>
                  <input 
                    type="tel"
                    placeholder="0241234567 or +233241234567"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setError(''); }}
                    className="w-full bg-[#12100e] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-500 outline-none focus:border-[#C79A44]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Date, Time & Guests */}
            <div>
              <h3 className="font-sans text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-[#C79A44]">2.</span> Date & Guest Count
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Date Picker Card */}
                <div 
                  onClick={() => dateInputRef.current?.showPicker()}
                  className={`bg-[#12100e] border rounded-xl p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
                    error && !date ? 'border-[#C79A44]' : 'border-white/15 hover:border-[#C79A44]/50'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">DATE *</p>
                    <p className="text-xs font-semibold text-white mt-0.5 truncate">
                      {date ? date : <span className="text-stone-500 font-normal">Select Date</span>}
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

                {/* Time Picker Card */}
                <div 
                  onClick={() => timeInputRef.current?.showPicker()}
                  className={`bg-[#12100e] border rounded-xl p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
                    error && !time ? 'border-[#C79A44]' : 'border-white/15 hover:border-[#C79A44]/50'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">TIME *</p>
                    <p className="text-xs font-semibold text-white mt-0.5 truncate">
                      {time ? time : <span className="text-stone-500 font-normal">Select Time</span>}
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

                {/* Guests Picker Card */}
                <div 
                  className={`bg-[#12100e] border rounded-xl p-3.5 flex items-center justify-between text-left transition-colors ${
                    error && !people ? 'border-[#C79A44]' : 'border-white/15 hover:border-[#C79A44]/50'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">GUESTS *</p>
                    <select 
                      value={people} 
                      onChange={(e) => { setPeople(e.target.value); setError(''); }}
                      className="bg-transparent text-xs font-semibold text-white outline-none w-full cursor-pointer mt-0.5 appearance-none"
                    >
                      <option value="" disabled className="bg-[#12100e] text-stone-500">Select Guests</option>
                      <option value="1 Person" className="bg-[#12100e]">1 Person</option>
                      <option value="2 People" className="bg-[#12100e]">2 People</option>
                      <option value="4 People" className="bg-[#12100e]">4 People</option>
                      <option value="6 People" className="bg-[#12100e]">6 People</option>
                      <option value="8+ Large Party" className="bg-[#12100e]">8+ Large Party</option>
                    </select>
                  </div>
                  <Users size={18} className="text-[#C79A44] shrink-0 ml-2 pointer-events-none" />
                </div>

              </div>
            </div>

            {/* Step 3: Seating Preference & Special Requests */}
            <div>
              <h3 className="font-sans text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <span className="text-[#C79A44]">3.</span> Preferences
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-2">Seating Preference</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Indoor', 'Outdoor Terrace', 'Private Dining'].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSeating(option)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                          seating === option
                            ? 'bg-[#C79A44] text-[#12100e] border-[#C79A44]'
                            : 'bg-[#12100e] text-stone-300 cursor-pointer border-white/15 hover:border-white/30'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-1.5">Special Requests (Optional)</label>
                  <textarea 
                    rows="3"
                    placeholder="Dietary requirements, birthday setup, anniversary preferences..."
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    className="w-full bg-[#12100e] border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-stone-500 outline-none focus:border-[#C79A44]"
                  />
                </div>
              </div>
            </div>

            {/* Error Banner */}
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

            {/* Submit Button */}
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