import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Container,
  AppBar,
  Toolbar,
  useTheme,
  ThemeProvider,
  CssBaseline,
  createTheme,
  TextField,
  List,
  ListItem,
  ListItemText,
  Badge
} from '@mui/material';
import {
  People,
  FitnessCenter,
  Logout,
  Person,
  ArrowBack,
  TrendingUp,
  EventNote,
  Menu as MenuIcon,
  Chat as ChatIcon,
  Send as SendIcon,
  Restaurant,
  Assignment,
  NotificationsActive // Added
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { MemberRegistrationProvider, useMemberRegistration } from '../context/MemberRegistrationContext';
import { WorkoutProvider, useWorkout } from '../context/WorkoutContext';
import { useAuth } from '../context/AuthContext';
import { ChatProvider, useChat } from '../context/ChatContext';
import { useAttendance } from '../context/AttendanceContext';
import AssignWorkoutForm from '../components/AssignWorkoutForm';
import AttendanceWidget from '../components/AttendanceWidget';
import { 
    getMyStats, 
    getTodayAttendance, 
    getInactiveMembers, 
    getUpcomingBirthdays,
    getDietCompliance,
    getWorkoutCompliance
} from '../services/trainerDashboardService';
import { trainerService } from '../services/trainerService'; // Added
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

import WorkoutPlanView from '../components/WorkoutPlanView';
import AssignDietForm from '../components/AssignDietForm';
import DietPlanView from '../components/DietPlanView';
import { getMemberDietPlan, assignDietPlan } from '../services/dietService';

// --- THEME SETUP (Copied from AdminDashboardPage) ---
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

const AttendanceView = () => {
    const { history, getAttendanceHistory, historyLoading } = useAttendance();
    
    useEffect(() => {
        getAttendanceHistory();
    }, []);

    return (
        <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>My Attendance</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <AttendanceWidget />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 4 }}>
                        <Typography variant="h6" gutterBottom>History</Typography>
                        {historyLoading ? <CircularProgress /> : (
                            <List>
                                {history.length === 0 ? (
                                    <Typography color="text.secondary">No attendance history found.</Typography>
                                ) : (
                                    history.map((record) => (
                                        <ListItem key={record.id} divider>
                                            <ListItemText 
                                                primary={new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                secondary={record.status}
                                            />
                                            <Badge color="success" variant="dot" />
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};



const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Paper sx={{ p: 3, borderRadius: 4, height: '100%', position: 'relative', overflow: 'hidden' }}>
    <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.1, transform: 'rotate(15deg)' }}>
      {React.cloneElement(icon, { sx: { fontSize: 100, color: color } })}
    </Box>
    <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} gutterBottom>
            {title}
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ color: color, mb: 0.5 }}>
            {value}
        </Typography>
        {subtitle && (
             <Typography variant="caption" color="text.secondary">
                {subtitle}
             </Typography>
        )}
    </Box>
  </Paper>
);

const ComplianceChart = ({ title, data, total }) => {
    const chartData = [
        { name: 'Compliant', value: data },
        { name: 'Non-Compliant', value: total - data }
    ];
    const COLORS = ['#10B981', '#E5E7EB']; // Success Green and Gray

    return (
        <Paper sx={{ p: 3, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>{title}</Typography>
            <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <RechartsTooltip />
                    </PieChart>
                </ResponsiveContainer>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={800}>{Math.round((data / total) * 100) || 0}%</Typography>
                    <Typography variant="caption" color="text.secondary">Compliance</Typography>
                </Box>
            </Box>
        </Paper>
    );
};

const DashboardStats = ({ onSelectMember }) => {
    const [stats, setStats] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [inactive, setInactive] = useState([]);
    const [birthdays, setBirthdays] = useState([]);
    const [dietComp, setDietComp] = useState(null);
    const [workoutComp, setWorkoutComp] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [s, a, i, b, d, w] = await Promise.all([
                    getMyStats(),
                    getTodayAttendance(),
                    getInactiveMembers(),
                    getUpcomingBirthdays(),
                    getDietCompliance(),
                    getWorkoutCompliance()
                ]);
                setStats(s);
                setAttendance(a);
                setInactive(i);
                setBirthdays(b);
                setDietComp(d);
                setWorkoutComp(w);
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;

    return (
        <Grid container spacing={3}>
            {/* Top Row Stats */}
            <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                    title="Total Members" 
                    value={stats?.totalMembers || 0} 
                    icon={<People />} 
                    color="#007BFF" 
                    subtitle={`${stats?.activeToday || 0} active today`}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                    title="Earnings (Month)" 
                    value={`₹${(stats?.totalEarningsThisMonth || 0).toLocaleString()}`} 
                    icon={<Assignment />} 
                    color="#27C499"
                />
            </Grid>
             <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                    title="Pending Diets" 
                    value={stats?.pendingDietRequests || 0} 
                    icon={<Restaurant />} 
                    color="#F6A23E"
                />
            </Grid>
             <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                    title="User Rating" 
                    value={stats?.rating || 0} 
                    icon={<TrendingUp />} 
                    color="#6f42c1"
                />
            </Grid>

            {/* Compliance Charts */}
             <Grid item xs={12} md={6}>
                 <Grid container spacing={3} sx={{ height: '100%' }}>
                     {dietComp && (
                         <Grid item xs={12} sm={6}>
                             <ComplianceChart title="Diet Adherence" data={dietComp.todayLogged} total={dietComp.totalMembers} />
                         </Grid>
                     )}
                     {workoutComp && (
                         <Grid item xs={12} sm={6}>
                             <ComplianceChart title="Workout Consistency" data={workoutComp.todayLogged} total={workoutComp.totalMembers} />
                         </Grid>
                     )}
                 </Grid>
             </Grid>

             {/* Attendance & Inactive */}
             <Grid item xs={12} md={6}>
                 <Paper sx={{ p: 3, borderRadius: 4, height: '100%', overflowY: 'auto', maxHeight: 300 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Today's Attendance</Typography>
                    <List dense>
                        {attendance.length === 0 ? <Typography variant="body2" color="text.secondary">No one checked in yet.</Typography> : 
                            attendance.map(m => (
                                <ListItem key={m.memberId}>
                                    <ListItemText 
                                        primary={m.name} 
                                        secondary={`Checked in: ${m.checkInTime}`}
                                    />
                                     <Box sx={{ display: 'flex', gap: 1 }}>
                                        {m.workoutLogged && <FitnessCenter sx={{ fontSize: 16, color: 'success.main' }} />}
                                        {m.dietLogged && <Restaurant sx={{ fontSize: 16, color: 'success.main' }} />}
                                     </Box>
                                </ListItem>
                            ))
                        }
                    </List>
                 </Paper>
             </Grid>

             {/* Inactive Members Alert */}
              {inactive.length > 0 && (
                 <Grid item xs={12}>
                     <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#FEF2F2', border: '1px solid #FECACA' }}>
                         <Typography variant="subtitle1" color="error.main" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                             <Typography component="span" fontSize={20}>⚠️</Typography> Follow-up Required ({inactive.length})
                         </Typography>
                         <Box sx={{ display: 'flex', gap: 2, mt: 1, overflowX: 'auto', pb: 1 }}>
                             {inactive.map(m => (
                                 <Paper key={m.memberId} sx={{ p: 1.5, minWidth: 200, borderRadius: 2 }}>
                                     <Typography variant="subtitle2" fontWeight={700}>{m.name}</Typography>
                                     <Typography variant="caption" color="text.secondary" display="block">Absent: {m.daysAbsent} days</Typography>
                                     <Button size="small" sx={{ mt: 0.5 }} onClick={() => console.log("Call", m.phone)}>Call {m.phone}</Button>
                                 </Paper>
                             ))}
                         </Box>
                     </Paper>
                 </Grid>
             )}
        </Grid>
    );
};

// --- COMPONENTS ---

const DietPlanTab = ({ memberId }) => {
  const [dietPlan, setDietPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState('');

  const fetchDiet = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getMemberDietPlan(memberId);
      setDietPlan(data);
    } catch (err) {
      if (err.status !== 404 && err.response?.status !== 404) {
          setError('Failed to fetch diet plan.');
      }
      setDietPlan(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiet();
  }, [memberId]);

  const handleAssignSuccess = async (planData) => {
    try {
      setIsLoading(true);
      await assignDietPlan(planData);
      setIsAssigning(false);
      fetchDiet();
    } catch (err) {
      console.error(err);
      setError('Failed to assign diet plan.');
      setIsLoading(false);
    }
  };

  return (
    <Box>
       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Current Diet Plan
        </Typography>
        {!isAssigning && (
          <Button 
            variant="contained" 
            startIcon={<Restaurant />}
            onClick={() => setIsAssigning(true)}
            sx={{ borderRadius: 2 }}
          >
            Assign New Diet
          </Button>
        )}
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      )}

      {isAssigning ? (
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <AssignDietForm 
            memberId={memberId} 
            onSubmit={handleAssignSuccess} 
            onCancel={() => setIsAssigning(false)} 
          />
        </Paper>
      ) : (
        <Box>
          {isLoading ? <CircularProgress /> : <DietPlanView plan={dietPlan} />}
        </Box>
      )}
    </Box>
  );
};


const ChatWindow = ({ memberId, memberName }) => {
  const { messages, sendMessage, sendTyping, typingStatus, loadHistory, userId, isConnected } = useChat();
  const [text, setText] = useState('');
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const chatMessages = messages[memberId] || [];
  const isTyping = typingStatus[memberId];

  useEffect(() => {
    loadHistory(memberId);
  }, [memberId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage(memberId, text);
    setText('');
    // Stop typing indicator immediately
    sendTyping(memberId, false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    
    // Handle Typing Indicator
    sendTyping(memberId, true);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(memberId, false);
    }, 2000);
  };

  return (
    <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column', borderRadius: 4, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #eee', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>{memberName.charAt(0)}</Avatar>
        <Box>
          <Typography variant="h6">{memberName}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {isConnected ? 'Online' : 'Connecting...'}
          </Typography>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box ref={scrollRef} sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {chatMessages.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
            No messages yet. Start the conversation!
          </Typography>
        )}
        
        {chatMessages.map((msg, index) => {
          const isMe = msg.senderUserId === Number(userId);
          return (
            <Box 
              key={msg.messageId || index} 
              sx={{ 
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
                bgcolor: isMe ? 'primary.main' : 'white',
                color: isMe ? 'white' : 'text.primary',
                p: 1.5,
                borderRadius: 2,
                boxShadow: 1,
                borderBottomRightRadius: isMe ? 0 : 2,
                borderBottomLeftRadius: isMe ? 2 : 0,
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, opacity: 0.7, fontSize: '0.7rem' }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {isMe && msg.read && " • Read"}
              </Typography>
            </Box>
          );
        })}

        {isTyping && (
           <Box sx={{ alignSelf: 'flex-start', bgcolor: 'white', p: 1.5, borderRadius: 2, boxShadow: 1 }}>
             <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
               {memberName} is typing...
             </Typography>
           </Box>
        )}
      </Box>

      {/* Input Area */}
      <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #eee', display: 'flex', gap: 1 }}>
        <TextField 
          fullWidth 
          placeholder="Type a message..." 
          variant="outlined" 
          size="small"
          value={text}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={!isConnected}
        />
        <IconButton color="primary" onClick={handleSend} disabled={!isConnected || !text.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

const MemberList = ({ onSelectMember }) => {
  const { fetchMembers, isLoading } = useMemberRegistration();
  const [members, setMembers] = useState([]);
  
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await fetchMembers();
        setMembers(data || []);
      } catch (error) {
        console.error("Failed to fetch members", error);
      }
    };
    loadMembers();
  }, [fetchMembers]);

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Grid container spacing={3}>
      {(members || []).map((member) => (
        <Grid item xs={12} sm={6} md={4} key={member.memberId}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' },
              border: '1px solid',
              borderColor: 'divider'
            }}
            onClick={() => onSelectMember(member)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                {member.fullName?.charAt(0) || <Person />}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {member.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.email}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" startIcon={<FitnessCenter />}>
                Workout
              </Button>
              <Button size="small" variant="outlined" startIcon={<ChatIcon />}>
                Chat
              </Button>
              <Button size="small" variant="outlined" startIcon={<Restaurant />}>
                Diet
              </Button>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

const MemberDetail = ({ member, onBack }) => {
  const [tab, setTab] = useState(0);
  const { getLatestWorkout, currentPlan, loading: workoutLoading } = useWorkout();
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    if (member?.memberId) {
      getLatestWorkout(member.memberId);
    }
  }, [member, getLatestWorkout]);

  const handleAssignSuccess = () => {
    setIsAssigning(false);
    getLatestWorkout(member.memberId); // Refresh
  };

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 3 }}>
        Back to Members
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}>
          {member.fullName?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            {member.fullName}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {member.email} • {member.phoneNo}
          </Typography>
        </Box>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="Workout Plan" icon={<FitnessCenter />} iconPosition="start" />
        <Tab label="Diet Plan" icon={<Restaurant />} iconPosition="start" />
        <Tab label="Chat" icon={<ChatIcon />} iconPosition="start" />
        <Tab label="Profile" icon={<Person />} iconPosition="start" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              Current Workout Plan
            </Typography>
            {!isAssigning && (
              <Button 
                variant="contained" 
                onClick={() => setIsAssigning(true)}
                sx={{ borderRadius: 2 }}
              >
                Assign New Plan
              </Button>
            )}
          </Box>

          {isAssigning ? (
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" gutterBottom>Create New Workout Plan</Typography>
              <AssignWorkoutForm 
                memberId={member.memberId} 
                onSuccess={handleAssignSuccess} 
                onCancel={() => setIsAssigning(false)} 
              />
            </Paper>
          ) : (
            <Box>
              {workoutLoading ? (
                <CircularProgress />
              ) : (
                <WorkoutPlanView plan={currentPlan} />
              )}
            </Box>
          )}
        </Box>
      )}

      {tab === 1 && (
        <DietPlanTab memberId={member.memberId} />
      )}

      {tab === 2 && (
        <Box>
          <ChatWindow memberId={member.memberId} memberName={member.fullName} />
        </Box>
      )}

      {tab === 3 && (
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h6" gutterBottom>Member Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Join Date</Typography>
              <Typography variant="body1">{new Date(member.createdAt).toLocaleDateString()}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Status</Typography>
              <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 600 }}>Active</Typography>
            </Grid>
            {/* Add more details as needed */}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

