import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useTheme } from '../../context/themecontext';

export default function AdminLogin({ onAuthSuccess }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (passcode === 'savannah2026') {
      onAuthSuccess(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className={`min-h-[80vh] flex items-center justify-center p-5 transition-colors duration-300 ${
      isDark ? 'bg-[#12100e] text-white' : 'bg-[#fcfbf7] text-[#12100e]'
    }`}>
      <div className={`max-w-sm w-full border rounded-3xl p-8 shadow-2xl text-center transition-colors duration-300 ${
        isDark ? 'bg-[#1a1714] border-[#C79A44]/40' : 'bg-white border-[#C79A44]/60'
      }`}>
        <div className="w-14 h-14 rounded-full bg-[#C79A44]/20 border border-[#C79A44] flex items-center justify-center mx-auto text-[#C79A44] mb-4">
          <KeyRound size={26} />
        </div>

        <h2 className="font-serif text-2xl font-bold mb-1">Admin Portal</h2>
        <p className={`text-xs mb-6 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
          Authorized restaurant staff only.
        </p>

        <form onSubmit={handleAdminAuth} className="space-y-4">
          <input
            type="password"
            placeholder="Enter Staff Passcode"
            value={passcode}
            onChange={(e) => { setPasscode(e.target.value); setError(false); }}
            className={`w-full text-center border rounded-xl py-3 text-sm outline-none focus:border-[#C79A44] transition-colors ${
              error 
                ? 'border-red-500 bg-red-500/10' 
                : isDark ? 'bg-[#12100e] border-white/15 text-white' : 'bg-[#fcfbf7] border-black/15 text-[#12100e]'
            }`}
          />

          {error && (
            <p className="text-red-400 text-xs font-semibold">
              Invalid passcode. Default key: savannah2026
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-[#C79A44] text-[#12100e] font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#b3872f] transition-colors cursor-pointer shadow-md"
          >
            Access Portal
          </button>
        </form>
      </div>
    </div>
  );
}