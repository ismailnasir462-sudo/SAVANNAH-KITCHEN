import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useApp } from '../../context/appcontext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://cascade-sappiness-stays.ngrok-free.dev/api';

// --- WhatsApp-style Date Helper ---
const formatChatDateHeader = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return 'Today';
  if (isYesterday) return 'Yesterday';

  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function AdminChatTab({ isDark }) {
  const { adminChats, fetchAllData } = useApp();
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const isAtBottomRef = useRef(true);

  // Track if admin is currently scrolled to bottom
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // Considered "at bottom" if within 80px of the bottom edge
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 80;
  };

  // Auto-select first chat on initial load if none selected
  useEffect(() => {
    if (!selectedUser && adminChats.length > 0) {
      setSelectedUser(adminChats[0]);
    } else if (selectedUser) {
      const refreshed = adminChats.find((c) => String(c.user_id) === String(selectedUser.user_id));
      if (refreshed) setSelectedUser(refreshed);
    }
  }, [adminChats]);

  // Fetch specific conversation messages
  const fetchMessages = async (userId) => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/chat/user/${userId}`);
      if (res.data && res.data.success) {
        setMessages(res.data.messages || []);
      }
    } catch (err) {
      console.error('Error fetching conversation:', err);
    }
  };

  const handleUserSelectionSync = async (userId) => {
    if (!userId) return;
    // Force scroll to bottom when switching users
    isAtBottomRef.current = true;
    await fetchMessages(userId);
    await fetchAllData(userId);
  };

  useEffect(() => {
    if (selectedUser?.user_id) {
      handleUserSelectionSync(selectedUser.user_id);
    }
  }, [selectedUser?.user_id]);

  // Background interval polling to auto-sync messages without snatching scroll position
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedUser?.user_id) {
        fetchAllData(selectedUser.user_id);
        fetchMessages(selectedUser.user_id);
      } else {
        fetchAllData();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedUser?.user_id]);

  // SMART AUTO-SCROLL: Only scroll to bottom if user is already near bottom or switched users
  useEffect(() => {
    if (isAtBottomRef.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSelectUser = (chat) => {
    setSelectedUser(chat);
    handleUserSelectionSync(chat.user_id);
  };

  const handleSendReply = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedUser) return;

    const textToSend = replyText;
    setReplyText('');

    const tempMsg = {
      id: Date.now(),
      user_id: selectedUser.user_id,
      sender_type: 'admin',
      message: textToSend,
      created_at: new Date().toISOString()
    };
    
    // Always force scroll down on sending a new message
    isAtBottomRef.current = true;
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await axios.post(`${API_BASE_URL}/chat/send`, {
        user_id: selectedUser.user_id,
        sender_type: 'admin',
        message: textToSend
      });

      await handleUserSelectionSync(selectedUser.user_id);
    } catch (err) {
      console.error('Error sending reply:', err);
    }
  };

  const customerDisplayName = selectedUser?.user_name || `Customer #${selectedUser?.user_id || 'User'}`;

  return (
    <div className={`border rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[600px] shadow-lg ${
      isDark ? 'bg-[#1a1714] border-white/10 text-white' : 'bg-white border-black/10 text-[#12100e]'
    }`}>
      
      {/* LEFT COLUMN: User List */}
      <div className={`md:col-span-4 border-r flex flex-col h-full overflow-hidden ${
        isDark ? 'border-white/10 bg-[#12100e]' : 'border-black/10 bg-stone-50'
      }`}>
        <div className="p-4 border-b border-stone-500/20 flex justify-between items-center shrink-0">
          <h2 className="font-bold text-sm flex items-center gap-2">
            <MessageCircle size={16} className="text-[#C79A44]" /> Active Support Chats
          </h2>
          <button onClick={() => fetchAllData(selectedUser?.user_id)} className="text-stone-400 hover:text-[#C79A44] cursor-pointer">
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {adminChats.length === 0 ? (
            <p className="text-xs text-stone-400 p-4 italic text-center">No active customer chats yet.</p>
          ) : (
            adminChats.map((chat) => {
              const isSelected = selectedUser && String(selectedUser.user_id) === String(chat.user_id);
              const chatName = chat.user_name || `Customer #${chat.user_id}`;

              return (
                <div
                  key={chat.user_id}
                  onClick={() => handleSelectUser(chat)}
                  className={`p-3.5 border-b cursor-pointer transition-colors flex items-center gap-3 ${
                    isDark ? 'border-white/5 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'
                  } ${isSelected ? (isDark ? 'bg-[#C79A44]/15 border-l-4 border-l-[#C79A44]' : 'bg-amber-50 border-l-4 border-l-[#C79A44]') : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#C79A44] text-[#12100e] font-bold flex items-center justify-center shrink-0">
                    {chatName[0] ? chatName[0].toUpperCase() : 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-xs truncate">{chatName}</p>
                      {!isSelected && chat.unread_count > 0 && (
                        <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                          {chat.unread_count}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 truncate mt-0.5">{chat.last_message || 'No messages'}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Chat Area */}
      <div className="md:col-span-8 flex flex-col h-full overflow-hidden">
        {selectedUser ? (
          <>
            {/* STATIC HEADER */}
            <div className={`p-4 border-b flex items-center gap-3 shrink-0 ${
              isDark ? 'border-white/10 bg-[#12100e]' : 'border-black/10 bg-stone-100'
            }`}>
              <div className="w-9 h-9 rounded-full bg-[#C79A44] text-[#12100e] font-bold flex items-center justify-center text-xs shrink-0">
                {customerDisplayName[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm truncate">{customerDisplayName}</h3>
                <p className="text-xs text-stone-400 truncate">{selectedUser.user_email || 'No email provided'}</p>
              </div>
            </div>

            {/* SCROLLABLE MESSAGES BODY */}
            <div 
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 p-4 overflow-y-auto space-y-3"
            >
              {messages.length === 0 ? (
                <p className="text-xs text-stone-400 italic text-center my-auto pt-12">
                  No messages exchanged yet with {customerDisplayName}.
                </p>
              ) : (
                messages.map((m, index) => {
                  const isAdmin = m.sender_type === 'admin';
                  const dateLabel = formatChatDateHeader(m.created_at);

                  const prevDateLabel = index > 0 ? formatChatDateHeader(messages[index - 1].created_at) : null;
                  const showDateHeader = dateLabel && dateLabel !== prevDateLabel;

                  return (
                    <React.Fragment key={m.id || index}>
                      {showDateHeader && (
                        <div className="flex justify-center my-3">
                          <span className={`text-[10px] font-semibold px-3 py-1 rounded-full shadow-sm border ${
                            isDark
                              ? 'bg-[#2a241f] text-stone-400 border-white/10'
                              : 'bg-stone-200 text-stone-600 border-black/5'
                          }`}>
                            {dateLabel}
                          </span>
                        </div>
                      )}

                      <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-[#C79A44] text-[#12100e] rounded-br-none font-medium'
                            : isDark
                            ? 'bg-[#2a241f] text-stone-200 border border-white/10 rounded-bl-none'
                            : 'bg-stone-100 text-stone-800 border border-black/5 rounded-bl-none'
                        }`}>
                          {m.message}
                        </div>
                        <span className="text-[9px] text-stone-400 mt-1 px-1">
                          {isAdmin ? 'Admin' : customerDisplayName} • {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* STATIC INPUT REPLY BAR */}
            <form onSubmit={handleSendReply} className={`p-3 border-t flex items-center gap-2 shrink-0 ${
              isDark ? 'border-white/10 bg-[#12100e]' : 'border-black/10 bg-stone-50'
            }`}>
              <input
                type="text"
                placeholder="Type reply and press Enter..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
                className={`flex-1 border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#C79A44] ${
                  isDark ? 'bg-[#1a1714] border-white/15 text-white' : 'bg-white border-black/15 text-[#12100e]'
                }`}
              />
              <button
                type="submit"
                className="bg-[#C79A44] hover:bg-[#b3872f] text-[#12100e] px-4 py-2.5 rounded-xl font-bold text-xs uppercase transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                Send <Send size={14} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-stone-400 p-6">
            <MessageCircle size={36} className="text-stone-500 mb-2" />
            <p className="text-xs font-semibold">Select a customer chat from the list to start replying.</p>
          </div>
        )}
      </div>
    </div>
  );
}