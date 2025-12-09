// src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  CircularProgress,
  useTheme,
  Tabs,
  Tab,
  CardActionArea,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from "@mui/material";
import {
  People,
  FitnessCenter,
  AttachMoney,
  EventNote,
  TrendingUp,
  Warning,
  Restaurant,
  DirectionsRun,
  CheckCircle,
  Person,
  Menu as MenuIcon,
  Logout,
  Dashboard as DashboardIcon,
  Business,
  AssignmentInd,
  Email,
  Phone,
  Close,
  Cake,
  LocationOn,
  Height,
  MonitorWeight
} from "@mui/icons-material";

import { motion } from "framer-motion";
import api, { attendanceApi, userApi } from "../services/api"; // Ensure this is your configured axios instance
import { attendanceService } from "../services/attendanceService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminChatWidget from "../components/AdminChatWidget";

// --- TRANSPARENT NAV CARD COMPONENT ---
const NavCard = ({ title, description, icon: Icon, onClick, color }) => (
  <Card
    sx={{
      height: "100%",
      transition: "all 0.3s ease",
      "&:hover": { 
          borderColor: color, 
          transform: "translateY(-5px)",
          boxShadow: `0 10px 30px -10px ${color}40`
      },
    }}
  >
      <CardActionArea onClick={onClick} sx={{ height: "100%", p: 2 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
            <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                bgcolor: `${color}15`, 
                color: color,
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <Icon sx={{ fontSize: 32 }} />
            </Box>
            <Box>
                <Typography variant="h6" gutterBottom>{title}</Typography>
                <Typography variant="body2" color="text.secondary">{description}</Typography>
            </Box>
        </CardContent>
    </CardActionArea>
  </Card>
);

// --- KPI CARD COMPONENT ---
const KpiCard = ({ title, value, icon: Icon, gradient }) => (
  <Card
    sx={{
      height: "100%",
      background: gradient || "white",
      color: "white",
      position: "relative",
      overflow: "hidden",
      borderRadius: "24px",
      boxShadow: "0 10px 20px -5px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 20px 30px -10px rgba(0,0,0,0.15)",
      },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}
  >
    {/* Decorative Background Pattern */}
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.4) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.4) 0%, transparent 20%)',
        zIndex: 0
      }}
    />
    
    <CardContent sx={{ position: "relative", zIndex: 1, p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, opacity: 0.9 }}>
                <Icon sx={{ fontSize: 20 }} />
                <Typography variant="subtitle2" fontWeight={600}>
                    {title}
                </Typography>
            </Box>
            <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: '-0.5px' }}>
                {value}
            </Typography>
        </Box>
      </Box>
      
      {/* Progress bar simulation or extra info could go here */}
      <Box sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.2)', height: 6, borderRadius: 3, mt: 2 }}>
        <Box sx={{ width: '70%', bgcolor: 'white', height: '100%', borderRadius: 3 }} />
      </Box>
    </CardContent>
  </Card>
);

const WelcomeBanner = ({ fullName }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    sx={{
      p: { xs: 2, md: 3 },
      mb: 3,
      borderRadius: "24px",
      background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)", // Blue gradient
      color: "white",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 20px 25px -5px rgba(0, 123, 255, 0.3)",
    }}
  >
    <Box sx={{ position: "relative", zIndex: 1, maxWidth: "600px" }}>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
        Welcome back, {fullName || 'Admin'}! 👋
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 400, lineHeight: 1.5 }}>
        Here's what's happening in your gym today. Check out the latest attendance and revenue stats.
      </Typography>
    </Box>
    
    {/* Decorative Elements */}
    <Box
      sx={{
        position: "absolute",
        top: -60,
        right: -60,
        width: 300,
        height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
      }}
    />
    <Box
      sx={{
        position: "absolute",
        bottom: -40,
        right: 100,
        width: 150,
        height: 150,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
      }}
    />
  </Box>
);

