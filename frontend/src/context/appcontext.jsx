import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

const API_BASE_URL = 'http://192.168.3.226:5000/api';

export function AppProvider({ children }) {
  // --- 1. Customer Auth State (Persisted in localStorage) ---
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('savannah_customer_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loginCustomer = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('savannah_customer_user', JSON.stringify(userData));
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    localStorage.removeItem('savannah_customer_user');
  };

  // --- 2. Database Collection States ---
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 3. Fetch All Data from MySQL Backend ---
  const fetchAllData = async () => {
    try {
      const [menuRes, ordersRes, resRes, msgsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/menu`),
        axios.get(`${API_BASE_URL}/orders`),
        axios.get(`${API_BASE_URL}/reservations`),
        axios.get(`${API_BASE_URL}/contact`)
      ]);

      setMenuItems(Array.isArray(menuRes.data) ? menuRes.data : menuRes.data.menuItems || []);
      setOrders(ordersRes.data.orders || (Array.isArray(ordersRes.data) ? ordersRes.data : []));
      setReservations(Array.isArray(resRes.data) ? resRes.data : resRes.data.reservations || []);
      setMessages(Array.isArray(msgsRes.data) ? msgsRes.data : msgsRes.data.messages || []);
    } catch (error) {
      console.error('Error fetching data from API backend:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Auto-Sync (Initial Mount + 5s Interval) ---
  useEffect(() => {
    fetchAllData();

    // Polls database every 5 seconds so live order changes reflect automatically
    const interval = setInterval(() => {
      fetchAllData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --- 4. Contact Message Handlers ---
  const addMessage = async (newMsg) => {
    try {
      await axios.post(`${API_BASE_URL}/contact`, newMsg);
      const res = await axios.get(`${API_BASE_URL}/contact`);
      setMessages(Array.isArray(res.data) ? res.data : res.data.messages || []);
      return true;
    } catch (error) {
      console.error('Error submitting message to backend:', error);
      throw error;
    }
  };

  // --- 5. Reservation Handlers ---
  const addReservation = async (newRes) => {
    try {
      const payload = {
        name: newRes.name,
        email: newRes.email,
        phone: newRes.phone,
        guests: newRes.guests,
        res_date: newRes.date,
        res_time: newRes.time,
        seating: newRes.seating,
        special_request: newRes.specialRequest
      };

      await axios.post(`${API_BASE_URL}/reservations`, payload);
      const res = await axios.get(`${API_BASE_URL}/reservations`);
      setReservations(Array.isArray(res.data) ? res.data : res.data.reservations || []);
      return true;
    } catch (error) {
      console.error('Error creating reservation in backend:', error);
      throw error;
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
      const res = await axios.put(`${API_BASE_URL}/reservations/${id}/status`, { status });
      if (res.data.success || res.status === 200) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
        fetchAllData(); // Sync live data across dashboard
      }
    } catch (error) {
      console.error('Error updating reservation status:', error);
      alert('Failed to update reservation status.');
    }
  };

  // --- 6. Order Handlers ---
  const addOrder = async (newOrder) => {
    try {
      const payload = {
        user_id: currentUser?.id || null,
        customer: newOrder.customer || `${newOrder.firstName || ''} ${newOrder.lastName || ''}`.trim() || 'Guest Customer',
        email: newOrder.email,
        phone: newOrder.phone,
        address: newOrder.address,
        items: newOrder.items,
        total: newOrder.total,
        payment_method: newOrder.payment_method,
        payment_reference: newOrder.payment_reference || 'CASH_ON_DELIVERY'
      };

      const res = await axios.post(`${API_BASE_URL}/orders`, payload);
      
      // Immediately refresh orders list
      const fetchRes = await axios.get(`${API_BASE_URL}/orders`);
      setOrders(fetchRes.data.orders || (Array.isArray(fetchRes.data) ? fetchRes.data : []));
      
      return res.data;
    } catch (error) {
      console.error('Error submitting order to backend:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/${id}/status`, { status });
      
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // --- 7. Menu CRUD Handlers ---
  const addMenuItem = async (newItem) => {
    try {
      const payload = {
        name: newItem.name,
        category: newItem.category,
        price: newItem.price,
        description: newItem.description,
        image_url: newItem.image_url || newItem.img,
        prep_time: newItem.prep_time || '15 mins',
        calories: newItem.calories || null,
        ingredients: newItem.ingredients || JSON.stringify(["Fresh Ingredients"]),
        rating: newItem.rating || 5.0
      };

      await axios.post(`${API_BASE_URL}/menu`, payload);
      const res = await axios.get(`${API_BASE_URL}/menu`);
      setMenuItems(Array.isArray(res.data) ? res.data : res.data.menuItems || []);
      return true;
    } catch (error) {
      console.error('Error adding menu item:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to add menu item to database.');
      return false;
    }
  };

  const updateMenuItem = async (id, updatedItem) => {
    try {
      const payload = {
        name: updatedItem.name,
        category: updatedItem.category,
        price: updatedItem.price,
        description: updatedItem.description,
        image_url: updatedItem.image_url || updatedItem.img,
        prep_time: updatedItem.prep_time || '15 mins',
        calories: updatedItem.calories || null,
        ingredients: updatedItem.ingredients || JSON.stringify(["Fresh Ingredients"]),
        rating: updatedItem.rating || 5.0,
        is_available: updatedItem.is_available ?? true
      };

      await axios.put(`${API_BASE_URL}/menu/${id}`, payload);
      const res = await axios.get(`${API_BASE_URL}/menu`);
      setMenuItems(Array.isArray(res.data) ? res.data : res.data.menuItems || []);
      return true;
    } catch (error) {
      console.error('Error updating menu item:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to update menu item in database.');
      return false;
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/menu/${id}`);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting menu item:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to delete menu item from database.');
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, loginCustomer, logoutCustomer,
      loading, fetchAllData,
      menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
      orders, addOrder, updateOrderStatus,
      reservations, addReservation, updateReservationStatus,
      messages, addMessage
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);