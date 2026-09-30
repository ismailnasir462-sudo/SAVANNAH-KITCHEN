import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useApp } from '../context/appcontext';
import { useTheme } from '../context/themecontext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function LiveChatWidget() {
  const { currentUser } = useApp();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const chatEndRef = useRef(null);

  if (!currentUser || !currentUser.id) return null;

  const userId = String(currentUser.id);
  const userName = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'Customer';
  const userEmail = currentUser.email || '';

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/chat/user/${userId}?markRead=${isOpen}`);
      if (res.data && res.data.success) {
        const newMsgs = res.data.messages || [];
        setMessages(newMsgs);

        if (!isOpen) {
          const unread = newMsgs.filter(m => m.sender_type === 'admin' && !m.is_read).length;
          setUnreadCount(unread);
        } else {
          setUnreadCount(0);
        }
      }
    } catch (err) {
      console.error('Chat widget fetch error:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [userId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const msgText = inputMessage;
    setInputMessage('');

    const tempMsg = {
      id: Date.now(),
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      sender_type: 'user',
      message: msgText,
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await axios.post(`${API_BASE_URL}/chat/send`, {
        user_id: userId,
        user_name: userName,
        user_email: userEmail,
        sender_type: 'user',
        message: msgText
      });
      fetchMessages();
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setUnreadCount(0); }}
          className="relative bg-[#C79A44] hover:bg-[#b3872f] text-[#12100e] p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer"
        >
          <MessageCircle size={28} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div className={`w-80 sm:w-96 rounded-2xl border shadow-2xl overflow-hidden flex flex-col h-[450px] transition-all duration-300 ${
          isDark ? 'bg-[#1a1714] border-white/10 text-white' : 'bg-white border-black/10 text-[#12100e]'
        }`}>
          <div className="bg-[#7A2A32] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C79A44] text-[#12100e] font-bold flex items-center justify-center text-xs">
                {userName[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-bold text-xs">Savannah Kitchen Support</p>
                <p className="text-[10px] text-emerald-300">● Live</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-75 cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <p className="text-stone-400 text-xs text-center my-auto italic pt-12">
                Hello {userName}! Send us a message and our team will reply immediately.
              </p>
            ) : (
              messages.map((m) => {
                const isUser = m.sender_type === 'user';
                return (
                  <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#C79A44] text-[#12100e] rounded-br-none font-medium'
                        : isDark
                        ? 'bg-[#2a241f] text-stone-200 border border-white/10 rounded-bl-none'
                        : 'bg-stone-100 text-stone-800 border border-black/5 rounded-bl-none'
                    }`}>
                      {m.message}
                    </div>
                    <span className="text-[9px] text-stone-400 mt-1 px-1">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className={`p-3 border-t flex items-center gap-2 ${
            isDark ? 'border-white/10 bg-[#12100e]' : 'border-black/10 bg-stone-50'
          }`}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className={`flex-1 border rounded-xl px-3 py-2 text-xs outline-none focus:border-[#C79A44] ${
                isDark ? 'bg-[#1a1714] border-white/15 text-white' : 'bg-white border-black/15 text-[#12100e]'
              }`}
            />
            <button
              type="submit"
              className="bg-[#C79A44] hover:bg-[#b3872f] text-[#12100e] p-2 rounded-xl transition-colors cursor-pointer"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}