// --- DASHBOARD PAGE ---
const AdminDashboardPage = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  // State for data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Profile dialog state
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch admin profile
  const fetchProfile = async () => {
    // Only set loading if not already loaded (to avoid flicker on initial load if we want)
    // But here we want to load on mount.
    // If we trigger from dialog, we might want spinner.
    // Let's keep it simple.
    if (!profileData) setProfileLoading(true);
    try {
      const response = await userApi.get("/admin/profile");
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      if (!profileData) setProfileLoading(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await userApi.get("/admin/dashboard/18");

        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchProfile();
  }, []);

  // Open profile dialog
  const handleProfileClick = () => {
    setProfileOpen(true);
    fetchProfile();
  };

  return (
    <Box>
      {/* TOP HEADER (Page Specific) */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <Typography variant="h4" color="text.primary" fontWeight={800}>
                Dashboard
             </Typography>
             <Chip 
               label={user?.role || "ADMIN"} 
               size="small" 
               sx={{ 
                 bgcolor: 'primary.main', 
                 color: 'white', 
                 fontWeight: 600,
                 fontSize: '0.75rem',
                 height: 24
               }} 
             />
           </Box>
           <Typography variant="body1" color="text.secondary">
              Overview of your gym's performance.
           </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton 
              sx={{ 
                bgcolor: "white", 
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                "&:hover": { bgcolor: "#f1f5f9" }
              }} 
              onClick={logout}
            >
              <Logout color="action" />
            </IconButton>
            <Tooltip 
              title={
                <Box sx={{ p: 0.5 }}>
                  <Typography variant="body2" fontWeight={600}>{user?.role || 'ADMIN'}</Typography>
                  <Typography variant="caption">{user?.email || 'admin@gym.com'}</Typography>
                </Box>
              } 
              arrow
              placement="bottom-end"
            >
              <Avatar 
                onClick={handleProfileClick}
                sx={{ bgcolor: "primary.main", width: 45, height: 45, boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)", cursor: 'pointer' }}
              >
                {profileData?.firstName ? profileData.firstName[0].toUpperCase() : (user?.firstName ? user.firstName[0].toUpperCase() : (user?.fullName ? user.fullName[0].toUpperCase() : 'A'))}
              </Avatar>
            </Tooltip>
        </Box>
      </Box>

      <WelcomeBanner fullName={user?.fullName} />

      {/* STATS OVERVIEW */}
      {dashboardData && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                title="Total Members"
                value={dashboardData.totalMembers}
                icon={People}
                gradient="linear-gradient(135deg, #007BFF 0%, #0056b3 100%)"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                title="Active Members"
                value={dashboardData.activeMembers}
                icon={CheckCircle}
                gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                title="Total Trainers"
                value={dashboardData.totalTrainers}
                icon={FitnessCenter}
                gradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                title="Trainers Present"
                value={dashboardData.trainersPresentToday} 
                icon={DirectionsRun}
                gradient="linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                />
            </Grid>
        </Grid>
      )}

      {/* NAVIGATION CARDS */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
              <NavCard 
                  title="Gym Management" 
                  description="Manage gym details, branches, and facilities." 
                  icon={Business} 
                  onClick={() => navigate('/admin/gyms')}
                  color="#6366f1"
              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <NavCard 
                  title="Trainer Management" 
                  description="Add or manage trainers and their schedules." 
                  icon={FitnessCenter} 
                  onClick={() => navigate('/admin/trainers/add')}
                  color="#ec4899"
              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <NavCard 
                  title="Member Management" 
                  description="Manage members, memberships, and plans." 
                  icon={People} 
                  onClick={() => navigate('/admin/members/add')}
                  color="#3b82f6"
              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <NavCard 
                  title="Attendance" 
                  description="View daily attendance logs and records." 
                  icon={EventNote} 
                  onClick={() => navigate('/admin/attendance')}
                  color="#f97316"
              />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
              <NavCard 
                  title="Allocations" 
                  description="Assign members to trainers." 
                  icon={AssignmentInd} 
                  onClick={() => navigate('/admin/assignments')}
                  color="#14b8a6"
              />
          </Grid>
      </Grid>



      <AdminChatWidget />

      {/* PROFILE DIALOG */}
      <Dialog 
        open={profileOpen} 
        onClose={() => setProfileOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>Admin Profile</Typography>
          <IconButton onClick={() => setProfileOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {profileLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : profileData ? (
            <Box>
              {/* Avatar and Name */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main', 
                    fontSize: '2rem',
                    mb: 2
                  }}
                >
                  {profileData.firstName ? profileData.firstName[0].toUpperCase() : (profileData.fullName ? profileData.fullName[0].toUpperCase() : 'A')}
                </Avatar>
                <Typography variant="h5" fontWeight={700}>{profileData.fullName}</Typography>
                <Chip 
                  label={profileData.role} 
                  size="small" 
                  sx={{ 
                    mt: 1,
                    bgcolor: 'primary.main', 
                    color: 'white',
                    fontWeight: 600
                  }} 
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Contact Information */}
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 2 }}>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2" fontWeight={600}>{profileData.email}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2" fontWeight={600}>{profileData.phoneNumber}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Username</Typography>
                    <Typography variant="body2" fontWeight={600}>{profileData.username}</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Personal Information */}
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 2 }}>
                Personal Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Cake sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body2" fontWeight={600}>{profileData.dateOfBirth || 'N/A'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Gender</Typography>
                    <Typography variant="body2" fontWeight={600}>{profileData.gender || 'N/A'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocationOn sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Address</Typography>
                    <Typography variant="body2" fontWeight={600}>{profileData.address || 'N/A'}</Typography>
                  </Box>
                </Box>
                {profileData.height && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Height sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Height</Typography>
                      <Typography variant="body2" fontWeight={600}>{profileData.height} cm</Typography>
                    </Box>
                  </Box>
                )}
                {profileData.weight && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <MonitorWeight sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Weight</Typography>
                      <Typography variant="body2" fontWeight={600}>{profileData.weight} kg</Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Timestamps */}
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Member Since: {new Date(profileData.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography color="text.secondary" align="center">Failed to load profile data.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminDashboardPage;
