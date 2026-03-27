// src/pages/MemberDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import DietPlanView from '../components/DietPlanView';
import MemberWorkoutView from '../components/MemberWorkoutView';
import MemberDietView from '../components/MemberDietView';
import AttendanceView from '../components/AttendanceView';
import MemberChatWidget from '../components/MemberChatWidget';
import { getMyDietPlan } from '../services/dietService';
import { 
    getTodayActivity, 
    getMyProfile, 
    getMyWorkoutPlan, 
    getAttendanceHistory,
    getHasTrainer,
    getAvailableTrainers,
    getTodayWorkoutLogs,
    updateWorkoutLog,
    deleteWorkoutLog,
    requestDietPlan,
    requestWorkoutPlan,
    getTodayDietLogs,
    deleteDietLog,
    updateDietLog,

    getMyRequests,
    updateRequest,
    cancelRequest,
    updateProfile
} from '../services/memberService';
import WorkoutPlanView from '../components/WorkoutPlanView';


import '../styles/dashboard.css';

// --- CUSTOM SVG ICONS (MUI Replacement) ---
const IconCalendar = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

const IconRestaurant = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line>
    </svg>
);

const IconEdit = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const IconDelete = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const IconChat = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);



const IconTrending = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

const IconLogout = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);


const IconAssignment = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
);

const IconFitness = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5l11 11"></path><path d="M15 4l5 5"></path><path d="M4 15l5 5"></path><path d="M17 2l5 5"></path><path d="M2 17l5 5"></path>
    </svg>
);


const IconClose = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const IconHome = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);

const IconPerson = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const IconMenu = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

const IconBell = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

const IconMoon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const IconSun = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const IconCheck = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const IconX = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const IconMail = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const IconPhone = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
);

const IconCake = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"></path><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"></path><path d="M2 21h20"></path><path d="M7 8v3"></path><path d="M12 8v3"></path><path d="M17 8v3"></path><path d="M7 4h.01"></path><path d="M12 4h.01"></path><path d="M17 4h.01"></path>
    </svg>
);

const IconMapPin = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const IconSend = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const IconCalendarToday = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="12" y1="14" x2="12" y2="18"></line><line x1="8" y1="14" x2="8" y2="18"></line><line x1="16" y1="14" x2="16" y2="18"></line>
    </svg>
);

const IconCheckCircle = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const IconCancel = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);



// --- COMPONENTS ---

const WelcomeBanner = ({ name }) => (
    <div className="db-card" style={{ 
        background: 'var(--db-blue)', 
        color: '#fff', 
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2.5rem'
    }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', fontWeight: 800 }}>Welcome back, {name || 'Member'}! 🚀</h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>Select an activity below to get started.</p>
        </div>
        <div style={{ 
            position: 'absolute', 
            top: '-50%', 
            right: '-10%', 
            width: '300px', 
            height: '300px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '50%' 
        }} />
        <div style={{ 
            position: 'absolute', 
            bottom: '-50%', 
            left: '20%', 
            width: '200px', 
            height: '200px', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '50%' 
        }} />
    </div>
);

const NavCard = ({ title, description, icon: Icon, onClick, color }) => (
    <div 
        className="db-card nav-card" 
        onClick={onClick}
        style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            textAlign: 'center',
            padding: '2rem',
            transition: 'transform 0.2s, box-shadow 0.2s'
        }}
    >

        <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            backgroundColor: `${color}15`, 
            color: color, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '1.5rem' 
        }}>
            <Icon size={32} />
        </div>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--db-text-primary)' }}>{title}</h3>
        <p style={{ margin: 0, color: 'var(--db-text-secondary)', fontSize: '0.9rem' }}>{description}</p>
    </div>
);

const ModalOverlay = ({ title, onClose, children, actions, maxWidth = '500px' }) => (
    <div style={{ 
        position: 'fixed', 
        inset: 0, 
        zIndex: 1300, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        backdropFilter: 'blur(4px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
    }} onClick={onClose}>
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="db-card db-modal-card"
            style={{ 
                width: '100%', 
                maxWidth: maxWidth, 
                maxHeight: '90vh', 
                overflowY: 'auto',
                padding: '0',
                margin: 0
            }}
        >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--db-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{title}</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--db-text-secondary)', display: 'flex', alignItems: 'center', padding: '0.4rem' }}>
                    <IconClose />
                </button>
            </div>
            <div style={{ padding: '1.5rem' }}>
                {children}
            </div>
            {actions && (
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--db-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    {actions}
                </div>
            )}
        </motion.div>
    </div>
);

