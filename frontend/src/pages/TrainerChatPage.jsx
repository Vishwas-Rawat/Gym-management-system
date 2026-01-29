import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useMemberRegistration } from '../context/MemberRegistrationContext';
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

const TrainerChatPage = () => {
  const { isConnected, sendMessage, messages, loadHistory, userId: myUserId } = useChat();
  const { fetchMembers } = useMemberRegistration();
  
  const [activeMember, setActiveMember] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [inputText, setInputText] = useState("");
  
  const messagesEndRef = useRef(null);

  // Fetch Contacts (Members) on Mount
  useEffect(() => {
    const loadContacts = async () => {
      setLoadingContacts(true);
      try {
        const membersData = await fetchMembers();
        // Transform members data to match contact structure if needed, or just use as is
        // member structure usually has: memberId, fullName, email, userId (sometimes)
        setContacts(membersData || []);
      } catch (err) {
        console.error("Failed to fetch contacts", err);
      } finally {
        setLoadingContacts(false);
      }
    };
    loadContacts();
  }, [fetchMembers]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeMember]);

  // Load history when user changes
  useEffect(() => {
    if (activeMember) {
      // Logic to get appropriate user ID for chat. 
      // Sometimes memberId is different from userId. Chat expects userId usually.
      // Based on TrainerDashboard, it tries member.userId || member.memberId
      const targetId = activeMember.userId || activeMember.memberId;
      loadHistory(targetId);
    }
  }, [activeMember, loadHistory]);

  const handleSend = () => {
    if (!inputText.trim() || !activeMember) return;
    const targetId = activeMember.userId || activeMember.memberId;
    sendMessage(targetId, inputText);
    setInputText("");
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  // Helper to safely get the ID for messages object key
  const getTargetId = (member) => member.userId || member.memberId;

  return (
    <div className="trainer-chat-page" style={{ height: 'calc(100vh - 140px)', background: 'var(--db-sidebar)', borderRadius: '20px', display: 'flex', overflow: 'hidden', border: '1px solid var(--db-border)' }}>
        
        {/* Sidebar: Contacts */}
        <div className="chat-sidebar" style={{ width: '320px', borderRight: '1px solid var(--db-border)', display: 'flex', flexDirection: 'column', background: 'rgba(15, 20, 32, 0.95)' }}>
          <div className="chat-sidebar-header" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Messages <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px', color: '#aaa' }}>{contacts.length}</span>
            </h2>
          </div>

          <div className="chat-contacts-list" style={{ flex: 1, overflowY: 'auto', padding: '1rem', paddingBottom: '80px' }}>
            {loadingContacts ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>Loading members...</div>
            ) : contacts.length > 0 ? (
              contacts.map(member => (
                <div 
                  key={member.memberId} 
                  onClick={() => setActiveMember(member)}
                  style={{ 
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px', cursor: 'pointer', marginBottom: '4px', transition: 'all 0.2s ease',
                      background: activeMember?.memberId === member.memberId ? 'linear-gradient(90deg, rgba(81, 207, 102, 0.15), transparent)' : 'transparent',
                      borderLeft: activeMember?.memberId === member.memberId ? '3px solid var(--db-green)' : '3px solid transparent'
                  }}
                >
                  <div style={{ width: '42px', height: '42px', background: activeMember?.memberId === member.memberId ? 'var(--db-green)' : 'linear-gradient(135deg, #334155, #1e293b)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                    {getInitials(member.fullName)}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: activeMember?.memberId === member.memberId ? 'var(--db-green)' : '#94a3b8' }}>Member</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', opacity: 0.5, color: '#aaa', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Icons.MessageCircle size={40} />
                <p>No assigned members found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)', position: 'relative' }}>
          {activeMember ? (
            <>
              {/* Chat Header */}
              <div style={{ height: '70px', padding: '0 2rem', borderBottom: '1px solid var(--db-border)', display: 'flex', alignItems: 'center', background: 'rgba(20, 25, 40, 0.8)', backdropFilter: 'blur(10px)', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', background: 'var(--db-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.8rem' }}>
                    {getInitials(activeMember.fullName)}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>{activeMember.fullName}</div>
              </div>

              {/* Messages Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, justifyContent: 'flex-end', minHeight: 'min-content' }}>
                  {messages[getTargetId(activeMember)]?.length > 0 ? (
                    messages[getTargetId(activeMember)].map((msg, idx) => {
                      const isMe = msg.senderUserId === Number(myUserId);
                      return (
                        <div key={idx} style={{ display: 'flex', width: '100%', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                          <div style={{ 
                              maxWidth: '65%', padding: '0.8rem 1.2rem', borderRadius: '18px', fontSize: '0.95rem', lineHeight: 1.5,
                              background: isMe ? 'var(--db-green)' : '#1e293b',
                              color: isMe ? '#fff' : '#f8fafc',
                              borderBottomRightRadius: isMe ? '4px' : '18px',
                              borderBottomLeftRadius: isMe ? '18px' : '4px',
                              border: isMe ? 'none' : '1px solid rgba(255,255,255,0.05)'
                          }}>
                            <div>{msg.text}</div>
                            <div style={{ fontSize: '0.7rem', marginTop: '4px', opacity: 0.7, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', color: 'inherit' }}>
                              {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {isMe && (
                                <span>{msg.read ? <Icons.CheckCheck size={14} /> : <Icons.Check size={14} />}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.6, color: '#aaa', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <Icons.User size={60} />
                      <h3>Conversation with {activeMember.fullName}</h3>
                      <p>Start messaging your member.</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <div style={{ padding: '1.5rem', background: 'rgba(15, 20, 32, 0.95)', borderTop: '1px solid var(--db-border)' }}>
                <div style={{ background: '#1e293b', borderRadius: '12px', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid transparent' }}>
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    style={{ flex: 1, padding: '0.8rem', background: 'transparent', border: 'none', color: '#fff', outline: 'none', fontSize: '1rem' }}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'var(--db-green)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s', opacity: inputText.trim() ? 1 : 0.5 }}
                  >
                    <Icons.Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                height: '100%', gap: '2.5rem', color: '#94a3b8', padding: '2rem', textAlign: 'left' 
            }}>
              <div style={{ color: 'rgba(255, 255, 255, 0.08)', filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.05))' }}>
                 <Icons.MessageCircle size={100} />
              </div>
              <div style={{ borderLeft: '4px solid var(--db-accent)', paddingLeft: '2rem', maxWidth: '450px' }}>
                <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, margin: '0 0 1rem 0', letterSpacing: '-0.5px', lineHeight: 1 }}>
                  Your Messages
                </h2>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.6, margin: 0, opacity: 0.9, fontWeight: 500 }}>
                  Select a member from the sidebar to view your encrypted messaging history and start a conversation.
                </p>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default TrainerChatPage;
