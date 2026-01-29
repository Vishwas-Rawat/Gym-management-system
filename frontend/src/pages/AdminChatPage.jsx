import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { chatApi } from '../services/api';
import '../styles/dashboard.css';

const Icons = {
  Search: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Send: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polyline points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  ArrowBack: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  User: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  MessageCircle: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Phone: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Video: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  Info: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Check: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  CheckCheck: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="7 13 12 18 20 6" /><polyline points="2 13 7 18 15 6" />
    </svg>
  )
};

const AdminChatPage = () => {
  const { isConnected, sendMessage, messages, loadHistory, typingStatus, userId: myUserId } = useChat();
  
  const [activeUser, setActiveUser] = useState(null); // { userId, fullName, role }
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [inputText, setInputText] = useState("");
  
  const messagesEndRef = useRef(null);

  // Fetch Contacts on Mount
  useEffect(() => {
    const fetchContacts = async () => {
      setLoadingContacts(true);
      try {
        const response = await chatApi.get('/chat/contacts');
        setContacts(response.data || []);
      } catch (err) {
        console.error("Failed to fetch contacts", err);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchContacts();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeUser]);

  // Load history when user changes
  useEffect(() => {
    if (activeUser) {
      loadHistory(activeUser.userId);
    }
  }, [activeUser]);

  const handleSend = () => {
    if (!inputText.trim() || !activeUser) return;
    sendMessage(activeUser.userId, inputText);
    setInputText("");
  };

  const getInitials = (name) => {
    const clean = name?.replace(/^(Member|Trainer):\s*/i, '') || '';
    return clean.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const formatName = (name) => {
    return name?.replace(/^(Member|Trainer):\s*/i, '') || 'Unknown';
  };

  return (
    <div className="admin-chat-page">
      <div className="chat-container-main">
        
        {/* Sidebar: Contacts */}
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2>Messages <span className="contact-count-badge">{contacts.length}</span></h2>
          </div>

          <div className="chat-contacts-list">
            {loadingContacts ? (
              <div className="chat-loading">Loading...</div>
            ) : contacts.length > 0 ? (
              contacts.map(user => (
                <div 
                  key={`${user.userId}-${user.role}`} 
                  className={`chat-contact-item ${activeUser?.userId === user.userId && activeUser?.role === user.role ? 'active' : ''}`}
                  onClick={() => {
                      setActiveUser({
                        userId: user.userId,
                        fullName: formatName(user.name || user.fullName),
                        role: user.role
                      });
                  }}
                >
                  <div className="contact-avatar">
                    {getInitials(user.name || user.fullName)}
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">{formatName(user.name || user.fullName)}</div>
                    <div className="contact-role-badge">{user.role}</div>
                  </div>
                  {user.online && <div className="online-indicator"></div>}
                </div>
              ))
            ) : (
              <div className="chat-empty">
                <Icons.MessageCircle size={40} opacity={0.3} />
                <p>No contacts found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main-area">
          {activeUser ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-header-user" style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '12px' }}>
                  <div className="contact-avatar small">
                    {getInitials(activeUser.fullName)}
                  </div>
                  <div className="contact-name" style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>{activeUser.fullName}</div>
                </div>
              </div>

              {/* Messages Content */}
              <div className="chat-messages-scroll">
                <div className="messages-inner">
                  {messages[activeUser.userId]?.length > 0 ? (
                    messages[activeUser.userId].map((msg, idx) => {
                      const isMe = msg.senderUserId === Number(myUserId);
                      return (
                        <div key={idx} className={`message-wrapper ${isMe ? 'mine' : 'theirs'}`}>
                          <div className="message-bubble">
                            <div className="message-text">{msg.text}</div>
                            <div className="message-meta">
                              {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {isMe && (
                                <span className="message-status">
                                  {msg.read ? <Icons.CheckCheck size={14} /> : <Icons.Check size={14} />}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="chat-welcome">
                      <Icons.User size={60} />
                      <h3>Conversation with {activeUser.fullName}</h3>
                      <p>This is the start of your encrypted messaging history.</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <div className="chat-input-area">
                <div className="input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button 
                    className="chat-send-btn" 
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                  >
                    <Icons.Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="chat-no-selection">
              <div className="chat-palaver-icon">
                 <Icons.MessageCircle size={100} />
              </div>
              <div className="chat-no-selection-content">
                <h2>Your GymKro Inbox</h2>
                <p>Select a trainer or member from the search to start a private conversation.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        /* ----- SCROLLBAR REDESIGN ----- */
        .chat-contacts-list::-webkit-scrollbar,
        .chat-messages-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .chat-contacts-list::-webkit-scrollbar-track,
        .chat-messages-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 0;
        }

        .chat-contacts-list::-webkit-scrollbar-thumb,
        .chat-messages-scroll::-webkit-scrollbar-thumb {
          background: var(--db-accent);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .chat-contacts-list,
        .chat-messages-scroll {
          scrollbar-width: thin;
          scrollbar-color: var(--db-accent) transparent;
        }

        /* Layout Structure */
        .admin-chat-page {
          height: calc(100vh - 100px); 
          display: flex;
          flex-direction: column;
          padding: 0;
          margin: 0;
        }

        .chat-container-main {
          display: flex;
          flex: 1;
          height: 100%;
          background: var(--db-sidebar);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--db-border);
          margin-bottom: 1rem;
        }
        
        @media (max-width: 992px) {
          .admin-chat-page {
             height: calc(100vh - 80px);
             margin: -20px; /* Offset parent padding if any */
          }
          .chat-container-main {
            border-radius: 0;
            border: none;
            margin-bottom: 0;
          }
        }

        /* SIDEBAR */
        .chat-sidebar {
          width: 320px;
          border-right: 1px solid var(--db-border);
          display: flex;
          flex-direction: column;
          background: var(--db-sidebar);
        }

        .chat-sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--db-border);
          background: rgba(var(--db-accent-rgb, 251, 146, 60), 0.03);
        }

        .chat-sidebar-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--db-text-primary);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
        }

        .contact-count-badge {
          font-size: 0.75rem;
          background: rgba(var(--db-accent-rgb, 251, 146, 60), 0.1);
          padding: 4px 10px;
          border-radius: 20px;
          color: var(--db-accent);
          border: 1px solid rgba(var(--db-accent-rgb, 251, 146, 60), 0.2);
        }

        /* CONTACT LIST */
        .chat-contacts-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem;
          padding-bottom: 80px; 
        }

        .chat-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: var(--db-text-secondary);
          opacity: 0.6;
          text-align: center;
          gap: 1rem;
        }

        .chat-empty p {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .chat-contact-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          margin-bottom: 4px;
        }

        .chat-contact-item:hover {
          background: rgba(var(--db-accent-rgb, 251, 146, 60), 0.05);
        }

        .chat-contact-item.active {
          background: rgba(var(--db-accent-rgb, 251, 146, 60), 0.1);
          border-color: rgba(var(--db-accent-rgb, 251, 146, 60), 0.2);
        }

        .contact-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, var(--db-accent), #ea580c);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 0.95rem;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .contact-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .contact-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--db-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .contact-role-badge {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--db-text-secondary);
          font-weight: 700;
          display: inline-block;
          background: rgba(0,0,0,0.05);
          padding: 2px 6px;
          border-radius: 4px;
          align-self: flex-start;
        }

        .online-indicator {
          width: 10px;
          height: 10px;
          background: #22c55e;
          border: 2px solid var(--db-sidebar);
          border-radius: 50%;
        }
        
        /* MAIN CHAT AREA */
        .chat-main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--db-bg);
          position: relative;
        }

        .chat-header {
          height: 70px;
          padding: 0 1.5rem;
          border-bottom: 1px solid var(--db-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--db-sidebar);
        }

        .chat-messages-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .messages-inner {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
          justify-content: flex-end; 
          min-height: min-content;
        }

        .message-wrapper {
          display: flex;
          width: 100%;
        }
        
        .message-bubble {
          max-width: 75%;
          padding: 0.75rem 1rem;
          border-radius: 16px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .mine { justify-content: flex-end; }
        .mine .message-bubble {
          background: var(--db-accent);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .theirs { justify-content: flex-start; }
        .theirs .message-bubble {
          background: var(--db-sidebar);
          color: var(--db-text-primary);
          border-bottom-left-radius: 4px;
          border: 1px solid var(--db-border);
        }

        .message-meta {
            font-size: 0.7rem;
            margin-top: 4px;
            opacity: 0.6;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 4px;
        }

        .chat-input-area {
          padding: 1.25rem;
          background: var(--db-sidebar);
          border-top: 1px solid var(--db-border);
        }

        .input-wrapper {
          background: var(--db-bg);
          border-radius: 12px;
          padding: 0.4rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid var(--db-border);
        }
        
        .input-wrapper input {
          flex: 1;
          padding: 0.6rem 0.8rem;
          background: transparent;
          border: none;
          color: var(--db-text-primary);
          outline: none;
          font-size: 0.95rem;
        }

        .chat-send-btn {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: var(--db-accent);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .chat-send-btn:hover {
          transform: scale(1.05);
        }

        .chat-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 992px) {
          .chat-container-main {
            flex-direction: column;
            border-radius: 0;
            border: none;
            margin: 0;
          }
          .chat-sidebar {
            width: 100%;
            flex: 1;
            display: ${activeUser ? 'none' : 'flex'};
            border-right: none;
          }
          .chat-main-area {
            width: 100%;
            flex: 1;
            display: ${activeUser ? 'flex' : 'none'};
          }
        }

        .chat-no-selection {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 2rem;
          color: var(--db-text-secondary);
          padding: 2rem;
          text-align: center;
        }

        .chat-palaver-icon {
          color: var(--db-accent);
          opacity: 0.1;
        }

        .chat-no-selection-content {
          max-width: 400px;
        }

        .chat-no-selection-content h2 {
          color: var(--db-text-primary);
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
        }

        .chat-no-selection-content p {
          font-size: 1rem;
          line-height: 1.5;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default AdminChatPage;
