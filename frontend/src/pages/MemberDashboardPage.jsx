// src/pages/MemberDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Avatar,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  AppBar,
  Tabs,
  Tab,
  Chip,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Restaurant,
  Person,
  Logout,
  FitnessCenter,
  Home,
  TrendingUp,
  EventNote,
  LocalFireDepartment,
  EmojiEvents,
  Security,
  CheckCircle,
  ArrowBack,
  Assignment,
  Edit,
  Delete,
  Cancel,
  Send,
  Email,
  Phone,
  LocationOn,
  Cake,
  MonitorWeight,
  Height,
  Close
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import DietPlanView from '../components/DietPlanView';
import DietLogger from '../components/DietLogger';
import WorkoutLogger from '../components/WorkoutLogger';
import { getMyDietPlan } from '../services/dietService';
import { 
    getTodayActivity, 
    getMyProfile, 
    getMyWorkoutPlan, 
    getAttendanceStreak,
    getAttendanceHistory,
    getAttendanceMaxStreak,
    getHasTrainer,
    getAvailableTrainers,
    getTodayWorkoutLogs,
    deleteWorkoutLog,
    updateWorkoutLog,
    requestDietPlan,
    requestWorkoutPlan
} from '../services/memberService';
import WorkoutPlanView from '../components/WorkoutPlanView';
import AttendanceWidget from '../components/AttendanceWidget';

// --- THEME ---
const dashboardTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: "#007BFF" }, 
    secondary: { main: "#6c757d" },
    success: { main: "#27C499" }, 
    warning: { main: "#F6A23E" }, 
    error: { main: "#E53935" },
    background: { default: "#F4F6F9", paper: "#FFFFFF" },
    text: { primary: "#1F2937", secondary: "#6B7280" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "none",
          border: "1px solid #CED4DA",
          backgroundColor: "transparent"
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
        root: { borderRadius: 10, textTransform: 'none', fontWeight: 600, boxShadow: "none" },
      },
    },
  },
});

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

const WelcomeBanner = ({ name }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    sx={{
      p: { xs: 3, md: 4 },
      mb: 4,
      borderRadius: "24px",
      background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)",
      color: "white",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 10px 25px -5px rgba(0, 123, 255, 0.4)",
    }}
  >
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Welcome back, {name || 'Member'}! 🚀
      </Typography>
      <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
        Select an activity below to get started.
      </Typography>
    </Box>
    <Box sx={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
  </Box>
);

const MemberDashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tabHash = { 0: 'dashboard', 1: 'diet-plan', 2: 'workout-plan', 3: 'attendance', 4: 'profile', 5: 'my-diet', 6: 'my-workout' };
  
  const handleTabNav = (val) => {
      const hash = tabHash[val] || 'dashboard';
      navigate(`#${hash}`);
  };

  useEffect(() => {
      const hash = location.hash.replace('#', '');
      const entry = Object.entries(tabHash).find(([k, v]) => v === hash);
      if (entry) {
          setCurrentTab(Number(entry[0]));
      } else {
          setCurrentTab(0);
      }
  }, [location.hash]);
  // State for Sidebar Hover
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [currentTab, setCurrentTab] = useState(0); 
  // 0: Dashboard (Home), 1: Diet, 2: Workout, 3: Attendance, 4: Profile, 5: Security (Mock)
  
  const [isLoading, setIsLoading] = useState(false);
  const [todayActivity, setTodayActivity] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  
  // New State for Trainer Logic
  const [hasTrainer, setHasTrainer] = useState(true); 
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [todayWorkoutLogs, setTodayWorkoutLogs] = useState([]);

  // Edit/Delete State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  // --- REQUEST PLAN LOGIC ---
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  const handleRequestSubmit = async () => {
        const isDiet = currentTab === 1;
        const isWorkout = currentTab === 2;
        if (!isDiet && !isWorkout) return;

        let targetTrainerId = profile?.assignedTrainer?.trainerId || profile?.assignedTrainer?.id || profile?.trainerId;
        
        // Fallback to plan data if available
        if (!targetTrainerId) {
            if (isDiet && dietPlan?.trainerId) targetTrainerId = dietPlan.trainerId;
            if (isWorkout && currentPlan?.trainerId) targetTrainerId = currentPlan.trainerId;
        }

        if (!targetTrainerId) {
            setFeedback({ open: true, message: 'Trainer information not available. Please contact support.', severity: 'error' });
            return;
        }

        try {
            if (isDiet) {
                await requestDietPlan({ trainerId: targetTrainerId, message: requestMessage });
            } else {
                 await requestWorkoutPlan({ trainerId: targetTrainerId, message: requestMessage });
            }
            setFeedback({ open: true, message: 'Request sent successfully!', severity: 'success' });
            setRequestOpen(false);
            setRequestMessage('');
        } catch (error) {
            setFeedback({ open: true, message: 'Failed to send request.', severity: 'error' });
        }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const profileData = await getMyProfile();
        console.log("DEBUG: profileData", profileData); // Debug info
        setProfile(profileData);

        // Check Trainer Status logic
        try {
            const trainerStatus = await getHasTrainer();
            console.log("DEBUG: hasTrainer", trainerStatus); // Debug info
            setHasTrainer(trainerStatus);
            if (!trainerStatus) {
                 const trainers = await getAvailableTrainers();
                 setAvailableTrainers(trainers || []);
            }
        } catch (e) { 
            console.error("Trainer check failed", e);
            setHasTrainer(false); 
        }

        if (currentTab === 1) { // Diet
            const plan = await getMyDietPlan();
            console.log("DEBUG: Diet Plan", plan); // Debug info
            setDietPlan(plan);
        } else if (currentTab === 2) { // Workout
            const plan = await getMyWorkoutPlan();
            console.log("DEBUG: Workout Plan", plan); // Debug info
            setCurrentPlan(plan);
        } else if (currentTab === 3) { // Attendance
             const streakData = await getAttendanceStreak();
             const streakValue = (typeof streakData === 'object' && streakData !== null) ? (streakData.currentStreak || 0) : (Number(streakData) || 0);
             setStreak(streakValue);
             const maxStreakData = await getAttendanceMaxStreak();
             setMaxStreak(Number(maxStreakData) || 0);
             const history = await getAttendanceHistory();
             setAttendanceHistory(history || []);
        } else if (currentTab === 6) { // Create Own Workout - Log
             const logs = await getTodayWorkoutLogs();
             setTodayWorkoutLogs(logs || []);
        }
        
        if (currentTab === 0) {
            const activity = await getTodayActivity();
            setTodayActivity(activity);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentTab]);

  const handleRefresh = async () => {
     console.log("Refreshing dashboard data...");
     if (currentTab === 0) {
        const activity = await getTodayActivity();
        setTodayActivity(activity);
        const streakData = await getAttendanceStreak();
        const streakValue = (typeof streakData === 'object' && streakData !== null) ? (streakData.currentStreak || 0) : (Number(streakData) || 0);
        setStreak(streakValue);
     } else if (currentTab === 1) {
        const plan = await getMyDietPlan();
        setDietPlan(plan);
     } else if (currentTab === 2) {
        const plan = await getMyWorkoutPlan();
        setCurrentPlan(plan);
     } else if (currentTab === 3) {
        const streakData = await getAttendanceStreak();
        const streakValue = (typeof streakData === 'object' && streakData !== null) ? (streakData.currentStreak || 0) : (Number(streakData) || 0);
        setStreak(streakValue);
        const maxStreakData = await getAttendanceMaxStreak();
        setMaxStreak(Number(maxStreakData) || 0);
        const history = await getAttendanceHistory();
        setAttendanceHistory(history || []);
     } else if (currentTab === 6) {
        const logs = await getTodayWorkoutLogs();
        setTodayWorkoutLogs(logs || []);
     }
  };

  const handleDeleteLog = async (logId) => {
      if (window.confirm("Are you sure you want to delete this log?")) {
          try {
              await deleteWorkoutLog(logId);
              handleRefresh();
          } catch (e) { console.error("Delete failed", e); }
      }
  };

  const handleEditClick = (log) => {
      setEditingLog({ ...log }); 
      setEditDialogOpen(true);
  };

  const handleUpdateSubmit = async () => {
      if (!editingLog) return;
      try {
          await updateWorkoutLog(editingLog.id, {
              exerciseName: editingLog.exerciseName,
              setsCount: parseInt(editingLog.setsCount),
              repsCount: parseInt(editingLog.repsCount),
              weight: parseFloat(editingLog.weight),
              durationMinutes: parseFloat(editingLog.durationMinutes || 0),
              completed: editingLog.completed
          });
          setEditDialogOpen(false);
          setEditingLog(null);
          handleRefresh();
      } catch (e) { console.error("Update failed", e); }
  };

  const navItems = [
      { text: "Dashboard", shortText: "Home", icon: <Home />, id: 0 },
      { text: "Diet Plan", shortText: "Diet", icon: <Assignment />, id: 1 },
      { text: "My Diet", shortText: "My Diet", icon: <Edit />, id: 5 },
      { text: "Workout Plan", shortText: "Workout", icon: <FitnessCenter />, id: 2 },
      { text: "My Workout", shortText: "My Work", icon: <Edit />, id: 6 },
      { text: "Attendance", shortText: "Attend", icon: <EventNote />, id: 3 },
      { text: "Profile", shortText: "Profile", icon: <Person />, id: 4 },
  ];

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", flexDirection: 'row' }}>
        
        {/* MOBILE TOP NAVBAR */}
        {/* ... (Kept as is) */}
        <AppBar position="fixed" color="default" sx={{ display: { lg: 'none', xs: 'block' }, top: 0, bottom: 'auto', zIndex: 1201, bgcolor: 'white', boxShadow: 1 }}>
          <Tabs
            value={currentTab}
            onChange={(e, val) => handleTabNav(val)}
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
             {navItems.map((item) => (
                <Tab 
                    key={item.id} 
                    icon={item.icon} 
                    label={item.shortText || item.text} 
                    iconPosition="top" 
                    value={item.id} 
                    sx={{ 
                        minHeight: 64, 
                        minWidth: 80, 
                        fontSize: '0.7rem',
                        p: 0
                    }}
                />
             ))}
          </Tabs>
        </AppBar>
        
        {/* SIDEBAR - DESKTOP ONLY */}
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
            width: isSidebarHovered ? 280 : 80, 
            transition: "width 0.3s ease",
            zIndex: 1200,
            overflow: "hidden",
            boxShadow: isSidebarHovered ? "4px 0 24px rgba(0,0,0,0.1)" : "1px 0 0 rgba(0,0,0,0.05)"
          }}
        >
           <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: isSidebarHovered ? "flex-start" : "center", height: 80, transition: "all 0.3s ease" }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 12, bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                  <TrendingUp />
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
                  FitLife Member
              </Typography>
           </Box>

           <Box sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
               {navItems.map((item) => (
                   <Box
                       key={item.text}
                       onClick={() => handleTabNav(item.id)}
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
                           transition: "all 0.2s ease",
                           whiteSpace: "nowrap",
                           "&:hover": { 
                               bgcolor: "primary.50", 
                               color: "primary.main", 
                               transform: isSidebarHovered ? "translateX(4px)" : "none" 
                           }
                       }}
                   >
                       <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                           {item.icon}
                       </Box>
                       <Typography 
                           sx={{ 
                               ml: 2,
                               opacity: isSidebarHovered ? 1 : 0, 
                               width: isSidebarHovered ? 'auto' : 0, 
                               overflow: 'hidden',
                               transition: 'all 0.3s ease'
                           }}
                        >
                            {item.text}
                        </Typography>
                   </Box>
               ))}
               

           </Box>
        </Box>

        {/* MAIN CONTENT */}
        <Box sx={{ flexGrow: 1, ml: { lg: "80px", xs: 0 }, mt: { xs: 8, lg: 0 }, p: { xs: 2, md: 4 }, width: "100%" }}>
            
            {/* TOP BAR */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {currentTab !== 0 && (
                        <IconButton onClick={() => handleTabNav(0)} sx={{ mr: 2, bgcolor: "white", boxShadow: 1 }}>
                            <ArrowBack />
                        </IconButton>
                    )}
                    <Box>
                        <Typography variant="h4" color="text.primary" fontWeight={800}>
                            {navItems.find(i => i.id === currentTab)?.text || "Account"}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {(currentTab === 1 || currentTab === 2) && (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<Send />}
                            onClick={() => setRequestOpen(true)}
                        >
                            {currentTab === 1 ? "Request Diet Plan" : "Request Workout Plan"}
                        </Button>
                    )}
                    <IconButton onClick={logout} sx={{ bgcolor: "white", boxShadow: 1 }}>
                        <Logout color="action" />
                    </IconButton>
                    <Tooltip title="View Profile">
                        <Avatar 
                             onClick={() => setProfileOpen(true)} 
                             sx={{ bgcolor: "primary.main", boxShadow: 2, cursor: 'pointer' }}
                        >
                             {profile?.firstName?.charAt(0) || <Person />}
                        </Avatar>
                    </Tooltip>
                </Box>
            </Box>

            <AnimatePresence mode="wait">
                {/* 1. HOME TAB - 5 Clickable Cards */}
                {currentTab === 0 && (
                     <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                         <WelcomeBanner name={profile?.firstName} />
                         
                         <Grid container spacing={4} justifyContent="center">
                             <Grid item xs={12} md={6}>
                                 <NavCard 
                                     title="Attendance & Rewards" 
                                     description="View recent history, streaks, and engagement rewards." 
                                     icon={EventNote} 
                                     onClick={() => handleTabNav(3)}
                                     color="#007BFF" 
                                 />
                             </Grid>
                             <Grid item xs={12} md={6}>
                                 <NavCard 
                                     title="Assigned Diet Plan" 
                                     description={hasTrainer ? "View the diet plan assigned by your personal trainer." : "No trainer assigned. Click to view available trainers."} 
                                     icon={Assignment} 
                                     onClick={() => handleTabNav(1)}
                                     color="#F6A23E"
                                 />
                             </Grid>
                             <Grid item xs={12} md={6}>
                                 <NavCard 
                                     title="Create Own Diet" 
                                     description="Log your daily meals and create your own diet schedule." 
                                     icon={Edit} 
                                     onClick={() => handleTabNav(5)}
                                     color="#E91E63"
                                 />
                             </Grid>
                             <Grid item xs={12} md={6}>
                                 <NavCard 
                                     title="Assigned Workout Plan" 
                                     description={hasTrainer ? "View the workout plan assigned by your personal trainer." : "No trainer assigned. Click to view available trainers."} 
                                     icon={FitnessCenter} 
                                     onClick={() => handleTabNav(2)}
                                     color="#27C499"
                                 />
                             </Grid>
                             <Grid item xs={12} md={6}>
                                 <NavCard 
                                     title="Create Own Workout" 
                                     description="Log your daily workout exercises and sets." 
                                     icon={Edit} 
                                     onClick={() => handleTabNav(6)}
                                     color="#8E24AA"
                                 />
                             </Grid>
                         </Grid>
                     </motion.div>
                )}

                {/* 2. ASSIGNED DIET PLAN CONTENT */}
                {currentTab === 1 && (
                    <motion.div key="diet-plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Grid container spacing={5}>
                            <Grid item xs={12}>
                                {isLoading ? <CircularProgress /> : <DietPlanView plan={dietPlan} hasTrainer={hasTrainer} availableTrainers={availableTrainers} trainerId={profile?.assignedTrainer?.trainerId || profile?.assignedTrainer?.id || profile?.trainerId} />}
                            </Grid>
                        </Grid>
                    </motion.div>
                )}

                {/* 6. CREATE OWN DIET CONTENT */}
                {currentTab === 5 && (
                    <motion.div key="diet-log" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Grid container spacing={5}>
                            <Grid item xs={12}>
                                <DietLogger onLogSuccess={handleRefresh} />
                            </Grid>
                        </Grid>
                    </motion.div>
                )}

                {/* 3. ASSIGNED WORKOUT PLAN CONTENT */}
                {currentTab === 2 && (
                    <motion.div key="workout-plan" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Grid container spacing={5}>
                            <Grid item xs={12}>
                                {isLoading ? <CircularProgress /> : <WorkoutPlanView plan={currentPlan} hasTrainer={hasTrainer} availableTrainers={availableTrainers} trainerId={profile?.assignedTrainer?.trainerId || profile?.assignedTrainer?.id || profile?.trainerId} />}
                            </Grid>
                        </Grid>
                    </motion.div>
                )}

                {/* 7. CREATE OWN WORKOUT CONTENT */}
                {currentTab === 6 && (
                    <motion.div key="workout-log" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Grid container spacing={5}>
                            <Grid item xs={12} md={6}>
                                <WorkoutLogger onLogSuccess={handleRefresh} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 4, height: '100%', borderRadius: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <FitnessCenter sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
                                        <Typography variant="h6">Today's Logs</Typography>
                                    </Box>
                                    {todayWorkoutLogs && todayWorkoutLogs.length > 0 ? (
                                        <Grid container spacing={2} sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                            {todayWorkoutLogs.map((log, i) => (
                                                <Grid item xs={12} key={i}>
                                                   <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 3 }}>
                                                       <Box>
                                                            <Typography fontWeight={600} variant="body1">{log.exerciseName?.replace(/_/g, ' ') || log.exerciseName}</Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {log.setsCount} Sets x {log.repsCount} Reps • {log.weight} kg
                                                            </Typography>
                                                       </Box>
                                                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <IconButton size="small" onClick={() => handleEditClick(log)}>
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                            <IconButton size="small" onClick={() => handleDeleteLog(log.id)}>
                                                                <Delete fontSize="small" color="error" />
                                                            </IconButton>
                                                            {log.completed ? (
                                                                <CheckCircle color="success" fontSize="small" />
                                                            ) : (
                                                                <Cancel color="error" fontSize="small" />
                                                            )}
                                                       </Box>
                                                   </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                         <Box sx={{ py: 4, textAlign: 'center', opacity: 0.6 }}>
                                             <Typography variant="body2">No exercises logged today yet.</Typography>
                                         </Box>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </motion.div>
                )}

                {/* EDIT DIALOG */}
                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                    <DialogTitle>Edit Log</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
                            <TextField 
                                label="Exercise" 
                                value={editingLog?.exerciseName || ''} 
                                disabled 
                                fullWidth 
                            />
                            <TextField 
                                label="Sets" 
                                type="number" 
                                value={editingLog?.setsCount || ''} 
                                onChange={(e) => setEditingLog({...editingLog, setsCount: e.target.value})} 
                                fullWidth 
                            />
                            <TextField 
                                label="Reps" 
                                type="number" 
                                value={editingLog?.repsCount || ''} 
                                onChange={(e) => setEditingLog({...editingLog, repsCount: e.target.value})} 
                                fullWidth 
                            />
                            <TextField 
                                label="Weight (kg)" 
                                type="number" 
                                value={editingLog?.weight || ''} 
                                onChange={(e) => setEditingLog({...editingLog, weight: e.target.value})} 
                                fullWidth 
                            />
                            <TextField 
                                label="Duration (min)" 
                                type="number" 
                                value={editingLog?.durationMinutes || ''} 
                                onChange={(e) => setEditingLog({...editingLog, durationMinutes: e.target.value})} 
                                fullWidth 
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleUpdateSubmit}>Update</Button>
                    </DialogActions>
                </Dialog>

                {/* 4. ATTENDANCE CONTENT */}
                {currentTab === 3 && (
                    <motion.div key="attendance" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <AttendanceWidget onAttendanceUpdate={handleRefresh} />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 4, height: '100%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <EventNote sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                                        <Typography variant="h6">Attendance History</Typography>
                                    </Box>

                                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Current Streak</Typography>
                                            <Typography variant="h4" fontWeight={700} color="primary.main">{streak} Days 🔥</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right', opacity: 0.8 }}>
                                            <Typography variant="subtitle2" color="text.secondary">Best Streak</Typography>
                                            <Typography variant="h5" fontWeight={700} color="text.primary">{maxStreak} Days 🏆</Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="subtitle2" gutterBottom>Recent Check-ins</Typography>
                                    {attendanceHistory && attendanceHistory.length > 0 ? (
                                        <Box>
                                            {attendanceHistory.slice(0, 5).map((record, i) => (
                                                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                                                    <Typography variant="body2">{record.date ? new Date(record.date).toLocaleDateString() : 'Active Session'}</Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CheckCircle fontSize="small" color="success" />
                                                        <Typography variant="body2" fontWeight={600} color="success.main">{record.status || 'Present'}</Typography>
                                                    </Box>
                                                </Box>
                                            ))}
                                            {attendanceHistory.length > 5 && <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>+ {attendanceHistory.length - 5} more records...</Typography>}
                                        </Box>
                                    ) : (
                                        <Typography color="text.secondary">No recent attendance records found.</Typography>
                                    )}
                                </Paper>
                            </Grid>
                        </Grid>
                    </motion.div>
                )}

                {/* 5. PROFILE & ACCOUNT */}
                {currentTab === 4 && (
                    <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Paper sx={{ p: 5, maxWidth: 800, mx: "auto" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
                                <Avatar sx={{ width: 100, height: 100, bgcolor: "primary.main", fontSize: 40 }}>
                                    {profile?.firstName?.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="h4">{profile?.firstName} {profile?.lastName}</Typography>
                                    <Typography variant="h6" color="text.secondary">{profile?.email}</Typography>
                                </Box>
                            </Box>
                            
                            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Membership Details</Typography>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                                        <Typography variant="subtitle2" color="text.secondary">Membership Status</Typography>
                                        <Typography variant="h6" color="success.main">Active</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                                        <Typography variant="subtitle2" color="text.secondary">Joined On</Typography>
                                        <Typography variant="h6">2023-01-15</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            <Typography variant="h6" gutterBottom>Personal Stats</Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                                        <Typography variant="subtitle2" color="text.secondary">Weight</Typography>
                                        <Typography variant="h6">{profile?.weight ? `${profile.weight} kg` : 'N/A'}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                                        <Typography variant="subtitle2" color="text.secondary">Goal</Typography>
                                        <Typography variant="h6">{profile?.fitnessGoal || 'General'}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                                        <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                                        <Typography variant="h6">{profile?.phone || 'N/A'}</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Paper>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* REQUEST PLAN DIALOG */}
            <Dialog open={requestOpen} onClose={() => setRequestOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Request {currentTab === 1 ? 'Diet' : 'Workout'} Plan</DialogTitle>
                <DialogContent>
                    <TextField 
                        autoFocus
                        margin="dense"
                        label="Message to Trainer (Optional)"
                        fullWidth
                        multiline
                        rows={4}
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRequestOpen(false)}>Cancel</Button>
                    <Button onClick={handleRequestSubmit} variant="contained">Send Request</Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={feedback.open} 
                autoHideDuration={6000} 
                onClose={() => setFeedback({ ...feedback, open: false })}
            >
                <Alert severity={feedback.severity} onClose={() => setFeedback({ ...feedback, open: false })}>
                    {feedback.message}
                </Alert>
            </Snackbar>
        </Box>



      </Box>
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
          <Typography variant="h6" fontWeight={700}>Member Profile</Typography>
          <IconButton onClick={() => setProfileOpen(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          {profile ? (
            <Box>
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
                  {profile.firstName ? profile.firstName[0].toUpperCase() : <Person />}
                </Avatar>
                <Typography variant="h5" fontWeight={700}>{profile.firstName} {profile.lastName}</Typography>
                <Chip 
                  label="MEMBER" 
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

              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 2 }}>
                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2" fontWeight={600}>{profile.email || 'N/A'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                    <Typography variant="body2" fontWeight={600}>{profile.phoneNumber || 'N/A'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                   <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                   <Box>
                     <Typography variant="caption" color="text.secondary">Username</Typography>
                     <Typography variant="body2" fontWeight={600}>{profile.username || 'N/A'}</Typography>
                   </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 2 }}>
                Personal Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Cake sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body2" fontWeight={600}>{profile.dateOfBirth || 'N/A'}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                   <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                   <Box>
                     <Typography variant="caption" color="text.secondary">Gender</Typography>
                     <Typography variant="body2" fontWeight={600}>{profile.gender || 'N/A'}</Typography>
                   </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocationOn sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Address</Typography>
                    <Typography variant="body2" fontWeight={600}>{profile.address || 'N/A'}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography align="center" color="text.secondary">Loading profile...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </ThemeProvider>

  );
};

export default MemberDashboardPage;
