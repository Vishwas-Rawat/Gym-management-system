import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Tabs,
  Tab,
  IconButton,
  Avatar
} from '@mui/material';
import {
  People,
  FitnessCenter,
  AttachMoney,
  EventNote,
  TrendingUp,
  Business,
  Menu as MenuIcon,
  Logout,
  AssignmentInd
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// --- THEME SETUP ---
const dashboardTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: "#007BFF" },
    secondary: { main: "#6c757d" },
    success: { main: "#27C499", light: "#D1FAE5" }, 
    warning: { main: "#F6A23E" },
    error: { main: "#E53935" },
    info: { main: "#17A2B8" },
    background: { default: "#F4F6F9", paper: "#FFFFFF" },
    text: { primary: "#1F2937", secondary: "#6B7280" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          border: "1px solid #E5E7EB",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
        },
        containedPrimary: {
          background: "#007BFF",
          "&:hover": { background: "#0056b3" },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
            fontSize: '0.75rem',
            minHeight: 64
        }
      }
    }
  },
});

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  
  // Determine active tab based on path
  const getActiveTab = (path) => {
      if (path.includes('/admin/gyms')) return 1;
      if (path.includes('/admin/members')) return 2;
      if (path.includes('/admin/trainers')) return 3;
      if (path.includes('/admin/attendance')) return 4;
      if (path.includes('/admin/assignments')) return 5;
      if (path.includes('/admin/dashboard')) return 0;
      return 0; // Default
  };

  const [currentTab, setCurrentTab] = useState(getActiveTab(location.pathname));

  useEffect(() => {
      setCurrentTab(getActiveTab(location.pathname));
  }, [location.pathname]);

  const handleNav = (newValue) => {
      setCurrentTab(newValue);
      switch(newValue) {
          case 0: navigate('/admin/dashboard'); break;
          case 1: navigate('/admin/gyms'); break;
          case 2: navigate('/admin/members/add'); break; 
          case 3: navigate('/admin/trainers/add'); break; 
          case 4: navigate('/admin/attendance'); break; 
          case 5: navigate('/admin/assignments'); break;
          default: navigate('/admin/dashboard');
      }
  };

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      
        {/* MOBILE TOP NAVBAR */}
        <AppBar position="fixed" color="default" sx={{ display: { lg: 'none', xs: 'block' }, top: 0, bottom: 'auto', zIndex: 1201, bgcolor: 'white', boxShadow: 1 }}>
          <Tabs
            value={currentTab}
            onChange={(e, val) => handleNav(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            textColor="primary"
            indicatorColor="primary"
            sx={{ 
                minHeight: 64, 
                '& .MuiTabs-flexContainer': { justifyContent: 'center' } 
            }}
          >
              <Tab icon={<TrendingUp />} label="Home" iconPosition="top" value={0} />
              <Tab icon={<Business />} label="Gym" iconPosition="top" value={1} />
              <Tab icon={<People />} label="Member" iconPosition="top" value={2} />
              <Tab icon={<FitnessCenter />} label="Trainer" iconPosition="top" value={3} />
              <Tab icon={<EventNote />} label="Attendance" iconPosition="top" value={4} />
              <Tab icon={<AssignmentInd />} label="Assignments" iconPosition="top" value={5} />
          </Tabs>
        </AppBar>
        
        {/* SIDEBAR - DESKTOP HOVERABLE */}
        <Box
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
          sx={{
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            borderRight: "1px solid #E5E7EB",
            bgcolor: "white",
            position: "fixed",
            height: "100vh",
            width: isSidebarHovered ? 280 : 80, // Dynamic width
            transition: "width 0.3s ease", // Smooth transition
            zIndex: 1200,
            overflow: "hidden",
            boxShadow: isSidebarHovered ? "4px 0 24px rgba(0,0,0,0.1)" : "1px 0 0 rgba(0,0,0,0.05)"
          }}
        >
          <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: isSidebarHovered ? "flex-start" : "center", height: 80, transition: "all 0.3s ease" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                flexShrink: 0
              }}
            >
              <FitnessCenter />
            </Box>
            <Typography 
                variant="h6" 
                fontWeight={800} 
                color="primary.main" 
                sx={{ 
                    ml: 2, 
                    opacity: isSidebarHovered ? 1 : 0, 
                    width: isSidebarHovered ? 'auto' : 0,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden' 
                }}
            >
                GymAdmin
            </Typography>
          </Box>
          
          <Box sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
            {[
                { text: "Dashboard", icon: <TrendingUp />, path: '/admin/dashboard', id: 0 },
                { text: "Gyms", icon: <Business />, path: '/admin/gyms', id: 1 },
                { text: "Members", icon: <People />, path: '/admin/members/add', id: 2 },
                { text: "Trainers", icon: <FitnessCenter />, path: '/admin/trainers/add', id: 3 },
                { text: "Attendance", icon: <EventNote />, path: '/admin/attendance', id: 4 },
                { text: "Assignments", icon: <AssignmentInd />, path: '/admin/assignments', id: 5 }
            ].map((item) => (
              <Box
                key={item.text}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: "12px",
                  cursor: "pointer",
                  color: currentTab === item.id ? "primary.main" : "text.secondary",
                  bgcolor: currentTab === item.id ? "primary.50" : "transparent",
                  fontWeight: currentTab === item.id ? 600 : 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isSidebarHovered ? "flex-start" : "center",
                  gap: 0,
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  "&:hover": { 
                    bgcolor: "primary.50", 
                    color: "primary.main",
                    transform: isSidebarHovered ? "translateX(4px)" : "none"
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, flexShrink: 0 }}>
                    {item.icon}
                </Box>
                <Typography sx={{ 
                    ml: 2, 
                    opacity: isSidebarHovered ? 1 : 0, 
                    width: isSidebarHovered ? 'auto' : 0, 
                    overflow: 'hidden',
                    transition: 'all 0.3s ease' 
                }}>
                    {item.text}
                </Typography>
              </Box>
            ))}
          </Box>

           {/* LOGOUT BUTTON AT BOTTOM */}
           <Box sx={{ p: 1.5, borderTop: "1px solid #E5E7EB" }}>
              <Box
                onClick={logout}
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  cursor: "pointer",
                  color: "error.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: isSidebarHovered ? "flex-start" : "center",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: "error.50" }
                }}
              >
                 <Logout />
                 <Typography sx={{ 
                    ml: 2, 
                    opacity: isSidebarHovered ? 1 : 0, 
                    width: isSidebarHovered ? 'auto' : 0,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    fontWeight: 600
                }}>
                    Logout
                </Typography>
              </Box>
           </Box>
        </Box>

        {/* MAIN CONTENT */}
        <Box sx={{ flexGrow: 1, ml: { lg: "80px", xs: 0 }, mt: { xs: 8, lg: 0 }, p: { xs: 2, md: 4 } }}>
           <Outlet />
        </Box>

      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