const MemberDashboardPage = () => {
  const { logout } = useAuth();
  const userId = parseInt(localStorage.getItem('userId')); // Add this line
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const tabHash = { 0: 'dashboard', 1: 'diet-plan', 2: 'workout-plan', 3: 'attendance', 4: 'profile', 5: 'my-diet', 6: 'my-workout', 7: 'chat' };
  
  const handleTabNav = (val) => {
      const hash = tabHash[val] || 'dashboard';
      navigate(`#${hash}`);
  };

  const [currentTab, setCurrentTab] = useState(0); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [hasTrainer, setHasTrainer] = useState(true); 
  const [availableTrainers, setAvailableTrainers] = useState([]);
  const [dietPlan, setDietPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  


  // Workout Logs
  const [todayWorkoutLogs, setTodayWorkoutLogs] = useState([]);
  const [todayDietLogs, setTodayDietLogs] = useState([]);
  const [dietTotals, setDietTotals] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Edit/Delete State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dietEditDialogOpen, setDietEditDialogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [editingDietLog, setEditingDietLog] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({});

  // Request Plan State
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [pendingRequest, setPendingRequest] = useState(null);
  const [isEditingRequest, setIsEditingRequest] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'success' });

  // Auto-hide feedback
  useEffect(() => {
      if (feedback.open) {
          const timer = setTimeout(() => {
              setFeedback(prev => ({ ...prev, open: false }));
          }, 3000); // 3 seconds
          return () => clearTimeout(timer);
      }
  }, [feedback.open]);

  useEffect(() => {
      const hash = location.hash.replace('#', '');
      const entry = Object.entries(tabHash).find(([k, v]) => v === hash);
      
      // Reset Request Modal State on Tab Change
      setRequestOpen(false);
      setRequestMessage('');
      setPendingRequest(null);
      setIsEditingRequest(false);
      // Reset Feedback
      setFeedback({ open: false, message: '', severity: 'success' });

      if (entry) {
          setCurrentTab(Number(entry[0]));
      } else {
          setCurrentTab(0);
      }
  }, [location.hash]);

   const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch profile and trainer status (don't block the rest if these fail)
        try {
            const profileData = await getMyProfile();
            setProfile(profileData);

            // Once we have userId from profile, we can fetch others if needed, 
            // but getting everything independently is safer for now.
            
            /* 
               If your other calls rely on userId, you might need to chain them,
               but currently they seem to derive context from token/auth.
            */
            const trainerStatus = await getHasTrainer();
            setHasTrainer(trainerStatus);
            if (!trainerStatus) {
                 const trainers = await getAvailableTrainers();
                 setAvailableTrainers(trainers || []);
            }
        } catch (e) { console.error("Profile/Trainer info fetch failed", e); }

        // Tab-specific fetching
        if (currentTab === 1) { // Diet Plan
            const plan = await getMyDietPlan();
            setDietPlan(plan);
        } else if (currentTab === 2) { // Workout Plan
            const plan = await getMyWorkoutPlan();
            setCurrentPlan(plan);

        } else if (currentTab === 5) { // My Diet Tracker
             try {
                 const data = await getTodayDietLogs(selectedDate);
                 const logs = data?.logs || (Array.isArray(data) ? data : []);
                 setTodayDietLogs(logs);
                 
                 if (data && typeof data === 'object' && !Array.isArray(data) && data.logs) {
                     setDietTotals({
                         calories: data.totalCalories || 0,
                         protein: data.totalProtein || 0,
                         carbs: data.totalCarbs || 0,
                         fat: data.totalFat || 0
                     });
                 } else {
                     const calc = logs.reduce((acc, l) => ({
                         calories: acc.calories + (Number(l.calories) || 0),
                         protein: acc.protein + (Number(l.protein) || 0),
                         carbs: acc.carbs + (Number(l.carbs) || 0),
                         fat: acc.fat + (Number(l.fat) || 0)
                     }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
                     setDietTotals(calc);
                 }
             } catch (err) {
                 console.error("Diet fetch failed:", err);
                 setTodayDietLogs([]);
             }
        } else if (currentTab === 6) { // My Workout Tracker
             const logs = await getTodayWorkoutLogs(selectedDate);
             setTodayWorkoutLogs(logs || []);
        }
      } catch (err) {
        console.error("Critical fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [currentTab, selectedDate]);

  const handleRefresh = async () => {
     fetchData();
  };

  // --- REQUEST HISTORY STATE & HANDLERS ---
  const [historyOpen, setHistoryOpen] = useState(false);
  const [requestHistory, setRequestHistory] = useState([]);

  const handleViewHistory = async () => {
      setIsLoading(true);
      try {
          const requests = await getMyRequests();
          const isDiet = currentTab === 1;
          const type = isDiet ? 'DIET' : 'WORKOUT';
          
          // Now filtering by type as backend provides it!
          const filtered = requests?.filter(r => r.type?.toUpperCase() === type) || [];
          const sorted = filtered.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          setRequestHistory(sorted);
          setHistoryOpen(true);
      } catch (err) {
          setFeedback({ open: true, message: 'Failed to load history.', severity: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleHistoryEdit = (req) => {
      setPendingRequest(req);
      setRequestMessage(req.message);
      setIsEditingRequest(true);
      setHistoryOpen(false); 
      setRequestOpen(true);
  };

  const handleHistoryCancel = async (reqId, reqType) => {
      if (!window.confirm("Are you sure you want to cancel this request?")) return;
      try {
          // Use the request's own type, lowercased for API (DIET -> diet)
          const typeParam = reqType ? reqType.toLowerCase() : (currentTab === 1 ? 'diet' : 'workout');
          await cancelRequest(typeParam, reqId);
          setFeedback({ open: true, message: 'Request cancelled.', severity: 'success' });
          handleViewHistory(); // Refresh history
      } catch (error) {
           setFeedback({ open: true, message: 'Failed to cancel.', severity: 'error' });
      }
  };

  const handleRequestModalOpen = async () => {
      setIsLoading(true);
      const isDiet = currentTab === 1;
      const type = isDiet ? 'Diet' : 'Workout';
      
      try {
          const requests = await getMyRequests();
          const pending = requests?.find(r => r.type?.toString().toUpperCase() === type.toUpperCase() && r.status === 'PENDING');
          
          if (pending) {
              setPendingRequest(pending);
              setRequestMessage(pending.message);
              setIsEditingRequest(true);
          } else {
              setPendingRequest(null);
              setRequestMessage('');
              setIsEditingRequest(false);
          }
          setRequestOpen(true);
      } catch (e) {
          console.error("Failed to check requests", e);
          setPendingRequest(null);
          setRequestMessage('');
          setIsEditingRequest(false);
          setRequestOpen(true);
      } finally {
          setIsLoading(false);
      }
  };

  const handleCancelRequest = async () => {
      if (!pendingRequest) return;
      try {
          // Use pendingRequest.type if available
          const typeParam = pendingRequest.type ? pendingRequest.type.toLowerCase() : (currentTab === 1 ? 'diet' : 'workout');
          await cancelRequest(typeParam, pendingRequest.requestId);
          setFeedback({ open: true, message: 'Request cancelled successfully.', severity: 'success' });
          setRequestOpen(false);
          setPendingRequest(null);
          // If history is open, refresh it? But this modal is on top.
      } catch (error) {
           setFeedback({ open: true, message: 'Failed to cancel request.', severity: 'error' });
      }
  };

  const handleDietLogDelete = async (logId) => {
      try {
          await deleteDietLog(logId);
          setFeedback({ open: true, message: 'Log deleted successfully', severity: 'success' });
          fetchData();
      } catch (err) {
          setFeedback({ open: true, message: 'Failed to delete log', severity: 'error' });
      }
  };

  const handleDietLogEdit = (log) => {
      setEditingDietLog(log);
      setDietEditDialogOpen(true);
  };

  const handleDietUpdateSubmit = async () => {
      try {
          await updateDietLog(editingDietLog.id, {
              quantity: parseFloat(editingDietLog.quantity),
              mealName: editingDietLog.mealName
          });
          setDietEditDialogOpen(false);
          setFeedback({ open: true, message: 'Log updated successfully', severity: 'success' });
          fetchData();
      } catch (err) {
          setFeedback({ open: true, message: 'Failed to update log', severity: 'error' });
      }
  };

  const handleWorkoutLogDelete = async (logId) => {
      // Confirmation handled in UI view
      try {
          await deleteWorkoutLog(logId);
          setFeedback({ open: true, message: 'Set deleted successfully', severity: 'success' });
          fetchData();
      } catch (err) {
          setFeedback({ open: true, message: 'Failed to delete set', severity: 'error' });
      }
  };

  const handleEditProfileOpen = () => {
      setEditProfileData({
          firstName: profile.firstName || profile.fullName?.split(' ')[0] || '',
          lastName: profile.lastName || profile.fullName?.split(' ').slice(1).join(' ') || '',
          phoneNumber: profile.phoneNo || profile.phoneNumber || '',
          address: profile.address || '',
          gender: profile.gender || '',
          dateOfBirth: profile.dateOfBirth || '',
          fitnessGoal: profile.fitnessGoal || ''
      });
      setIsEditProfileOpen(true);
  };

  const handleEditProfileSubmit = async () => {
      setIsLoading(true);
      try {
          await updateProfile(editProfileData);
          setFeedback({ open: true, message: 'Profile updated successfully!', severity: 'success' });
          setIsEditProfileOpen(false);
          fetchData(); // Refresh profile data
      } catch (error) {
          setFeedback({ open: true, message: error || 'Failed to update profile', severity: 'error' });
      } finally {
          setIsLoading(false);
      }
  };

  const handleWorkoutLogEdit = (log) => {
      setEditingLog(log);
      setEditDialogOpen(true);
  };

  const handleRequestSubmit = async () => {
        const isDiet = currentTab === 1;
        const isWorkout = currentTab === 2;
        if (!isDiet && !isWorkout) return;

        // If editing, use updateRequest
        if (isEditingRequest && pendingRequest) {
            try {
                // Use type from pendingRequest if available, else fallback to currentTab
                const typeParam = pendingRequest.type ? pendingRequest.type.toLowerCase() : (isDiet ? 'diet' : 'workout');
                await updateRequest(typeParam, pendingRequest.requestId, requestMessage);
                setFeedback({ open: true, message: 'Request updated successfully!', severity: 'success' });
                setRequestOpen(false);
                setRequestMessage('');
                setPendingRequest(null);
                return;
            } catch (error) {
                const errorMsg = error.response?.data?.message || error.message || 'Failed to update request.';
                setFeedback({ open: true, message: errorMsg, severity: 'error' });
                return;
            }
        }

        // --- NEW REQUEST LOGIC ---
        let targetTrainerId = profile?.assignedTrainer?.trainerId || profile?.assignedTrainer?.id || profile?.trainerId;
        
        if (!targetTrainerId) {
            if (isDiet && dietPlan?.trainerId) targetTrainerId = dietPlan.trainerId;
            if (isWorkout && currentPlan?.trainerId) targetTrainerId = currentPlan.trainerId;
        }

        if (!targetTrainerId) {
             // For request without trainer (optional as per docs, but logic required it before)
             // Docs satisfy trainerId is optional.
        }

        try {
            const payload = { 
                message: requestMessage
            };
            if (targetTrainerId) payload.trainerId = Number(targetTrainerId);

            console.log("Sending Request Payload:", payload);

            if (isDiet) {
                await requestDietPlan(payload);
            } else {
                 await requestWorkoutPlan(payload);
            }
            setFeedback({ open: true, message: 'Request sent successfully!', severity: 'success' });
            setRequestOpen(false);
            setRequestMessage('');
        } catch (error) {
            // Check for 'error' field first
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to send request.';
            
            // Catch specific "Pending Request" issue
            if (errorMsg && (errorMsg.includes('pending') || errorMsg.includes('already have a pending'))) {
                setFeedback({ open: true, message: '1 Request already sent before', severity: 'warning' });
                // Optionally reload to find the pending request and switch to edit mode?
                // For now, the user just asked for the message.
            } else {
                setFeedback({ open: true, message: errorMsg, severity: 'error' });
            }
        }
  };



  const handleUpdateSubmit = async () => {
      if (!editingLog) return;
      try {
          await updateWorkoutLog(editingLog.id, {
              exerciseId: editingLog.exercise?.id,
              sets: parseInt(editingLog.sets),
              reps: parseInt(editingLog.reps),
              weightKg: parseFloat(editingLog.weightKg),
              completed: editingLog.completed
          });
          setEditDialogOpen(false);
          setEditingLog(null);
          handleRefresh();
      } catch (e) { console.error("Update failed", e); }
  };

  const navItems = [
      { text: "Dashboard", icon: <IconHome />, id: 0 },
      { text: "Diet Plan", icon: <IconAssignment />, id: 1 },
      { text: "My Diet", icon: <IconRestaurant />, id: 5 },
      { text: "Workout Plan", icon: <IconFitness />, id: 2 },
      { text: "My Workout", icon: <IconEdit />, id: 6 },
      { text: "Chat", icon: <IconChat />, id: 7 },
      { text: "Attendance", icon: <IconCalendar />, id: 3 },
      { text: "Profile", icon: <IconPerson />, id: 4 },
  ];

  return (
    <div className={`dashboard-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{ '--db-accent': '#007BFF' }}>
        {/* --- FEEDBACK SNACKBAR (Styled as fixed toast) --- */}
        <AnimatePresence>
            {feedback.open && (
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    style={{ 
                        position: 'fixed', 
                        bottom: '24px', 
                        right: '24px', 
                        padding: '12px 24px', 
                        borderRadius: '8px', 
                        background: feedback.severity === 'error' ? '#ef4444' : '#22c55e', 
                        color: 'white',
                        fontWeight: 600,
                        zIndex: 2000,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    {feedback.message}
                </motion.div>
            )}
        </AnimatePresence>

        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
            <div className="mobile-backdrop" onClick={closeMobileMenu} />
        )}

        <nav className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
            <div className="sidebar-logo">
                <div className="logo-inner">
                    <IconTrending />
                </div>
                <div className="nav-item-text" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--db-text-primary)' }}>
                    GymKro
                </div>
                <button className="mobile-close-btn" onClick={closeMobileMenu}>
                    <IconClose />
                </button>
            </div>

            <div className="sidebar-nav">
                {navItems.map(item => (
                    <div 
                        key={item.id}
                        className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
                        onClick={() => {
                            handleTabNav(item.id);
                            closeMobileMenu();
                        }}
                    >
                        <div className="nav-item-icon">{item.icon}</div>
                        <span className="nav-item-text mobile-label">{item.text}</span>
                    </div>
                ))}
            </div>

            <div style={{ padding: '1rem' }}>
                 <div className="nav-item" onClick={logout}>
                    <div className="nav-item-icon"><IconLogout /></div>
                    <span className="nav-item-text mobile-label">Logout</span>
                </div>
            </div>
        </nav>

        <main className="dashboard-main">
            <div className="mobile-page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h1 className="mobile-main-title">{navItems.find(i => i.id === currentTab)?.text || "Dashboard"}</h1>
                        <p style={{ margin: '0.2rem 0 0 0', color: 'var(--db-text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {currentTab === 5 
                                ? "Fuel your body, track your nutrition." 
                                : currentTab === 6
                                    ? "Track your lifts and smash your PRs."
                                    : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                            }
                        </p>
                    </div>

                    <div className="mobile-user-badge" onClick={() => handleTabNav(4)}>
                        <div className="user-info">
                            <span className="user-name">{profile?.fullName || profile?.firstName || 'Member'}</span>
                            <span className="user-role" style={{ color: 'var(--db-blue)', fontSize: '0.65rem', fontWeight: 800 }}>MEMBER</span>
                        </div>
                        <div className="user-avatar" style={{ borderColor: 'var(--db-blue)', width: '38px', height: '38px', fontSize: '0.9rem' }}>
                            {(profile?.fullName?.[0] || profile?.firstName?.[0] || 'M').toUpperCase()}
                        </div>
                    </div>
                </div>

                {(currentTab === 1 || currentTab === 2) && (
                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
                        <button className="db-btn db-btn-secondary" style={{ flex: 1, padding: '0.6rem 0.5rem', fontSize: '0.8rem' }} onClick={handleViewHistory}>
                            Your Request
                        </button>
                        <button className="db-btn db-btn-primary" style={{ flex: 1.2, padding: '0.6rem 0.5rem', fontSize: '0.8rem' }} onClick={handleRequestModalOpen}>
                            Request {currentTab === 1 ? "Diet" : "Workout"}
                        </button>
                    </div>
                )}
            </div>
            <header className="dashboard-header">
                <div className="header-title">
                    <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
                        <IconMenu />
                    </button>
                    <div>
                        <h1 style={{ margin: 0 }}>{navItems.find(i => i.id === currentTab)?.text || "Dashboard"}</h1>
                        <p style={{ margin: 0, color: 'var(--db-text-secondary)' }}>
                        {currentTab === 5 
                            ? "Fuel your body, track your nutrition." 
                            : currentTab === 6
                                ? "Track your lifts and smash your PRs."
                                : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                        }
                    </p>
                </div>
            </div>
            <div className="header-user">
                     {/* Date Picker for Diet (5) Only - Workout (6) has local picker */}

                     <button 
                        onClick={toggleTheme}
                        className="db-btn-icon theme-toggle"
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                     >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isDarkMode ? 'sun' : 'moon'}
                                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                transition={{ duration: 0.2 }}
                                style={{ display: 'flex' }}
                            >
                                {isDarkMode ? <IconSun size={20} /> : <IconMoon size={20} />}
                            </motion.div>
                        </AnimatePresence>
                     </button>
                     <div className="user-info" onClick={() => handleTabNav(4)} style={{ cursor: 'pointer' }}>
                        <span className="user-name">{profile?.fullName || profile?.firstName || 'Member'}</span>
                        <span className="user-role" style={{ color: 'var(--db-blue)' }}>MEMBER</span>
                     </div>
                     <div className="user-avatar" style={{ borderColor: 'var(--db-blue)' }} onClick={() => handleTabNav(4)}>
                        {(profile?.fullName?.[0] || profile?.firstName?.[0] || 'M').toUpperCase()}
                     </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* 1. HOME TAB */}
                    {currentTab === 0 && (
                        <>
                            <WelcomeBanner name={profile?.fullName || profile?.firstName} />
                            <div className="analytics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                                <NavCard 
                                    title="Attendance & Rewards" 
                                    description="View recent history, streaks, and engagement rewards." 
                                    icon={IconCalendar} 
                                    onClick={() => handleTabNav(3)}
                                    color="#007BFF" 
                                />
                                <NavCard 
                                    title="Assigned Diet Plan" 
                                    description={hasTrainer ? "View the diet plan assigned by your personal trainer." : "No trainer assigned."} 
                                    icon={IconAssignment} 
                                    onClick={() => handleTabNav(1)}
                                    color="#F6A23E"
                                />
                                <NavCard 
                                    title="Create Own Diet" 
                                    description="Log your daily meals and create your own diet schedule." 
                                    icon={IconRestaurant} 
                                    onClick={() => handleTabNav(5)}
                                    color="#E91E63"
                                />
                                <NavCard 
                                    title="Assigned Workout Plan" 
                                    description={hasTrainer ? "View the workout plan assigned by your personal trainer." : "No trainer assigned."} 
                                    icon={IconFitness} 
                                    onClick={() => handleTabNav(2)}
                                    color="#27C499"
                                />
                                <NavCard 
                                    title="Create Own Workout" 
                                    description="Log your daily workout exercises and sets." 
                                    icon={IconEdit} 
                                    onClick={() => handleTabNav(6)}
                                    color="#8E24AA"
                                />
                            </div>
                        </>
                    )}

                    {/* 2. ASSIGNED DIET PLAN */}
                    {currentTab === 1 && (
                        <div className="db-card">
                            <DietPlanView plan={dietPlan} hasTrainer={hasTrainer} availableTrainers={availableTrainers} trainerId={profile?.assignedTrainer?.trainerId || profile?.assignedTrainer?.id || profile?.trainerId} />
                        </div>
                    )}

                    {/* 3. ASSIGNED WORKOUT PLAN */}
                    {currentTab === 2 && (
                        <div className="db-card">
                            <WorkoutPlanView plan={currentPlan} hasTrainer={hasTrainer} availableTrainers={availableTrainers} trainerId={profile?.assignedTrainer?.trainerId || profile?.assignedTrainer?.id || profile?.trainerId} />
                        </div>
                    )}

                    {/* 4. ATTENDANCE */}
                    {currentTab === 3 && (
                        <div className="db-card" style={{ background: 'transparent', boxShadow: 'none', padding: 0, border: 'none' }}>
                             <AttendanceView />
                        </div>
                    )}

                    {/* 5. PROFILE */}
                    {currentTab === 4 && profile && (
                        <div style={{ textAlign: 'center', padding: '1rem', margin: '0 0' }}>
                            {/* Header */}
                            <div className="db-card profile-header-content" style={{ 
                                background: 'rgba(255,255,255,0.03)', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                marginBottom: '3rem',
                                padding: '3rem',
                                borderRadius: '32px',
                            }}>
                                <div style={{ 
                                    width: '140px', 
                                    height: '140px', 
                                    minWidth: '140px',
                                    borderRadius: '50%', 
                                    background: 'linear-gradient(135deg, #007BFF 0%, #00d2ff 100%)', 
                                    color: 'white', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: '3.5rem',
                                    fontWeight: 'bold',
                                    border: '4px solid rgba(255,255,255,0.1)'
                                }}>
                                    {profile.fullName ? profile.fullName[0].toUpperCase() : (profile.firstName ? profile.firstName[0].toUpperCase() : <IconPerson size={56} />)}
                                </div>
                                <div style={{ flex: 1, width: '100%' }}>
                                    <h2 className="profile-name" style={{ margin: '0 0 0.8rem 0', fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--db-text-primary)' }}>
                                        {profile.fullName || (profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : (profile.firstName || 'Member Profile'))}
                                    </h2>
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                                        <div className="db-badge db-badge-success">
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 10px currentColor' }} />
                                            {profile.status || 'Active'}
                                        </div>
                                        <div className="db-badge db-badge-info">
                                            <IconTrending size={18} />
                                            {profile.membershipPlan || profile.plan || 'No Plan'}
                                        </div>
                                        <button 
                                            className="db-btn" 
                                            onClick={handleEditProfileOpen}
                                            style={{ 
                                                marginLeft: 'auto',
                                                background: 'var(--db-blue)',
                                                color: 'white',
                                                padding: '0.8rem 1.5rem', 
                                                fontSize: '1rem', 
                                                borderRadius: '16px',
                                                fontWeight: 600,
                                                border: 'none'
                                            }}
                                        >
                                            <IconEdit size={18} style={{ marginRight: '0.6rem' }} />
                                            Update Profile
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-grid" style={{ textAlign: 'left' }}>
                                 {/* Personal Info Card */}
                                 <div className="db-card profile-card profile-card-content">
                                     <h4 style={{ color: 'var(--db-blue)', marginBottom: '2.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                         <div style={{ width: 12, height: 12, borderRadius: '3px', background: 'var(--db-blue)' }} />
                                         Personal Data
                                     </h4>
                                     <div className="profile-details-grid">
                                         <div style={{ gridColumn: 'span 2' }}>
                                             <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom:'0.6rem', fontWeight: 500 }}>IDENTIFICATION</div>
                                             <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--db-text-primary)' }}>{profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'N/A'}</div>
                                         </div>
                                         <div>
                                             <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom:'0.6rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                 <IconMail size={16} /> CONTACT EMAIL
                                             </div>
                                             <div style={{ fontSize: '1rem', fontWeight: 600 }}>{profile.email || 'N/A'}</div>
                                         </div>
                                         <div>
                                             <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom:'0.6rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                 <IconPhone size={16} /> MOBILE NUMBER
                                             </div>
                                             <div style={{ fontSize: '1rem', fontWeight: 600 }}>{profile.phoneNo || 'N/A'}</div>
                                         </div>
                                          <div>
                                             <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom:'0.6rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                 GENDER IDENTITY
                                             </div>
                                             <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{profile.gender || 'N/A'}</div>
                                         </div>
                                         <div>
                                             <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom:'0.6rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                 <IconCake size={16} /> BIRTH DATE
                                             </div>
                                             <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{profile.dateOfBirth || 'N/A'}</div>
                                         </div>
                                     </div>
                                 </div>
                                 
                                 {/* Stats Card */}
                                 <div className="db-card profile-card profile-card-content">
                                     <h4 style={{ color: '#f59e0b', marginBottom: '2.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                         <div style={{ width: 12, height: 12, borderRadius: '3px', background: '#f59e0b' }} />
                                         Membership Stats
                                     </h4>
                                      <div className="profile-details-grid">
                                         <div style={{ gridColumn: 'span 2' }}>
                                             <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom:'0.6rem', fontWeight: 500 }}>PRIMARY FITNESS GOAL</div>
                                             <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '-0.02em' }}>{profile.fitnessGoal || 'Not set'}</div>
                                         </div>
                                         <div>
                                             <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom:'0.6rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                 <IconCalendar size={16} /> JOINING DATE
                                             </div>
                                             <div style={{ fontSize: '1rem', fontWeight: 600 }}>{profile.startDate || profile.joiningDate || (profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A')}</div>
                                         </div>
                                         <div>
                                             <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom:'0.6rem', fontWeight: 500 }}>VALID UNTIL</div>
                                             <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>{profile.daysRemaining !== undefined ? profile.daysRemaining + ' Days' : 'N/A'}</div>
                                         </div>
                                         <div style={{ gridColumn: 'span 2' }}>
                                              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom:'0.6rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                  <IconMapPin size={16} /> RESIDENTIAL ADDRESS
                                              </div>
                                              <div style={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1.6, color: 'var(--db-text-primary)' }}>{profile.address || 'N/A'}</div>
                                         </div>
                                     </div>
                                 </div>
                            </div>
                        </div>
                    )}

                    {/* 5. MY DIET (LOGS) */}
                    {currentTab === 5 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MemberDietView 
                                logs={todayDietLogs}
                                dietTotals={dietTotals}
                                onRefresh={fetchData}
                                selectedDate={selectedDate}
                                onDateChange={setSelectedDate}
                                onEdit={handleDietLogEdit}
                                onDelete={handleDietLogDelete}
                            />
                        </motion.div>
                    )}

                    {/* 6. CREATE OWN WORKOUT */}
                    {currentTab === 6 && (
                        <MemberWorkoutView 
                            logs={todayWorkoutLogs}
                            onRefresh={fetchData}
                            selectedDate={selectedDate}
                            onEdit={handleWorkoutLogEdit}
                            onDelete={handleWorkoutLogDelete}
                            onDateChange={setSelectedDate}
                        />
                    )}

                    {/* 7. CHAT */}
                    {currentTab === 7 && (
                        <div className="analytics-grid">
                            <div className="db-card" style={{ gridColumn: 'span 12', padding: 0, overflow: 'hidden', background: 'transparent', border: 'none' }}>
                                <MemberChatWidget currentUserId={userId} token={localStorage.getItem('token')} />
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* --- REQUEST PLAN MODAL --- */}
            {requestOpen && (
                <ModalOverlay 
                    title={`Request ${currentTab === 1 ? 'Diet' : 'Workout'} Plan`} 
                    onClose={() => setRequestOpen(false)}
                    actions={
                        <>
                            <button className="db-btn" onClick={() => setRequestOpen(false)}>Cancel</button>
                            <button className="db-btn db-btn-primary" onClick={handleRequestSubmit}>Send Request</button>
                        </>
                    }
                >
                    <textarea 
                        className="db-input"
                        style={{ width: '100%', minHeight: '120px', resize: 'vertical' }}
                        placeholder="Message to Trainer (Optional)"
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                    />
                </ModalOverlay>
            )}

            {/* --- EDIT DIET LOG MODAL --- */}
            {dietEditDialogOpen && (
                <ModalOverlay 
                    title="Edit Diet Log" 
                    onClose={() => setDietEditDialogOpen(false)}
                    actions={
                        <>
                            <button className="db-btn" onClick={() => setDietEditDialogOpen(false)}>Cancel</button>
                            <button className="db-btn db-btn-primary" onClick={handleDietUpdateSubmit}>Update</button>
                        </>
                    }
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Food Item</label>
                            <input className="db-input" value={editingDietLog?.name || editingDietLog?.foodName || editingDietLog?.foodItem?.name || ''} disabled style={{ opacity: 0.7 }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Meal Type</label>
                            <select 
                                className="db-input" 
                                value={editingDietLog?.mealName || 'BREAKFAST'} 
                                onChange={(e) => setEditingDietLog({...editingDietLog, mealName: e.target.value})}
                            >
                                <option value="BREAKFAST">Breakfast</option>
                                <option value="LUNCH">Lunch</option>
                                <option value="DINNER">Dinner</option>
                                <option value="SNACK">Snack</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Quantity (g/ml)</label>
                            <input 
                                className="db-input" 
                                type="number" 
                                value={editingDietLog?.quantity || ''} 
                                onChange={(e) => setEditingDietLog({...editingDietLog, quantity: e.target.value})} 
                                placeholder="e.g. 250"
                            />
                        </div>
                    </div>
                </ModalOverlay>
            )}

            {/* --- EDIT LOG MODAL --- */}
            {editDialogOpen && (
                <ModalOverlay 
                    title="Edit Workout Log" 
                    onClose={() => setEditDialogOpen(false)}
                    actions={
                        <>
                            <button className="db-btn" onClick={() => setEditDialogOpen(false)}>Cancel</button>
                            <button className="db-btn db-btn-primary" onClick={handleUpdateSubmit}>Update</button>
                        </>
                    }
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Exercise</label>
                            <input className="db-input" value={editingLog?.exercise?.name || ''} disabled />
                        </div>
                        <div className="form-group">
                            <label>Sets</label>
                            <input className="db-input" type="number" value={editingLog?.sets || ''} onChange={(e) => setEditingLog({...editingLog, sets: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Reps</label>
                            <input className="db-input" type="number" value={editingLog?.reps || ''} onChange={(e) => setEditingLog({...editingLog, reps: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Weight (kg)</label>
                            <input className="db-input" type="number" value={editingLog?.weightKg || ''} onChange={(e) => setEditingLog({...editingLog, weightKg: e.target.value})} />
                        </div>
                    </div>
                </ModalOverlay>
            )}


            {/* HISTORY MODAL */}
            {historyOpen && (
                <ModalOverlay title="Request History" onClose={() => setHistoryOpen(false)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {requestHistory.length === 0 ? (
                            <p style={{ color: 'var(--db-text-secondary)', textAlign: 'center', padding: '1rem' }}>No requests found for this category.</p>
                        ) : (
                            requestHistory.map((req, index) => (
                                <div key={`${req.requestId}_${index}`} style={{ 
                                    padding: '1rem', 
                                    background: 'rgba(255,255,255,0.05)', 
                                    borderRadius: '8px',
                                    border: '1px solid var(--db-border)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div>
                                            <span style={{ 
                                                padding: '0.2rem 0.6rem', 
                                                borderRadius: '4px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 'bold',
                                                background: req.status === 'PENDING' ? '#fbbf24' : (req.status === 'APPROVED' || req.status === 'ACCEPTED') ? '#22c55e' : '#ef4444',
                                                color: req.status === 'PENDING' ? 'black' : 'white'
                                            }}>
                                                {req.status}
                                            </span>
                                            <span style={{ marginLeft: '0.8rem', fontSize: '0.8rem', color: 'var(--db-text-secondary)' }}>
                                                {new Date(req.createdAt).toLocaleDateString() || 'N/A'}
                                            </span>
                                            {req.trainerId && (
                                                <span style={{ marginLeft: '0.8rem', fontSize: '0.8rem', color: 'var(--db-text-secondary)' }}>
                                                    • Sent to Trainer #{req.trainerId}
                                                </span>
                                            )}
                                        </div>
                                        {req.status === 'PENDING' && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button 
                                                    onClick={() => handleHistoryEdit(req)}
                                                    className="db-btn-icon"
                                                    title="Edit Message"
                                                    style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '6px', borderRadius: '4px' }}
                                                >
                                                    <IconEdit size={16} />
                                                </button>
                                            <button 
                                                onClick={() => handleHistoryCancel(req.requestId, req.type)}
                                                className="db-btn-icon"
                                                title="Cancel Request"
                                                style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '6px', borderRadius: '4px' }}
                                            >
                                                    <IconDelete size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.4', color: 'var(--db-text-primary)' }}>{req.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </ModalOverlay>
            )}

            {/* REQUEST MODAL */}
            {requestOpen && (
                <ModalOverlay 
                    title={isEditingRequest ? `Edit ${currentTab === 1 ? 'Diet' : 'Workout'} Request` : `Request ${currentTab === 1 ? 'Diet' : 'Workout'} Plan`}
                    onClose={() => setRequestOpen(false)}
                    actions={
                        <>
                            {isEditingRequest ? (
                                <>
                                    <button className="db-btn db-btn-primary" onClick={handleRequestSubmit}>
                                        Update Request
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="db-btn db-btn-secondary" onClick={() => setRequestOpen(false)}>Cancel</button>
                                    <button className="db-btn db-btn-primary" onClick={handleRequestSubmit}>Send Request</button>
                                </>
                            )}
                        </>
                    }
                    maxWidth="800px"
                >
                     <p style={{ color: 'var(--db-text-secondary)', marginBottom: '1rem' }}>
                        {isEditingRequest 
                            ? "You have a pending request. You can update your message below." 
                            : "Let your trainer know what kind of plan you're looking for (e.g., 'Weight loss', 'Muscle gain', 'Vegetarian')."}
                    </p>
                    <textarea 
                        className="db-input" 
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder="Type your message here..."
                        style={{ minHeight: '100px', resize: 'vertical' }}
                    />
                </ModalOverlay>
            )}

            {/* --- EDIT PROFILE MODAL --- */}
            {isEditProfileOpen && (
                <ModalOverlay 
                    title="Update Profile Information" 
                    onClose={() => setIsEditProfileOpen(false)}
                    actions={
                        <>
                            <button className="db-btn db-btn-secondary" onClick={() => setIsEditProfileOpen(false)} style={{ borderRadius: '12px' }}>Cancel</button>
                            <button className="db-btn db-btn-primary" onClick={handleEditProfileSubmit} style={{ borderRadius: '12px', boxShadow: '0 8px 16px -4px rgba(0, 123, 255, 0.4)' }}>Save Changes</button>
                        </>
                    }
                    maxWidth="800px"
                >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '0.5rem' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginBottom: '0.6rem', fontWeight: 600 }}>
                                <IconPerson size={14} /> FIRST NAME
                            </label>
                            <input 
                                className="db-input" 
                                style={{ borderRadius: '14px', padding: '1rem' }}
                                value={editProfileData.firstName}
                                onChange={(e) => setEditProfileData({...editProfileData, firstName: e.target.value})}
                                placeholder="Enter first name"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginBottom: '0.6rem', fontWeight: 600 }}>
                                <IconPerson size={14} /> LAST NAME
                            </label>
                            <input 
                                className="db-input" 
                                style={{ borderRadius: '14px', padding: '1rem' }}
                                value={editProfileData.lastName}
                                onChange={(e) => setEditProfileData({...editProfileData, lastName: e.target.value})}
                                placeholder="Enter last name"
                            />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginBottom: '0.6rem', fontWeight: 600 }}>
                                <IconPhone size={14} /> PHONE NUMBER
                            </label>
                            <input 
                                className="db-input" 
                                style={{ borderRadius: '14px', padding: '1rem' }}
                                value={editProfileData.phoneNumber}
                                onChange={(e) => setEditProfileData({...editProfileData, phoneNumber: e.target.value})}
                                placeholder="e.g. +1 234 567 890"
                            />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginBottom: '0.6rem', fontWeight: 600 }}>
                                <IconMapPin size={14} /> RESIDENTIAL ADDRESS
                            </label>
                            <input 
                                className="db-input" 
                                style={{ borderRadius: '14px', padding: '1rem' }}
                                value={editProfileData.address}
                                onChange={(e) => setEditProfileData({...editProfileData, address: e.target.value})}
                                placeholder="Enter full address"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginBottom: '0.6rem', fontWeight: 600 }}>
                                GENDER
                            </label>
                            <select 
                                className="db-input" 
                                style={{ borderRadius: '14px', padding: '1rem', cursor: 'pointer' }}
                                value={editProfileData.gender}
                                onChange={(e) => setEditProfileData({...editProfileData, gender: e.target.value})}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginBottom: '0.6rem', fontWeight: 600 }}>
                                <IconCalendar size={14} /> DATE OF BIRTH
                            </label>
                            <input 
                                type="date"
                                className="db-input" 
                                style={{ borderRadius: '14px', padding: '1rem' }}
                                value={editProfileData.dateOfBirth}
                                onChange={(e) => setEditProfileData({...editProfileData, dateOfBirth: e.target.value})}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--db-text-secondary)', marginBottom: '0.6rem', fontWeight: 600 }}>
                                <IconFitness size={14} /> FITNESS GOAL
                            </label>
                            <input 
                                className="db-input" 
                                style={{ borderRadius: '14px', padding: '1rem' }}
                                value={editProfileData.fitnessGoal}
                                onChange={(e) => setEditProfileData({...editProfileData, fitnessGoal: e.target.value})}
                                placeholder="e.g. Weight Loss, Muscle Gain, Endurance"
                            />
                        </div>
                    </div>
                </ModalOverlay>
            )}

        </main>
    </div>
  );
};

export default MemberDashboardPage;



