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
  ThemeProvider,
  CssBaseline,
  createTheme,
  Tabs,
  Tab,
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
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { motion } from "framer-motion";
import api, { attendanceApi } from "../services/api"; // Ensure this is your configured axios instance
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// --- THEME SETUP ---
// --- THEME SETUP ---
const dashboardTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: "#007BFF" }, // Bootstrap Blue
    secondary: { main: "#6c757d" }, // Bootstrap Secondary (Gray)
    success: { main: "#27C499", light: "#D1FAE5" }, // Clean SaaS Green
    warning: { main: "#F6A23E" }, // Amber
    error: { main: "#E53935" }, // Material Red
    info: { main: "#17A2B8" }, // Info Blue-light
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
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E5E7EB",
          padding: "16px 24px",
        },
        head: {
          fontWeight: 600,
          color: "#6B7280",
          backgroundColor: "#F9FAFB",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
      },
    },
  },
}); 


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

const WelcomeBanner = () => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    sx={{
      p: { xs: 3, md: 5 },
      mb: 5,
      borderRadius: "32px",
      background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)", // Blue gradient
      color: "white",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 20px 25px -5px rgba(0, 123, 255, 0.3)",
    }}
  >
    <Box sx={{ position: "relative", zIndex: 1, maxWidth: "600px" }}>
      <Typography variant="h4" fontWeight={800} gutterBottom sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
        Welcome back, Admin! 👋
      </Typography>
      <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, lineHeight: 1.6 }}>
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
  const [data, setData] = useState(null);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0); // 0: Gym, 1: Member, 2: Trainer
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Get Gyms to find a valid ID
        const gymsRes = await api.get("/gym/my-gyms");
        const gyms = Array.isArray(gymsRes.data) ? gymsRes.data : [];
        
        if (gyms.length === 0) {
          setError("No gyms found. Please create a gym first.");
          setLoading(false);
          return;
        }

        const gymId = gyms[0].gymId; // Use first gym for now

        // 2. Fetch Dashboard Data
        const res = await api.get(`/admin/dashboard/${gymId}`);
        setData(res.data);

        // 3. Fetch Attendance Logs
        try {
            const attendanceRes = await attendanceApi.get(`/attendance/admin/gym/${gymId}`);
            // Handle new structure { gymId, records: [...] } or fallback to array
            const logs = attendanceRes.data.records || (Array.isArray(attendanceRes.data) ? attendanceRes.data : []);
            setAttendanceLogs(logs);
        } catch (attErr) {
            console.error("Failed to fetch attendance logs", attErr);
            // Don't block main dashboard if attendance fails
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={60} thickness={4} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please check your connection or try again later.
        </Typography>
      </Box>
    );
  }

  if (!data) return null;

  // --- DATA PREPARATION FOR CHARTS ---

  // 1. Active vs Inactive (Pie)
  const activeInactiveData = [
    { name: "Active", value: data.activeMembers },
    { name: "Inactive", value: data.totalMembers - data.activeMembers },
  ];
  const PIE_COLORS = ["#27C499", "#E53935"];

  // 2. Attendance (Bar/Line Combo)
  const attendanceData = [
    { name: "Members", present: data.membersPresentToday, total: data.totalMembers },
    { name: "Trainers", present: data.trainersPresentToday, total: data.totalTrainers },
  ];

  // 3. Trainer Activity (Horizontal Bar)
  const trainerActivityData = data.trainerActivity.map(t => ({
    name: t.fullName || `Trainer ${t.trainerId}`,
    members: t.memberCount,
  }));

  // 4. Revenue Trend (Mocking monthly trend as API gives single values)
  const revenueData = [
    { month: "Jan", revenue: data.monthlyRevenue * 0.8 },
    { month: "Feb", revenue: data.monthlyRevenue * 0.9 },
    { month: "Mar", revenue: data.monthlyRevenue * 0.85 },
    { month: "Apr", revenue: data.monthlyRevenue * 1.1 },
    { month: "May", revenue: data.monthlyRevenue * 1.05 },
    { month: "Jun", revenue: data.monthlyRevenue }, // Current
  ];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        
        {/* SIDEBAR */}
        {/* SIDEBAR */}
        {/* SIDEBAR */}
        <Box
          component={motion.div}
          initial="collapsed"
          whileHover="expanded"
          variants={{
            collapsed: { width: 80 },
            expanded: { width: 280 }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            borderRight: "1px solid #E5E7EB",
            bgcolor: "white",
            position: "fixed",
            height: "100vh",
            zIndex: 1200,
            overflow: "hidden",
            boxShadow: "4px 0 24px rgba(0,0,0,0.02)"
          }}
        >
          <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 0, minWidth: 280 }}>
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
            <motion.div
              variants={{
                collapsed: { opacity: 0, width: 0 },
                expanded: { opacity: 1, width: "auto" }
              }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden", whiteSpace: "nowrap" }}
            >
                <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ ml: 2 }}>
                  GymAdmin
                </Typography>
            </motion.div>
          </Box>
          
          <Box sx={{ px: 2, py: 2, flexGrow: 1 }}>
            {["Dashboard", "Gyms", "Members", "Trainers", "Attendance", "Finance", "Settings"].map((text, index) => (
              <Box
                key={text}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: "12px",
                  cursor: "pointer",
                  color: index === 0 ? "primary.main" : "text.secondary",
                  bgcolor: index === 0 ? "primary.50" : "transparent",
                  fontWeight: index === 0 ? 600 : 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                  minWidth: 240,
                  transition: "all 0.2s ease",
                  "&:hover": { 
                    bgcolor: "primary.50", 
                    color: "primary.main",
                    transform: "translateX(4px)"
                  },
                }}
                onClick={() => {
                   if (text === "Gyms") navigate("/admin/gyms");
                   if (text === "Members") navigate("/admin/members/add");
                   if (text === "Trainers") navigate("/admin/trainers/add");
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, flexShrink: 0 }}>
                    {index === 0 && <TrendingUp />}
                    {index === 1 && <Business />}
                    {index === 2 && <People />}
                    {index === 3 && <FitnessCenter />}
                    {index === 4 && <EventNote />}
                    {index === 5 && <AttachMoney />}
                    {index === 6 && <MenuIcon />}
                </Box>
                <motion.div
                    variants={{
                        collapsed: { opacity: 0, width: 0 },
                        expanded: { opacity: 1, width: "auto" }
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                >
                    <Typography sx={{ ml: 2 }}>{text}</Typography>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Box>

        {/* MAIN CONTENT */}
        <Box sx={{ flexGrow: 1, ml: { md: "80px" }, p: { xs: 2, md: 4 } }}>
          
          {/* TOP NAVBAR */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Box>
              <Typography variant="h4" color="text.primary" fontWeight={800}>
                Dashboard
              </Typography>
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
              <Avatar sx={{ bgcolor: "primary.main", width: 45, height: 45, boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)" }}>A</Avatar>
            </Box>
          </Box>

          <WelcomeBanner />

          {/* DASHBOARD TABS */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="dashboard tabs">
              <Tab label="Gym Dashboard" icon={<DashboardIcon />} iconPosition="start" />
              <Tab label="Member Dashboard" icon={<People />} iconPosition="start" />
              <Tab label="Trainer Dashboard" icon={<FitnessCenter />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* GYM DASHBOARD CONTENT */}
          {currentTab === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              
              {/* Removed AttendanceWidget and Welcome Banner */}

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <KpiCard
                    title="Total Revenue"
                    value={`₹${data.totalRevenue.toLocaleString()}`}
                    icon={AttachMoney}
                    gradient="linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)" // Teal
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <KpiCard
                    title="Monthly Revenue"
                    value={`₹${Math.round(data.monthlyRevenue).toLocaleString()}`}
                    icon={TrendingUp}
                    gradient="linear-gradient(135deg, #f97316 0%, #ea580c 100%)" // Orange
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <KpiCard
                    title="Total Members"
                    value={data.totalMembers}
                    icon={People}
                    gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" // Blue
                  />
                </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                  <KpiCard
                    title="Total Trainers"
                    value={data.totalTrainers}
                    icon={FitnessCenter}
                    gradient="linear-gradient(135deg, #ec4899 0%, #db2777 100%)" // Pink
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, mb: 4, width: "100%" }}>
                <Paper sx={{ p: 1, height: 500, overflow: "hidden" }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6">
                      Revenue Trend (Last 6 Months)
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `₹${value}`} />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                        formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>

              {/* ATTENDANCE LOGS TABLE */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ overflow: "hidden" }}>
                    <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
                      <Typography variant="h6">Recent Attendance Logs</Typography>
                    </Box>
                    <TableContainer sx={{ maxHeight: 400 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#f8fafc" }}>
                            <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {attendanceLogs.length > 0 ? (
                            attendanceLogs.map((log) => (
                              <TableRow key={log.id} hover>
                                <TableCell>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.light", fontSize: 14 }}>
                                      {log.user?.fullName ? log.user.fullName[0].toUpperCase() : "U"}
                                    </Avatar>
                                    <Typography variant="body2" fontWeight={500}>
                                      {log.user?.fullName || `User ${log.user_id}`}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            px: 1,
                                            py: 0.5,
                                            bgcolor: log.role === 'TRAINER' ? 'secondary.light' : 'primary.light',
                                            color: 'white',
                                            borderRadius: '6px',
                                            display: 'inline-block',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {log.role}
                                    </Box>
                                </TableCell>
                                <TableCell>{log.date}</TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      px: 1.5,
                                      py: 0.5,
                                      bgcolor: "success.50",
                                      color: "success.main",
                                      borderRadius: "6px",
                                      display: "inline-block",
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {log.status}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                No attendance records found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* MEMBER DASHBOARD CONTENT */}
          {currentTab === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <KpiCard
                    title="Total Members"
                    value={data.totalMembers}
                    icon={People}
                    gradient="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <KpiCard
                    title="Active Members"
                    value={data.activeMembers}
                    icon={CheckCircle}
                    gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <KpiCard
                    title="Members Present"
                    value={data.membersPresentToday}
                    icon={DirectionsRun}
                    gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <KpiCard
                    title="Expiring Soon"
                    value={data.expiringMembershipCount}
                    icon={Warning}
                    gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                  />
                </Grid>
              </Grid>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 1, height: 400 }}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6">
                        Member Status Distribution
                      </Typography>
                    </Box>
                    <Box sx={{ height: 300, display: "flex", justifyContent: "center" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={activeInactiveData}
                            cx="50%"
                            cy="50%"
                            innerRadius="60%"
                            outerRadius="80%"
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {activeInactiveData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
                 <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 1, height: 400 }}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6">
                        Attendance Overview
                      </Typography>
                    </Box>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="present" name="Present Today" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="total" name="Total Count" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ overflow: "hidden" }}>
                    <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
                      <Typography variant="h6">Expiring Memberships</Typography>
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#f8fafc" }}>
                            <TableCell sx={{ fontWeight: 600 }}>Member Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Expiry Date</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.expiringMembers.length > 0 ? (
                            data.expiringMembers.map((m) => (
                              <TableRow key={m.memberId} hover>
                                <TableCell>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.light", fontSize: 14 }}>
                                      {m.fullName ? m.fullName[0].toUpperCase() : "U"}
                                    </Avatar>
                                    <Typography variant="body2" fontWeight={500}>
                                      {m.fullName || `User ${m.userId}`}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>{m.expiryDate}</TableCell>
                                <TableCell>
                                  <Box
                                    sx={{
                                      px: 1.5,
                                      py: 0.5,
                                      bgcolor: "error.50",
                                      color: "error.main",
                                      borderRadius: "6px",
                                      display: "inline-block",
                                      fontSize: "0.75rem",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Expiring Soon
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  <IconButton size="small" color="primary">
                                    <EventNote fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} align="center" sx={{ py: 4, color: "text.secondary" }}>
                                No memberships expiring soon.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* TRAINER DASHBOARD CONTENT */}
          {currentTab === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <KpiCard
                    title="Total Trainers"
                    value={data.totalTrainers}
                    icon={FitnessCenter}
                    gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <KpiCard
                    title="Trainers Present"
                    value={data.trainersPresentToday}
                    icon={DirectionsRun}
                    gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                  />
                </Grid>
                 <Grid item xs={12} sm={6} md={4}>
                  <KpiCard
                    title="Pending Requests"
                    value={data.pendingDietRequests + data.pendingWorkoutRequests}
                    icon={Restaurant}
                    gradient="linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, mb: 4, width: "100%" }}>
                <Paper sx={{ p: 1, height: 500 }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6">
                      Trainer Activity (Members Assigned)
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart layout="vertical" data={trainerActivityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: "transparent" }} />
                      <Bar dataKey="members" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Box>
                
              <Grid container spacing={3}>
                <Grid item xs={12}>
                   <Paper sx={{ overflow: "hidden", height: "100%" }}>
                    <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
                      <Typography variant="h6">Trainer Performance Details</Typography>
                    </Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#f8fafc" }}>
                            <TableCell sx={{ fontWeight: 600 }}>Trainer</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Clients</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.trainerActivity.map((t) => (
                            <TableRow key={t.trainerId} hover>
                              <TableCell>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                  <Avatar sx={{ width: 30, height: 30, bgcolor: "primary.light", fontSize: 12 }}>
                                    {t.fullName ? t.fullName[0] : "T"}
                                  </Avatar>
                                  <Typography variant="body2">
                                    {t.fullName || `Trainer ${t.trainerId}`}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2" fontWeight={600}>
                                  {t.memberCount}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}

        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboardPage;
