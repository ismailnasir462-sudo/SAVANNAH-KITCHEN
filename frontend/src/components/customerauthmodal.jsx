import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, AtSign, Loader2, Phone, MapPin } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useLogin } from 'react-facebook';
import axios from 'axios';
import { useTheme } from '../context/themecontext';
import { useApp } from '../context/appcontext';

export default function CustomerAuthModal({ isOpen, onClose, onContinueAsGuest }) {
  const { theme } = useTheme();
  const { loginCustomer } = useApp() || {};
  const isDark = theme === 'dark';

  const { login: facebookLogin, loading: fbLoading } = useLogin();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // --- Handle Google Login ---
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google-auth', {
        credential: credentialResponse.credential,
      });

      if (res.data.success) {
        if (loginCustomer) loginCustomer(res.data.user);
        onClose();
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      alert('Google authentication failed. Please try again.');
    }
  };

  // --- Handle Facebook Login ---
  const handleFacebookClick = async () => {
    try {
      const response = await facebookLogin({ scope: 'email,public_profile' });
      if (response.authResponse) {
        const { accessToken, userID } = response.authResponse;
        
        const res = await axios.post('http://localhost:5000/api/auth/facebook-auth', {
          accessToken,
          userID,
        });

        if (res.data.success) {
          if (loginCustomer) loginCustomer(res.data.user);
          onClose();
        }
      }
    } catch (error) {
      console.error('Facebook Sign-In Error:', error);
      alert('Facebook authentication failed. Please try again.');
    }
  };

  // --- Handle Email/Password Form Submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = mode === 'signup' 
        ? 'http://localhost:5000/api/auth/signup' 
        : 'http://localhost:5000/api/auth/login';

      const payload = mode === 'signup' 
        ? { first_name: firstName, last_name: lastName, username, email, phone, address, password }
        : { identifier: email || username, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.errors ? data.errors.join('\n') : data.message);
        return;
      }

      if (mode === 'signup') {
        alert('Account created successfully! Switching to sign in.');
        setMode('login');
      } else {
        alert(`Welcome back, ${data.user.first_name || data.user.username}!`);
        if (loginCustomer) loginCustomer(data.user);
        onClose();
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      alert('Unable to connect to authentication server. Please verify your backend server status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-md" />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative max-w-md w-full border rounded-3xl p-8 z-10 shadow-2xl transition-colors duration-300 max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-[#1a1714] border-white/10 text-white' : 'bg-white border-black/10 text-[#12100e]'
        }`}
      >
        <div className="text-center mb-6">
          <p className="font-script text-[#C79A44] text-2xl">Savannah Kitchen</p>
          <h2 className="font-serif text-2xl font-bold mt-1">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
        </div>

        {/* --- Social Login Buttons --- */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert('Google Sign In Failed')}
              theme={isDark ? 'filled_black' : 'outline'}
              shape="pill"
            />
          </div>

          <button
            type="button"
            onClick={handleFacebookClick}
            disabled={fbLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white font-bold text-xs py-2.5 px-4 rounded-full hover:bg-[#166fe5] transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-4">
          <div className={`flex-grow border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}></div>
          <span className="flex-shrink mx-4 text-[10px] text-stone-400 uppercase font-bold">
            Or continue with Email
          </span>
          <div className={`flex-grow border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}></div>
        </div>

        {/* Local Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
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
                        isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
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
                        isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
                      }`}
                    />
                    <User size={14} className="absolute left-3 top-3 text-stone-400" />
                  </div>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="johndoe123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#C79A44] ${
                      isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
                    }`}
                  />
                  <AtSign size={15} className="absolute left-3 top-3 text-stone-400" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#C79A44] ${
                      isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
                    }`}
                  />
                  <Phone size={15} className="absolute left-3 top-3 text-stone-400" />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Delivery Address</label>
                <div className="relative">
                  <textarea
                    rows={2}
                    placeholder="123 Savannah St, Suite 100..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#C79A44] ${
                      isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
                    }`}
                  />
                  <MapPin size={15} className="absolute left-3 top-3 text-stone-400" />
                </div>
              </div>
            </>
          )}

          {/* Email / Username */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">
              {mode === 'signup' ? 'Email Address' : 'Email or Username'}
            </label>
            <div className="relative">
              <input
                type={mode === 'signup' ? "email" : "text"}
                required
                placeholder={mode === 'signup' ? "hello@example.com" : "hello@example.com or username"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#C79A44] ${
                  isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
                }`}
              />
              <Mail size={15} className="absolute left-3 top-3 text-stone-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-[#C79A44] ${
                  isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
                }`}
              />
              <Lock size={15} className="absolute left-3 top-3 text-stone-400" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#b3872f] transition-colors mt-2 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Register Account'
            )}
          </button>
        </form>

        {/* Modal Footer Controls */}
        <div className={`mt-6 pt-4 border-t text-center space-y-3 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-xs text-[#C79A44] hover:underline font-semibold"
          >
            {mode === 'login' ? "Don't have an account? Sign Up" : 'Already registered? Sign In'}
          </button>

          {onContinueAsGuest && (
            <div>
              <button
                type="button"
                onClick={onContinueAsGuest}
                className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-2 ${
                  isDark ? 'border-white/15 text-stone-300 hover:bg-white/5' : 'border-black/15 text-stone-700 hover:bg-black/5'
                }`}
              >
                Continue as Guest <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}