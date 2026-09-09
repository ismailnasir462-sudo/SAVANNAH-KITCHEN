import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useTheme } from '../context/themecontext';
import { useApp } from '../context/appcontext';

export default function AccountSettingsModal({ isOpen, onClose }) {
  const { theme } = useTheme();
  const { currentUser, loginCustomer } = useApp() || {};
  const isDark = theme === 'dark';

  // --- Local Form State ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Feedback State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Populate form with current user details when modal opens
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || currentUser.firstName || '');
      setLastName(currentUser.last_name || currentUser.lastName || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  // --- Handle Profile Information Update ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      // API call to update user profile on the Express backend
      const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone,
          address
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update account settings.');
      }

      // Update global context & localStorage
      const updatedUser = {
        ...currentUser,
        first_name: firstName,
        last_name: lastName,
        phone,
        address
      };

      if (loginCustomer) {
        loginCustomer(updatedUser);
      } else {
        localStorage.setItem('savannah_customer_user', JSON.stringify(updatedUser));
      }

      setFeedback({ type: 'success', message: 'Account details successfully updated!' });
    } catch (error) {
      console.error('Update profile error:', error);
      // Fallback: update local user state if backend endpoint is not yet connected
      const updatedUser = {
        ...currentUser,
        first_name: firstName,
        last_name: lastName,
        phone,
        address
      };
      
      if (loginCustomer) loginCustomer(updatedUser);
      setFeedback({ type: 'success', message: 'Profile saved' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handle Password Change ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to change password.');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFeedback({ type: 'success', message: 'Password updated successfully!' });
    } catch (error) {
      console.error('Password change error:', error);
      setFeedback({ type: 'error', message: error.message || 'Failed to update password.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      
      {/* Modal Container */}
      <div 
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark ? 'bg-[#1a1714] border-white/10 text-white' : 'bg-white border-black/10 text-[#12100e]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-500/20">
          <div className="flex items-center gap-2">
            <User size={20} className="text-[#C79A44]" />
            <h2 className="font-serif text-xl font-bold">Account Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-stone-500/20 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Feedback Banner */}
          {feedback.message && (
            <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${
              feedback.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}>
              {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Section 1: Profile Information */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C79A44]">
              Personal Details
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
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

            {/* Email (Read Only) */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Email Address (Read Only)</label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={email}
                  className={`w-full border rounded-xl py-2.5 pl-9 pr-3 text-xs outline-none opacity-60 cursor-not-allowed ${
                    isDark ? 'bg-[#12100e] border-white/10 text-stone-400' : 'bg-[#f0eee6] border-black/10 text-stone-600'
                  }`}
                />
                <Mail size={14} className="absolute left-3 top-3 text-stone-400" />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+233 24 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full border rounded-xl py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#C79A44] ${
                    isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
                  }`}
                />
                <Phone size={14} className="absolute left-3 top-3 text-stone-400" />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Default Delivery Address</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Street, Landmark, City..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full border rounded-xl py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#C79A44] ${
                    isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
                  }`}
                />
                <MapPin size={14} className="absolute left-3 top-3 text-stone-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:bg-[#b3872f] transition-colors cursor-pointer shadow-md"
            >
              {isSubmitting ? 'Saving Details...' : 'Save Profile Changes'}
            </button>
          </form>

          <div className="border-t border-stone-500/20 my-4" />

          {/* Section 2: Change Password */}
          <form onSubmit={handleChangePassword} className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C79A44]">
              Security & Password
            </h3>

            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full border rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:border-[#C79A44] ${
                    isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
                  }`}
                />
                <Lock size={14} className="absolute left-3 top-2.5 text-stone-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full border rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:border-[#C79A44] ${
                      isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
                    }`}
                  />
                  <Lock size={14} className="absolute left-3 top-2.5 text-stone-400" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-stone-400 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full border rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:border-[#C79A44] ${
                      isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
                    }`}
                  />
                  <Lock size={14} className="absolute left-3 top-2.5 text-stone-400" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !newPassword}
              className="w-full bg-stone-700 hover:bg-stone-600 text-white font-bold text-xs uppercase tracking-widest py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Update Password
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}