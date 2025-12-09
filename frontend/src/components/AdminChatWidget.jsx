import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Paper, TextField, IconButton, Typography,
  List, ListItem, ListItemAvatar, ListItemText, Avatar,
  Badge, Fab, InputAdornment, CircularProgress, Divider
} from '@mui/material';
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
  const { isConnected, sendMessage, messages, loadHistory, typingStatus, userId: myUserId } = useChat();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null); // { userId, fullName, role }
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [inputText, setInputText] = useState("");
  
  const chatEndRef = useRef(null);

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

  // Search Users
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await chatApi.get(`/chat/search?query=${searchQuery}`);
        const users = response.data || [];

        // Map to widget format
        const formattedResults = users.map(u => ({
            userId: u.userId,
            fullName: `${u.firstName} ${u.lastName}`,
            role: u.role,
            avatar: null 
        }));

        setSearchResults(formattedResults);

      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

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
      {/* FAB */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          zIndex: 1300,
          boxShadow: '0 4px 20px rgba(0, 123, 255, 0.4)'
        }}
      >
        {isOpen ? <Close /> : <ChatIcon />}
      </Fab>

      {/* CHAT WINDOW */}
      {isOpen && (
        <Paper
          elevation={10}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 30,
            width: 360,
            height: 500,
            zIndex: 1300,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'background.default'
          }}
        >
          {/* HEADER */}
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
            {activeUser && (
                <IconButton size="small" onClick={() => setActiveUser(null)} sx={{ color: 'white', mr: 1 }}>
                    <ArrowBack />
                </IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                {activeUser ? activeUser.fullName : "Messages"}
            </Typography>
            {!activeUser && (
                 <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                    <Close />
                </IconButton>
            )}
          </Box>

          {/* VIEW: USER LIST / SEARCH */}
          {!activeUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ p: 2, bgcolor: 'white' }}>
                 <TextField
                    fullWidth
                    size="small"
                    placeholder="Search Trainer or Member..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Search color="action" /></InputAdornment>
                    }}
                 />
              </Box>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: 'white' }}>
                 {isSearching ? (
                     <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={24} /></Box>
                 ) : searchResults.length > 0 ? (
                     <List>
                        {searchResults.map((user) => (
                            <ListItem key={user.userId} button onClick={() => setActiveUser(user)}>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: user.role === 'TRAINER' ? 'secondary.main' : 'primary.main' }}>
                                        {user.fullName ? user.fullName[0] : <Person />}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={user.fullName} 
                                    secondary={user.role} 
                                    primaryTypographyProps={{ fontWeight: 600 }}
                                />
                            </ListItem>
                        ))}
                     </List>
                 ) : (
                     <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                        <Typography variant="body2">
                            {searchQuery ? "No users found." : "Search to start a chat."}
                        </Typography>
                     </Box>
                 )}
              </Box>
            </Box>
          )}

          {/* VIEW: CHAT ROOM */}
          {activeUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#f0f2f5' }}>
                {/* MESSAGES */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {messages[activeUser.userId]?.map((msg, index) => {
                        const isMe = msg.senderUserId === Number(myUserId);
                        return (
                            <Box 
                                key={msg.messageId || index} 
                                sx={{ 
                                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                }}
                            >
                                <Paper sx={{ 
                                    p: 1.5, 
                                    px: 2,
                                    borderRadius: 3, 
                                    bgcolor: isMe ? 'primary.main' : 'white',
                                    color: isMe ? 'white' : 'text.primary',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}>
                                    <Typography variant="body2">{msg.text}</Typography>
                                </Paper>
                                <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.7rem' }}>
                                    {/* Format Date if available */}
                                </Typography>
                            </Box>
                        );
                    })}
                    <div ref={chatEndRef} />
                </Box>

                {/* INPUT */}
                <Box sx={{ p: 1.5, bgcolor: 'white', borderTop: '1px solid #e0e0e0', display: 'flex', gap: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        sx={{ bgcolor: '#f8f9fa' }}
                    />
                    <IconButton color="primary" onClick={handleSend} disabled={!inputText.trim()}>
                        <Send />
                    </IconButton>
                </Box>
            </Box>
          )}
        </Paper>
      )}
    </>
  );
};

export default AdminChatWidget;