const RequestsView = ({ onViewMember }) => {
    const [workoutRequests, setWorkoutRequests] = useState([]);
    const [dietRequests, setDietRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth(); 

    useEffect(() => {
        const load = async () => {
            try {
                if (user?.id) {
                    const [w, d] = await Promise.all([
                        trainerService.getWorkoutRequests(user.id),
                        trainerService.getDietRequests(user.id)
                    ]);
                    setWorkoutRequests(w || []);
                    setDietRequests(d || []);
                }
            } catch (e) { console.error("Failed to load requests", e); }
            finally { setLoading(false); }
        };
        load();
    }, [user]);

    const renderList = (title, items, type) => (
        <Paper sx={{ p: 4, borderRadius: 4, mb: 4 }}>
             <Typography variant="h5" fontWeight={700} gutterBottom>{title}</Typography>
             {items.length === 0 ? (
                 <Box sx={{ py: 4, textAlign: 'center' }}>
                     <Typography color="text.secondary">No pending requests.</Typography>
                 </Box>
             ) : (
                 <List>
                     {items.map((req) => (
                         <ListItem key={req.requestId} alignItems="flex-start" divider sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                             <ListItemText 
                                 primary={
                                     <Typography variant="subtitle1" fontWeight={700}>
                                        Request from Member ID: {req.memberId}
                                     </Typography>
                                 }
                                 secondary={
                                     <React.Fragment>
                                         <Typography component="span" variant="body2" color="text.primary">
                                            "{req.message}"
                                         </Typography>
                                         <br />
                                         <Typography component="span" variant="caption">
                                            {new Date(req.createdAt).toLocaleString()}
                                         </Typography>
                                     </React.Fragment>
                                 }
                             />
                             <Button 
                                variant="contained" 
                                color={type === 'diet' ? "success" : "primary"}
                                onClick={() => onViewMember(req.memberId)} 
                            >
                                View Member & Assign {type === 'diet' ? 'Diet' : 'Workout'}
                            </Button>
                         </ListItem>
                     ))}
                 </List>
             )}
        </Paper>
    );

    if (loading) return <CircularProgress />;

    return (
        <Box>
            {renderList("Workout Plan Requests", workoutRequests, 'workout')}
            {renderList("Diet Plan Requests", dietRequests, 'diet')}
        </Box>
    );
};

const TrainerDashboardContent = () => {
  const { logout } = useAuth();
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, profile
  const { fetchMembers } = useMemberRegistration();

  const handleRequestMemberSelect = async (memberId) => {
      try {
        const members = await fetchMembers();
        const member = members.find(m => m.memberId === memberId);
        if (member) setSelectedMember(member);
        else alert('Member not found in your gym.');
      } catch (e) { console.error(e); }
  };

  return (
    <ThemeProvider theme={dashboardTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        
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
                  TrainerPortal
                </Typography>
            </motion.div>
          </Box>
          
          <Box sx={{ px: 2, py: 2, flexGrow: 1 }}>
            {[
              { text: "Dashboard", icon: <TrendingUp />, id: 'dashboard' },
              { text: "My Members", icon: <People />, id: 'members' },
              { text: "Requests", icon: <NotificationsActive />, id: 'requests' },
              { text: "Attendance", icon: <EventNote />, id: 'attendance' },
              { text: "My Profile", icon: <Person />, id: 'profile' },
              { text: "Logout", icon: <Logout />, id: 'logout', action: logout }
            ].map((item, index) => (
              <Box
                key={item.text}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: "12px",
                  cursor: "pointer",
                  color: currentView === item.id ? "primary.main" : "text.secondary",
                  bgcolor: currentView === item.id ? "primary.50" : "transparent",
                  fontWeight: currentView === item.id ? 600 : 500,
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
                  if (item.action) item.action();
                  else setCurrentView(item.id);
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, flexShrink: 0 }}>
                    {item.icon}
                </Box>
                <motion.div
                    variants={{
                        collapsed: { opacity: 0, width: 0 },
                        expanded: { opacity: 1, width: "auto" }
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                >
                    <Typography sx={{ ml: 2 }}>{item.text}</Typography>
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
                {currentView === 'dashboard' ? 'Trainer Dashboard' : 'My Profile'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {currentView === 'dashboard' ? 'Manage workout plans and track progress.' : 'View and update your profile.'}
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
              <Avatar sx={{ bgcolor: "primary.main", width: 45, height: 45, boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)" }}>T</Avatar>
            </Box>
          </Box>

          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AnimatePresence mode="wait">
                  {selectedMember ? (
                    <motion.div 
                      key="detail"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MemberDetail 
                        member={selectedMember} 
                        onBack={() => setSelectedMember(null)} 
                      />
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box>
                        <DashboardStats onSelectMember={setSelectedMember} />
                        <Box sx={{ mb: 4, mt: 4 }}>
                          <Typography variant="h5" fontWeight={700} gutterBottom>
                            All Members
                          </Typography>
                        </Box>
                        <MemberList onSelectMember={setSelectedMember} />
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {currentView === 'requests' && (
                <motion.div
                    key="requests"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <RequestsView onViewMember={handleRequestMemberSelect} />
                </motion.div>
            )}

            {currentView === 'members' && (
                <motion.div
                    key="members"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    {selectedMember ? (
                         <MemberDetail 
                           member={selectedMember} 
                           onBack={() => setSelectedMember(null)} 
                         />
                    ) : (
                         <MemberList onSelectMember={setSelectedMember} />
                    )}
                </motion.div>
            )}

            {currentView === 'attendance' && (
                <motion.div
                    key="attendance"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <AttendanceView />
                </motion.div>
            )}

            {currentView === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Paper sx={{ p: 4, borderRadius: 4 }}>
                  <Typography variant="h6">Profile settings coming soon...</Typography>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const TrainerDashboardPage = () => (
  <MemberRegistrationProvider>
    <WorkoutProvider>
      <ChatProvider>
        <TrainerDashboardContent />
      </ChatProvider>
    </WorkoutProvider>
  </MemberRegistrationProvider>
);

export default TrainerDashboardPage;
