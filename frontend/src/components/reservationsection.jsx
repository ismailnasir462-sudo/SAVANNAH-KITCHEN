import React, { useState, useRef } from 'react';
import { Calendar, Clock, Users, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReservationSection() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState('');
  const [error, setError] = useState('');

  // Refs to programmatically trigger date & time pickers when clicking icons or container
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const peopleSelectRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation Check: Prevent submit if any field is empty
    if (!date || !time || !people) {
      setError('Please select a Date, Time, and Number of People before submitting.');
      return;
    }

    // Clear error on success
    setError('');
    alert(`Reservation requested for ${people} people on ${date} at ${time}.`);
  };

  return (
    <section className="bg-[#5c1c23] text-white py-16 border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="grid lg:grid-cols-12 gap-8 items-center"
        >
          
          {/* Left Text Header */}
          <div className="lg:col-span-5">
            <p className="font-script text-[#C79A44] text-3xl mb-1">Book Your Table</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Make A Reservation
            </h2>
            <p className="text-stone-200 text-xs sm:text-sm mt-2 leading-relaxed max-w-md">
              Book your table in advance and enjoy a hassle-free dining experience at Savannah Kitchen.
            </p>
          </div>

          {/* Right Form Control */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
              
              {/* Date Input Box */}
              <div 
                onClick={() => dateInputRef.current?.showPicker()}
                className={`bg-[#47151a] border rounded-xl p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
                  error && !date ? 'border-[#C79A44]' : 'border-white/15 hover:border-[#C79A44]/50'
                }`}
              >
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">DATE</p>
                  <p className="text-xs font-semibold text-white mt-0.5 truncate">
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

              {/* Time Input Box */}
              <div 
                onClick={() => timeInputRef.current?.showPicker()}
                className={`bg-[#47151a] border rounded-xl p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
                  error && !time ? 'border-[#C79A44]' : 'border-white/15 hover:border-[#C79A44]/50'
                }`}
              >
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">TIME</p>
                  <p className="text-xs font-semibold text-white mt-0.5 truncate">
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

              {/* People Selector Box */}
              <div 
                onClick={() => peopleSelectRef.current?.focus()}
                className={`bg-[#47151a] border rounded-xl p-3.5 flex items-center justify-between text-left cursor-pointer transition-colors ${
                  error && !people ? 'border-[#C79A44]' : 'border-white/15 hover:border-[#C79A44]/50'
                }`}
              >
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">PEOPLE</p>
                  <select 
                    ref={peopleSelectRef}
                    value={people} 
                    onChange={(e) => { setPeople(e.target.value); setError(''); }}
                    className="bg-transparent text-xs font-semibold text-white outline-none w-full cursor-pointer mt-0.5 appearance-none"
                  >
                    <option value="" disabled className="bg-[#12100e] text-stone-400">Select Guests</option>
                    <option value="1" className="bg-[#12100e]">1 Person</option>
                    <option value="2" className="bg-[#12100e]">2 People</option>
                    <option value="4" className="bg-[#12100e]">4 People</option>
                    <option value="6" className="bg-[#12100e]">6+ People</option>
                  </select>
                </div>
                <Users size={18} className="text-[#C79A44] shrink-0 ml-2" />
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                className="bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-xl hover:bg-[#b3872f] transition-colors flex items-center justify-center shadow-lg h-full"
              >
                Find A Table <ArrowRight size={15} />
              </button>

            </form>

            {/* Validation Error Prompt */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-[#C79A44] text-xs font-medium bg-[#47151a] p-2.5 rounded-lg border border-[#C79A44]/40"
              >
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </div>

        </motion.div>
      </div>
    </section>
  );
}