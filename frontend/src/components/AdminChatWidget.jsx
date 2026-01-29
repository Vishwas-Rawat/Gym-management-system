  // MUI Components removed
  // Icons kept as they are SVGs

import {
  Chat as ChatIcon,
  Close,
  Search,
  Send,
  ArrowBack,
  Person
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';
import { userApi, chatApi } from '../services/api';

const AdminChatWidget = () => {
  const { isConnected, sendMessage, messages, loadHistory, userId: myUserId } = useChat();

  const formatName = (name) => {
    return name?.replace(/^(Member|Trainer):\s*/i, '') || 'Unknown';
  };
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null); // { userId, fullName, role }
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [inputText, setInputText] = useState("");
  
  const chatEndRef = useRef(null);
  const contactsEndRef = useRef(null);

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
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeUser, isOpen]);

  // Load history when entering a chat
  useEffect(() => {
    if (activeUser && isOpen) {
        loadHistory(activeUser.userId);
    }
  }, [activeUser, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim() || !activeUser) return;
    await sendMessage(activeUser.userId, inputText);
    setInputText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isConnected) {
     // Optional: Show connecting state or hidden
     // return null; 
  }

  return (
    <>
      <style>{`
        .chat-widget-fab {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--db-blue, #4dabf7);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 123, 255, 0.4);
          cursor: pointer;
          z-index: 1300;
          border: none;
          transition: transform 0.2s;
        }
        .chat-widget-fab:hover {
          transform: scale(1.1);
        }
        
        .chat-widget-window {
          position: fixed;
          bottom: 100px;
          right: 30px;
          width: 360px;
          height: 500px;
          z-index: 1300;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .chat-widget-header {
          padding: 1rem;
          background: var(--db-blue, #4dabf7);
          color: white;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-weight: 600;
        }
        
        .chat-header-btn {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
        }
        .chat-header-btn:hover {
          background: rgba(255,255,255,0.2);
        }

        .chat-widget-body {
          flex: 1;
          background: #fff;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .contact-list-container {
          flex: 1;
          overflow-y: auto;
          padding: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .contact-item {
          padding: 0.8rem 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid rgba(0,0,0,0.03);
        }
        .contact-item:hover {
          background: #f8f9fa;
        }
        
        .contact-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
        }
        .avatar-trainer { background: var(--db-accent, #fb923c); }
        .avatar-member { background: var(--db-blue, #4dabf7); }

        .contact-info {
          display: flex;
          flex-direction: column;
        }
        .contact-name {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 0.95rem;
        }
        .contact-role {
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
        }

        /* CUSTOM SCROLLBAR FOR WIDGET */
        .contact-list-container::-webkit-scrollbar,
        .chat-messages-area::-webkit-scrollbar {
          width: 10px;
        }
        .contact-list-container::-webkit-scrollbar-track,
        .chat-messages-area::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .contact-list-container::-webkit-scrollbar-thumb,
        .chat-messages-area::-webkit-scrollbar-thumb {
          background: #fb923c; /* Visible Orange */
          border-radius: 5px;
          border: 2px solid #f1f1f1;
        }
        .contact-list-container::-webkit-scrollbar-thumb:hover,
        .chat-messages-area::-webkit-scrollbar-thumb:hover {
          background: #f97316;
        }

        .chat-messages-area {
          flex: 1;
          background: #f0f2f5;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .message-bubble {
          max-width: 80%;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.4;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .msg-me {
          align-self: flex-end;
          background: var(--db-blue, #4dabf7);
          color: white;
          border-bottom-right-radius: 2px;
        }
        .msg-other {
          align-self: flex-start;
          background: white;
          color: #333;
          border-bottom-left-radius: 2px;
        }

        .chat-input-area {
          padding: 0.8rem;
          background: white;
          border-top: 1px solid #eee;
          display: flex;
          gap: 0.5rem;
        }
        .chat-input {
          flex: 1;
          padding: 0.6rem 1rem;
          border-radius: 20px;
          border: 1px solid #e0e0e0;
          background: #f8f9fa;
          outline: none;
          font-size: 0.9rem;
        }
        .chat-input:focus {
          border-color: var(--db-blue, #4dabf7);
          background: #fff;
        }
        .send-btn {
          background: var(--db-blue, #4dabf7);
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .send-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .contact-count-badge {
          background: #ff5252;
          color: white;
          font-size: 0.7rem;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: 0.5rem;
        }
      `}</style>

      {/* FAB */}
      <button 
        className="chat-widget-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        {isOpen ? <Close /> : <ChatIcon />}
      </button>

      {/* WIDGET WINDOW */}
      {isOpen && (
        <div className="chat-widget-window">
          {/* HEADER */}
          <div className="chat-widget-header">
            {activeUser ? (
              <>
                <button className="chat-header-btn" onClick={() => setActiveUser(null)}>
                  <ArrowBack />
                </button>
                <div style={{ flex: 1 }}>{activeUser.fullName}</div>
              </>
            ) : (
              <>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    Messages 
                    <span className="contact-count-badge">{contacts.length}</span>
                </div>
                <button className="chat-header-btn" onClick={() => setIsOpen(false)}>
                  <Close />
                </button>
              </>
            )}
          </div>

          {/* BODY */}
          <div className="chat-widget-body">
            {!activeUser ? (
              /* CONTACT LIST */
              <div className="contact-list-container">
                {loadingContacts ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <div className="spinner" style={{ width: 24, height: 24, border: '2px solid #ccc', borderTopColor: '#333', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  </div>
                ) : contacts.length > 0 ? (
                  <>
                  {contacts.map((user, idx) => (
                    <div 
                      key={`${user.userId}-${user.role}-${idx}`} 
                      className="contact-item"
                      onClick={() => setActiveUser({
                        userId: user.userId,
                        fullName: formatName(user.name || user.fullName),
                        role: user.role
                      })}
                    >
                      <div className={`contact-avatar ${user.role === 'TRAINER' ? 'avatar-trainer' : 'avatar-member'}`}>
                        {formatName(user.name || user.fullName)[0] || '?'}
                      </div>
                      <div className="contact-info">
                        <span className="contact-name">{formatName(user.name || user.fullName)}</span>
                        <span className="contact-role">{user.role}</span>
                      </div>
                    </div>
                  ))}
                  {/* Spacer to ensure last item is scrollable */}
                  <div style={{ height: '20px' }} ref={contactsEndRef}></div> 
                  </>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
                    No contacts found.
                  </div>
                )}
              </div>
            ) : (
              /* CHAT ROOM */
              <>
                <div className="chat-messages-area">
                  {messages[activeUser.userId]?.map((msg, index) => {
                    const isMe = msg.senderUserId === Number(myUserId);
                    return (
                      <div key={index} className={`message-bubble ${isMe ? 'msg-me' : 'msg-other'}`}>
                        {msg.text}
                      </div>
                    );
                  })}
                  <div ref={chatEndRef}></div>
                </div>

                <div className="chat-input-area">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button className="send-btn" onClick={handleSend} disabled={!inputText.trim()}>
                    <Send fontSize="small" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminChatWidget;
