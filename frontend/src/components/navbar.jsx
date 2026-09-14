import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  LogOut, 
  Settings, 
  Package, 
  ChevronDown, 
  Sun, 
  Moon, 
  Menu as MenuIcon, 
  X 
} from 'lucide-react';
import { useTheme } from '../context/themecontext';
import { useApp } from '../context/appcontext';
import CustomerAuthModal from './customerauthmodal';
import AccountSettingsModal from './accountsettingsmodal';

export default function Navbar({ cartCount = 0, onOpenCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logoutCustomer } = useApp() || {};
  const isDark = theme === 'dark';

  // Modal & Menu States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Close desktop user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (logoutCustomer) logoutCustomer();
    navigate('/');
  };

  const handleOpenSettings = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsSettingsOpen(true);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Menu", path: "/menu" },
    { label: "About Us", path: "/about" },
    { label: "Reservations", path: "/reservation" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        isDark ? 'bg-[#12100e]/95 border-white/10 text-white' : 'bg-[#fcfbf7]/95 border-black/10 text-[#12100e]'
      } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex flex-col">
            <span className="font-script text-[#C79A44] text-2xl leading-none">Savannah</span>
            <span className={`font-serif font-bold text-sm tracking-widest uppercase ${
              isDark ? 'text-white' : 'text-[#12100e]'
            }`}>
              Kitchen
            </span>
          </Link>

          {/* Desktop Navigation Links (Black text in light mode, active gold) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={`transition-colors hover:text-[#C79A44] ${
                    isActive 
                      ? 'text-[#C79A44]' 
                      : isDark ? 'text-white' : 'text-[#12100e]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Utility Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-stone-500/20 hover:border-[#C79A44] transition-colors cursor-pointer text-[#C79A44]"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full border border-stone-500/20 hover:border-[#C79A44] transition-colors cursor-pointer"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag size={18} className="text-[#C79A44]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C79A44] text-[#12100e] text-[10px] font-extrabold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Online Order Button */}
            <Link 
              to="/menu" 
              className="hidden lg:inline-flex items-center gap-1.5 bg-[#C79A44] text-[#12100e] text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-full hover:bg-[#b3872f] transition-colors"
            >
              Order Online
            </Link>

            {/* Account Menu / Auth Button */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isDropdownOpen
                      ? 'border-[#C79A44] bg-[#C79A44]/10 text-[#C79A44]'
                      : isDark 
                        ? 'border-white/15 text-stone-200 hover:border-[#C79A44]' 
                        : 'border-black/20 text-[#12100e] hover:border-[#C79A44]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#C79A44] text-[#12100e] flex items-center justify-center font-bold text-[11px]">
                    {currentUser.first_name ? currentUser.first_name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[90px] truncate hidden sm:inline">{currentUser.first_name || 'Account'}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-52 rounded-2xl border shadow-2xl py-2 z-50 transition-all ${
                    isDark ? 'bg-[#1a1714] border-white/10 text-white' : 'bg-white border-black/10 text-[#12100e]'
                  }`}>
                    <div className="px-4 py-2 border-b border-stone-500/10 mb-1">
                      <p className={`text-[10px] uppercase font-bold ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>Signed in as</p>
                      <p className="text-xs font-bold truncate text-[#C79A44]">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={handleOpenSettings}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors text-left cursor-pointer ${
                        isDark ? 'hover:bg-white/5 text-stone-200' : 'hover:bg-black/5 text-[#12100e]'
                      }`}
                    >
                      <Settings size={15} className={isDark ? "text-stone-400" : "text-stone-600"} />
                      <span>Account Settings</span>
                    </button>

                    <Link
                      to="/my-orders"
                      onClick={() => setIsDropdownOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors ${
                        isDark ? 'hover:bg-white/5 text-stone-200' : 'hover:bg-black/5 text-[#12100e]'
                      }`}
                    >
                      <Package size={15} className="text-[#C79A44]" />
                      <span>My Orders</span>
                    </Link>

                    <div className="my-1 border-t border-stone-500/10" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-[#C79A44] text-[#12100e] text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full hover:bg-[#b3872f] transition-colors cursor-pointer"
              >
                <User size={15} /> Sign In
              </button>
            )}

            {/* Mobile Navigation Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2.5 rounded-xl border border-stone-500/20 text-[#C79A44] cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t px-6 py-6 space-y-4 ${
            isDark ? 'bg-[#12100e] border-white/10 text-white' : 'bg-white border-black/10 text-[#12100e]'
          }`}>
            <nav className="flex flex-col space-y-3 text-xs font-bold uppercase tracking-wider">
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={idx} 
                    to={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`py-1 ${
                      isActive 
                        ? 'text-[#C79A44]' 
                        : isDark ? 'text-stone-300' : 'text-[#12100e]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="border-t border-stone-500/20 my-2 pt-3" />

              {currentUser ? (
                <div className="space-y-3">
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAuthModalOpen(true);
                  }} 
                  className="w-full flex items-center justify-center gap-2 bg-[#C79A44] text-[#12100e] text-xs font-bold uppercase py-3 rounded-xl cursor-pointer"
                >
                  <User size={15} /> Sign In / Register
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Customer Authentication Modal */}
      <CustomerAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onContinueAsGuest={() => setIsAuthModalOpen(false)} 
      />

      {/* Account Settings Modal */}
      {isSettingsOpen && (
        <AccountSettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
    </>
  );
}