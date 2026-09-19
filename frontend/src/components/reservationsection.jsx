import React, { useState, useRef } from 'react';
import { Calendar, Clock, Users, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ReservationSection() {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [people, setPeople] = useState('');
  const [error, setError] = useState('');

  // Refs to programmatically trigger date & time pickers
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const peopleSelectRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation Check: Prevent redirect if any field is missing
    if (!date || !time || !people) {
      setError('Please select a Date, Time, and Number of People before submitting.');
      return;
    }

    setError('');

    // Format people label properly for ReservationPage.jsx
    const formattedPeople = people.includes('Person') || people.includes('People') 
      ? people 
      : `${people} ${people === '1' ? 'Person' : 'People'}`;

    // Navigate directly to /reservation with pre-filled state
    navigate('/reservation', {
      state: {
        date,
        time,
        people: formattedPeople
      }
    });
  };

  return (
    <section className="bg-[#5c1c23] text-white py-12 sm:py-16 border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-12 gap-8 items-center"
        >
          
          {/* Left Text Header */}
          <div className="lg:col-span-4 text-center lg:text-left">
            <p className="font-script text-[#C79A44] text-2xl sm:text-3xl mb-1">Book Your Table</p>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-wide">
              Make A Reservation
            </h2>
            <p className="text-stone-200 text-xs sm:text-sm mt-2 leading-relaxed max-w-md mx-auto lg:mx-0">
              Book your table in advance and enjoy a hassle-free dining experience at Savannah Kitchen.
            </p>
          </div>

          {/* Right Form Control & Error Area */}
          <div className="lg:col-span-8 flex flex-col gap-3 w-full">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-stretch w-full">
              
              {/* Date Input Box */}
              <div 
                onClick={() => dateInputRef.current?.showPicker()}
                className={`bg-[#47151a] border rounded-xl px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer transition-colors h-12 w-full ${
                  error && !date ? 'border-[#C79A44]' : 'border-white/15 hover:border-[#C79A44]/50'
                }`}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-400 font-bold leading-none">DATE</p>
                  <p className="text-xs font-semibold text-white mt-1 truncate leading-none">
                    {date ? date : <span className="text-stone-400 font-normal">Select Date</span>}
                  </p>
                  <input 
                    ref={dateInputRef}
                    type="date" 
                    value={date} 
                    onChange={(e) => { setDate(e.target.value); setError(''); }}
                    style={{ colorScheme: 'dark' }}
                    className="sr-only" 
                  />
                </div>
                <Calendar size={18} className="text-[#C79A44] shrink-0" />
              </div>

              {/* Time Input Box */}
              <div 
                onClick={() => timeInputRef.current?.showPicker()}
                className={`bg-[#47151a] border rounded-xl px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer transition-colors h-12 w-full ${
                  error && !time ? 'border-[#C79A44]' : 'border-white/15 hover:border-[#C79A44]/50'
                }`}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-400 font-bold leading-none">TIME</p>
                  <p className="text-xs font-semibold text-white mt-1 truncate leading-none">
                    {time ? time : <span className="text-stone-400 font-normal">Select Time</span>}
                  </p>
                  <input 
                    ref={timeInputRef}
                    type="time" 
                    value={time} 
                    onChange={(e) => { setTime(e.target.value); setError(''); }}
                    style={{ colorScheme: 'dark' }}
                    className="sr-only" 
                  />
                </div>
                <Clock size={18} className="text-[#C79A44] shrink-0" />
              </div>

              {/* People Selector Box */}
              <div 
                onClick={() => peopleSelectRef.current?.focus()}
                className={`bg-[#47151a] border rounded-xl px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer transition-colors h-12 w-full ${
                  error && !people ? 'border-[#C79A44]' : 'border-white/15 hover:border-[#C79A44]/50'
                }`}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-400 font-bold leading-none">PEOPLE</p>
                  <select 
                    ref={peopleSelectRef}
                    value={people} 
                    onChange={(e) => { setPeople(e.target.value); setError(''); }}
                    className="bg-transparent text-xs font-semibold text-white outline-none w-full cursor-pointer mt-0.5 p-0 border-none leading-none appearance-none"
                  >
                    <option value="" disabled className="bg-[#12100e] text-stone-400">Select Guests</option>
                    <option value="1 Person" className="bg-[#12100e] text-white">1 Person</option>
                    <option value="2 People" className="bg-[#12100e] text-white">2 People</option>
                    <option value="4 People" className="bg-[#12100e] text-white">4 People</option>
                    <option value="6 People" className="bg-[#12100e] text-white">6 People</option>
                    <option value="8+ Large Party" className="bg-[#12100e] text-white">8+ Large Party</option>
                  </select>
                </div>
                <Users size={18} className="text-[#C79A44] shrink-0 pointer-events-none" />
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                className="bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-widest px-4 rounded-xl hover:bg-[#b3872f] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg h-12 w-full sm:col-span-2 lg:col-span-1 cursor-pointer"
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