import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import "./ChatComponent.css";

const MemberChatWidget = ({ currentUserId, token, theme = "dark" }) => {
  const {
    messages: allMessages,
    sendMessage,
    loadHistory,
    isConnected,
    connectionStatus: chatConnStatus, // Avoid name clash if any
  } = useChat();

  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  const getInitials = (name) => {
    const clean = name?.replace(/^(Member|Trainer|Admin):\s*/i, "") || "";
    return clean.charAt(0).toUpperCase() || "?";
  };

  const formatName = (name) => {
    return name?.replace(/^(Member|Trainer|Admin):\s*/i, "") || "Unknown";
  };

  // Using relative URLs to leverage Vite Proxy (targeting localhost:8085)
  const API_URL = "";

  // 1. Initial Load
  useEffect(() => {
    if (token) {
      fetchContacts();
    }
  }, [token]);

  // 2. Load History when user selected
  useEffect(() => {
    if (selectedUser) {
      loadHistory(selectedUser.userId);
    }
  }, [selectedUser]);

  // 3. Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, selectedUser]);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const response = await fetch(`${API_URL}/chat/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data || []);
      } else {
        console.error("Contacts fetch failed:", await response.text());
      }
    } catch (e) {
      console.error("Fetch contacts error:", e);
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await sendMessage(selectedUser.userId, newMessage);
      setNewMessage("");
    } catch (err) {
      console.error("Send failed:", err);
      alert("Send error: " + err.message);
    }
  };

  const currentChatMessages = selectedUser
    ? allMessages[selectedUser.userId] || []
    : [];

  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowMobileChat(true);
  };

  const handleMobileBack = () => {
    setShowMobileChat(false);
  };

  return (
    <div
      className={`member-chat-wrapper ${theme} ${showMobileChat ? "show-chat" : "show-list"}`}
    >
      {/* Sidebar: Contacts */}
      <div className="chat-sidebar">
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid var(--db-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "1.1rem",
              color: "var(--db-text-primary)",
            }}
          >
            Messages
          </h3>
          <button
            onClick={fetchContacts}
            title="Refresh Contacts"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--db-text-secondary)",
              fontSize: "1.2rem",
            }}
          >
            ↻
          </button>
        </div>

        <div
          style={{
            padding: "0.5rem 1.5rem",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: isConnected ? "var(--db-success)" : "var(--db-error)",
            }}
          />
        </div>

        <div style={{ overflowY: "auto", flex: 1 }}>
          {loadingContacts && (
            <div style={{ padding: "1rem", color: "#888" }}>
              Loading contacts...
            </div>
          )}

          {!loadingContacts && contacts.length === 0 && (
            <div style={{ padding: "1rem", color: "#888", fontSize: "0.9rem" }}>
              No contacts assigned yet.
            </div>
          )}

          {contacts.map((user) => (
            <div
              key={user.userId}
              onClick={() => handleUserSelect(user)}
              style={{
                padding: "1rem 1.5rem",
                cursor: "pointer",
                background:
                  selectedUser?.userId === user.userId
                    ? "rgba(255,255,255,0.05)"
                    : "transparent",
                borderBottom: "1px solid var(--db-border-subtle)",
                display: "flex",
                alignItems: "center",
                gap: "0.8rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--db-blue)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                {getInitials(user.name)}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: "var(--db-text-primary)",
                    fontSize: "0.95rem",
                  }}
                >
                  {formatName(user.name)}
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--db-text-secondary)",
                  }}
                >
                  {user.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main-area">
        {selectedUser ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "1rem 1.5rem",
                borderBottom: "1px solid var(--db-border)",
                background: "rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  className="chat-mobile-back-btn"
                  onClick={handleMobileBack}
                >
                  <ArrowBackIcon />
                </button>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "var(--db-text-primary)",
                    }}
                  >
                    {formatName(selectedUser.name)}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {currentChatMessages.map((msg, idx) => {
                const isMine =
                  Number(msg.senderUserId) === Number(currentUserId);
                return (
                  <div
                    key={msg.messageId || idx}
                    style={{
                      alignSelf: isMine ? "flex-end" : "flex-start",
                      maxWidth: "70%",
                      background: isMine
                        ? "var(--db-blue)"
                        : "var(--db-bg-elevated)",
                      color: isMine ? "#fff" : "var(--db-text-primary)",
                      padding: "0.8rem 1.2rem",
                      borderRadius: isMine
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      position: "relative",
                    }}
                  >
                    <div style={{ fontSize: "0.95rem", lineHeight: "1.5" }}>
                      {msg.text || msg.content}
                    </div>
                    <div
                      style={{
                        fontSize: "0.65rem",
                        marginTop: "0.4rem",
                        opacity: 0.7,
                        textAlign: "right",
                      }}
                    >
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Now"}
                      {isMine && (msg.read ? " ✓✓" : " ✓")}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: "1.5rem",
                borderTop: "1px solid var(--db-border)",
                background: "rgba(0,0,0,0.1)",
              }}
            >
              <form
                onSubmit={handleSendMessage}
                style={{ display: "flex", gap: "1rem" }}
              >
                <input
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--db-border)",
                    borderRadius: "12px",
                    padding: "1rem",
                    color: "var(--db-text-primary)",
                  }}
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="db-btn db-btn-primary"
                  disabled={!newMessage.trim() || !isConnected}
                  style={{
                    borderRadius: "12px",
                    padding: "0 2rem",
                    opacity: isConnected ? 1 : 0.5,
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--db-text-secondary)",
            }}
          >
            <div style={{ fontSize: "4rem", opacity: 0.2 }}>💬</div>
            <h3>Select a contact to chat</h3>
            <p>Private, end-to-end encrypted messaging.</p>
            {error && (
              <div style={{ color: "var(--db-error)", marginTop: "1rem" }}>
                System Error: {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberChatWidget;
