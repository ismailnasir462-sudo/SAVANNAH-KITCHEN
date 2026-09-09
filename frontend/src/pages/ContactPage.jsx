import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/themecontext';
import { useApp } from '../context/appcontext';

export default function ContactPage() {
  const { theme } = useTheme();
  const { addMessage } = useApp();
  const isDark = theme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    // 1. Required fields check
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setError('Please fill out all required fields (*).');
      return;
    }

    // 2. Phone validation
    if (!validatePhone(phone)) {
      setError('Invalid phone number. Use +233 followed by 9 digits (e.g. +233241234567) or 10 digits starting with 0 (e.g. 0241234567).');
      return;
    }

    // 3. Email validation
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address (e.g. example@domain.com).');
      return;
    }

    // 4. Send message to global Admin Context
    addMessage({
      name,
      email,
      phone,
      subject: subject.trim() || 'General Inquiry',
      text: message
    });

    setError('');
    setIsSubmitted(true);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Location",
      detail1: "12 Cantonments Road",
      detail2: "Accra, Ghana"
    },
    {
      icon: Phone,
      title: "Phone Number",
      detail1: "+233 24 000 0000",
      detail2: "+233 30 000 0000"
    },
    {
      icon: Mail,
      title: "Email Address",
      detail1: "hello@savannahkitchen.com",
      detail2: "info@savannahkitchen.com"
    },
    {
      icon: Clock,
      title: "Opening Hours",
      detail1: "Mon - Fri: 11:00 AM - 11:00 PM",
      detail2: "Sat - Sun: 10:00 AM - 12:00 AM"
    }
  ];
  
  return (
    <section className={`relative py-16 px-5 md:px-8 overflow-hidden transition-colors duration-300 ${
      isDark ? 'text-white' : 'text-[#12100e]'
    }`}>
      
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80" 
          alt="Restaurant Atmosphere" 
          className={`w-full h-full object-cover filter blur-[3px] transition-opacity duration-300 ${
            isDark ? 'opacity-20' : 'opacity-10'
          }`}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-script text-[#C79A44] text-3xl mb-1">Get In Touch</p>
          <h1 className={`font-serif text-4xl sm:text-5xl font-bold ${
            isDark ? 'text-white' : 'text-[#12100e]'
          }`}>
            Contact Us
          </h1>
          <div className="w-24 h-0.5 bg-[#C79A44] mx-auto mt-4" />
        </motion.div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, idx) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`border rounded-2xl p-6 text-center hover:border-[#C79A44]/40 transition-colors ${
                  isDark 
                    ? 'bg-[#1a1714] border-white/10' 
                    : 'bg-white border-black/10 shadow-md'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#C79A44]/10 border border-[#C79A44]/30 flex items-center justify-center mx-auto text-[#C79A44] mb-4">
                  <Icon size={20} />
                </div>
                <h3 className={`font-sans text-base font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-[#12100e]'
                }`}>
                  {info.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>{info.detail1}</p>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>{info.detail2}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Form & Map Section */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Side: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`lg:col-span-7 border rounded-3xl p-6 sm:p-10 shadow-2xl transition-colors duration-300 ${
              isDark 
                ? 'bg-[#1a1714] border-white/10' 
                : 'bg-white border-black/10'
            }`}
          >
            <h2 className={`font-sans text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-[#12100e]'
            }`}>
              Send Us A Message
            </h2>
            <p className={`text-xs mb-8 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
              Have a question, feedback, or inquiry? Fill out the form below and our team will get back to you shortly.
            </p>

            {isSubmitted ? (
              /* Success Screen */
              <div className={`border rounded-2xl p-8 text-center space-y-4 ${
                isDark 
                  ? 'bg-[#12100e] border-[#C79A44]/40' 
                  : 'bg-[#fcfbf7] border-[#C79A44]/50'
              }`}>
                <div className="w-14 h-14 rounded-full bg-[#C79A44]/20 border border-[#C79A44] flex items-center justify-center mx-auto text-[#C79A44]">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className={`font-sans text-xl font-bold ${
                  isDark ? 'text-white' : 'text-[#12100e]'
                }`}>
                  Message Sent Successfully!
                </h3>
                <p className={`text-xs leading-relaxed ${
                  isDark ? 'text-stone-300' : 'text-stone-700'
                }`}>
                  Thank you, <span className="text-[#C79A44] font-bold">{name}</span>. We have received your message and will respond to <span className={`font-medium ${isDark ? 'text-stone-200' : 'text-stone-900'}`}>{email}</span> within 24 hours.
                </p>
                <button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setName('');
                    setEmail('');
                    setPhone('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-full hover:bg-[#b3872f] transition-colors mt-4 cursor-pointer shadow-md"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {/* Email & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      Subject (Optional)
                    </label>
                    <input 
                      type="text"
                      placeholder="Inquiry / Catering"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C79A44] transition-colors ${
                        isDark 
                          ? 'bg-[#12100e] border-white/15 text-white placeholder-stone-500' 
                          : 'bg-[#fcfbf7] border-black/15 text-[#12100e] placeholder-stone-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className={`block text-[11px] uppercase tracking-wider font-bold mb-1.5 ${
                    isDark ? 'text-stone-400' : 'text-stone-600'
                  }`}>
                    Message *
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="How can we help you?"
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); setError(''); }}
                    className={`w-full border rounded-xl px-4 py-3 text-xs outline-none focus:border-[#C79A44] transition-colors ${
                      isDark 
                        ? 'bg-[#12100e] border-white/15 text-white placeholder-stone-500' 
                        : 'bg-[#fcfbf7] border-black/15 text-[#12100e] placeholder-stone-400'
                    }`}
                  />
                </div>

                {/* Error Alert Banner */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 text-xs font-medium p-3 rounded-xl border ${
                      isDark 
                        ? 'bg-[#47151a] text-[#C79A44] border-[#C79A44]/40' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="w-full bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-[#b3872f] transition-colors shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  Send Message <Send size={15} />
                </button>

              </form>
            )}
          </motion.div>

          {/* Right Side: Embedded Google Map */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`lg:col-span-5 h-full min-h-[420px] border rounded-3xl overflow-hidden shadow-2xl relative transition-colors duration-300 ${
              isDark ? 'bg-[#1a1714] border-white/10' : 'bg-white border-black/10'
            }`}
          >
            <iframe 
              title="Savannah Kitchen Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.970428586326!2d-0.17942762417743118!3d5.571439994409059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1020756e75916055%3A0xb3e6483fbbe20c02!2sCantonments%20Rd%2C%20Accra!5e0!3m2!1sen!2sgh!4v1710000000000!5m2!1sen!2sgh" 
              width="100%" 
              height="100%" 
              style={{ 
                border: 0, 
                minHeight: '420px', 
                filter: isDark ? 'grayscale(0.8) contrast(1.2) invert(0.9)' : 'none' 
              }} 
              allowFullScreen
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

        </div>
      </div>

    </section>
  );
}