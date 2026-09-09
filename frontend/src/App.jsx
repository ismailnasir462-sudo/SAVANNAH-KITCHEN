import React, { useState, useEffect, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FacebookProvider } from 'react-facebook';

import { ThemeProvider, useTheme } from './context/themecontext';
import { AppProvider, useApp } from './context/appcontext';

// Public Components & Pages
import Navbar from './components/navbar';
import Footer from './components/Footer';
import CartDrawer from './components/cartdrawer';
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ReservationPage from './pages/ReservationPage';
import CheckoutPage from './pages/checkoutpage';
import MyOrdersPage from './pages/myorderspage';

// Admin Page
import AdminDashboard from './admin/admindashboard';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';

function MainLayout() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { currentUser } = useApp() || {};
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // --- Disable Browser Scroll Restoration & Redirect on Refresh ---
  useLayoutEffect(() => {
    // 1. Turn off default browser scroll memory
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Detect page refresh / reload
    const navEntries = performance.getEntriesByType('navigation');
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

    if (isReload) {
      // 3. Force instant scroll reset to top-left
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      // 4. Redirect to landing page ('/') if not on admin route
      if (!isAdminRoute && location.pathname !== '/') {
        navigate('/', { replace: true });
      }
    }
  }, []);

  // --- Scroll to top on ANY route change ---
  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // --- 1. Dynamic User-Isolated Cart Key ---
  const cartKey = currentUser?.id ? `cart_user_${currentUser.id}` : 'cart_guest';

  // --- 2. Initialize Cart State from Active User Key ---
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem(cartKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- 3. Handle Cart Switching & Clear Guest Cart on Logout ---
  useEffect(() => {
    if (currentUser?.id) {
      const savedCart = localStorage.getItem(`cart_user_${currentUser.id}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } else {
      localStorage.removeItem('cart_guest');
      setCart([]);
    }
  }, [currentUser?.id]);

  // --- 4. Persist Cart Updates to Active Key ---
  useEffect(() => {
    const activeKey = currentUser?.id ? `cart_user_${currentUser.id}` : 'cart_guest';
    localStorage.setItem(activeKey, JSON.stringify(cart));
  }, [cart, currentUser?.id]);

  // --- Cart Actions ---
  const addToCart = (item, quantity = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.id === item.id);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      }
      return [...prevCart, { ...item, quantity }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#12100e] text-white' : 'bg-[#fcfbf7] text-[#12100e]'
    }`}>
      {!isAdminRoute && <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<MenuPage onAddToCart={addToCart} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} onClearCart={clearCart} />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <FacebookProvider appId={FACEBOOK_APP_ID}>
        <ThemeProvider>
          <AppProvider>
            <Router>
              <MainLayout />
            </Router>
          </AppProvider>
        </ThemeProvider>
      </FacebookProvider>
    </GoogleOAuthProvider>
  );
}