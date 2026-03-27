import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gymkroModernLightBg from '../assets/landing/gymkro_modern_light_bg.png'; // New Lighter BG
import heroBg from '../assets/gym_background.png';

// Admin Images
import adminMemberImg from '../assets/landing/admin_member_list_ui.png';
import adminAnalyticsImg from '../assets/landing/admin_analytics_ui.png';
import adminChatImg from '../assets/landing/admin_chat_ui.png';
import adminTrainerImg from '../assets/landing/admin_trainer_management_ui.png';

// Trainer Images
import trainerAssignImg from '../assets/landing/trainer_assign_plans_ui.png';
import trainerChatImg from '../assets/landing/trainer_chat_multi_ui.png';
import trainerRequestImg from '../assets/landing/trainer_client_tracking_ui.png';
import trainerMacroImg from '../assets/landing/trainer_nutrition_ui.png';
import trainerNutritionImg from '../assets/landing/trainer_nutrition_ui.png';

// Member Images
import memberAssignedImg from '../assets/landing/member_assigned_plans_ui.png';
import memberSelfDesignImg from '../assets/landing/member_self_design_ui.png';
import memberChatMultiImg from '../assets/landing/member_chat_ui_multi_role.png';
import memberRequestImg from '../assets/landing/member_request_ui.png';


import { useTheme } from '../context/ThemeContext';
import gymkroLogo from '../assets/gymkro_logo.png';

import '../styles/LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [scrolled, setScrolled] = React.useState(false);
    const [activeRole, setActiveRole] = React.useState('admin');
    const [activeFeatureIndex, setActiveFeatureIndex] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Reset feature index when role changes
    React.useEffect(() => {
        setActiveFeatureIndex(0);
    }, [activeRole]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const roles = {
        admin: {
            id: 'admin',
            label: 'Admin Panel',
            color: '#818cf8',
            title: 'Total Gym Control',
            desc: 'The ultimate command center for gym owners. Monitor your entire facility, track staff performance, and manage your member base with precision.',
            features: [
                { title: 'Member Database', desc: 'Secure storage & advanced search', image: adminMemberImg },
                { title: 'Live Analytics', desc: 'Track gym-wide growth and trends', image: adminAnalyticsImg },
                { title: 'Real-time Chat', desc: 'Sync with your entire team instantly', image: adminChatImg },
                { title: 'Trainer Management', desc: 'Monitor plans, logs & staff activity', image: adminTrainerImg }
            ]
        },
        trainer: {
            id: 'trainer',
            label: 'Trainer Panel',
            color: '#fb923c',
            title: 'Empower Your Coaching',
            desc: 'Tools designed for performance. Build custom plans, track client progress in real-time, and provide elite support through direct messaging.',
            features: [
                { title: 'Plan Designer', desc: 'Assign workout and diet plans', image: trainerAssignImg },
                { title: 'Coaching Chat', desc: 'Chat with members and admin', image: trainerChatImg },
                { title: 'Request Inbox', desc: 'Receive workout and diet requests', image: trainerRequestImg },
                { title: 'Macros Library', desc: 'Professional nutritional database', image: trainerMacroImg }
            ]
        },
        member: {
            id: 'member',
            label: 'Member App',
            color: '#22c55e',
            title: 'Reach Your Peak',
            desc: 'Everything you need to succeed in your pocket. Sync with your trainer, log your progress, and stay motivated with clear visual tracking.',
            features: [
                { title: 'Digital Plans', desc: 'Get diet and workout from trainer', image: memberAssignedImg },
                { title: 'Self-Design', desc: 'Create own diet and workout', image: memberSelfDesignImg },
                { title: 'Multi-Role Chat', desc: 'Chat with trainer and admin', image: memberChatMultiImg },
                { title: 'Instant Requests', desc: 'Send request for diet/workout direktly to trainer', image: memberRequestImg }
            ],
            isMobile: true
        }
    };

    return (
        <div style={{ 
            fontFamily: "'Inter', sans-serif", 
            background: isDark 
                ? `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url(${gymkroModernLightBg}) center/cover fixed no-repeat`
                : '#f8fafc',
            color: isDark ? '#f1f5f9' : '#1e293b', 
            minHeight: '100vh',
            overflowX: 'hidden'
        }}>
            
            {/* Navbar */}

            <nav className={`landing-navbar ${scrolled ? 'scrolled' : ''} ${!isDark ? 'light-theme' : ''}`}>
                <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <img src={gymkroLogo} alt="GymKro Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                    GymKro
                </div>

                <div className="nav-links">
                    {['Admin', 'Trainer', 'Member'].map((item) => (
                        <button 
                            key={item} 
                            onClick={() => {
                                setActiveRole(item.toLowerCase());
                                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                            }} 
                            className="nav-link"
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="nav-auth-buttons">
                    <button onClick={() => navigate('/login')} className="btn-login">Login</button>
                    <button onClick={() => navigate('/register')} className="btn-get-started">Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{ 
                position: 'relative', 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                textAlign: 'center', 
                padding: '0 1rem',
                overflow: 'hidden',
                backgroundColor: '#000' // Fallback for image load failure
            }}>
                <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%', 
                    zIndex: 0 
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1 }}></div>
                    <img src={heroBg} alt="Gym Background" style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
                </div>

                <motion.div initial="hidden" animate="visible" variants={fadeInUp} style={{ maxWidth: '800px', zIndex: 1 }}>
                    <motion.h1 style={{ 
                        fontSize: 'clamp(3rem, 5vw, 5rem)', 
                        fontWeight: 900, 
                        marginBottom: '1.5rem', 
                        lineHeight: 1.1,
                        textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        color: '#fff'
                    }}>
                        Elevate Your <span style={{ color: '#38bdf8' }}>Fitness</span> Empire
                    </motion.h1>
                    <motion.p style={{ fontSize: '1.25rem', color: '#e2e8f0', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        The all-in-one management platform for gyms, trainers, and athletes. Streamline operations, empower coaches, and crush goals.
                    </motion.p>
                    <motion.div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                         <button onClick={() => navigate('/register')} style={{ padding: '1rem 2.5rem', borderRadius: '50px', border: 'none', background: '#38bdf8', color: '#fff', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.5)' }}>Start Free Trial</button>
                         <button onClick={() => navigate('/login')} style={{ padding: '1rem 2.5rem', borderRadius: '50px', border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>Login</button>
                    </motion.div>
                </motion.div>
            </header>

            {/* Interactive Feature Explorer */}
            <section id="features" style={{ padding: '8rem 2rem', background: isDark ? 'linear-gradient(to bottom, #0f172a, #1a1a2e)' : '#f8fafc' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Explore the Ecosystem</h2>
                        <p style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Select a role to see how GymKro empowers your journey.</p>
                    </div>

                    {/* Role Tabs */}
                    <div className={`role-tabs-container ${isDark ? 'dark' : ''}`}>
                        {Object.values(roles).map(role => (
                            <button
                                key={role.id}
                                onClick={() => setActiveRole(role.id)}
                                className={`role-tab-btn ${activeRole === role.id ? 'active' : ''}`}
                                style={{
                                    '--role-color': role.color,
                                    color: activeRole === role.id ? '#fff' : (isDark ? '#cbd5e1' : '#475569'),
                                    boxShadow: activeRole === role.id ? `0 10px 20px -5px ${role.color}66` : 'none'
                                }}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Display */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeRole}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="feature-content-wrapper"
                        >
                            <div className="feature-text-section">
                                <div style={{ color: roles[activeRole].color, fontWeight: 700, letterSpacing: '2px', marginBottom: '1rem', textTransform: 'uppercase' }}>{roles[activeRole].label}</div>
                                <h3 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.2 }}>{roles[activeRole].title}</h3>
                                <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '2.5rem' }}>
                                    {roles[activeRole].desc}
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                                    {roles[activeRole].features.map((feat, i) => (
                                         <div 
                                             key={i}
                                             onClick={() => setActiveFeatureIndex(i)}
                                             style={{
                                                 padding: '1rem',
                                                 borderRadius: '12px',
                                                 cursor: 'pointer',
                                                 background: activeFeatureIndex === i ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)') : 'transparent',
                                                 border: `1px solid ${activeFeatureIndex === i ? roles[activeRole].color : 'transparent'}`,
                                                 transition: 'all 0.2s ease'
                                             }}
                                         >
                                             <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.1rem', color: activeFeatureIndex === i ? roles[activeRole].color : (isDark ? '#f1f5f9' : '#1e293b') }}>{feat.title}</div>
                                             <div style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.4 }}>{feat.desc}</div>
                                         </div>
                                     ))}
                                 </div>
                                 <button 
                                     onClick={() => navigate('/login')} 
                                     style={{ 
                                         padding: '0.8rem 2rem', 
                                         borderRadius: '8px', 
                                         border: 'none', 
                                         background: roles[activeRole].color, 
                                         color: '#fff', 
                                         fontWeight: 700, 
                                         cursor: 'pointer',
                                         boxShadow: `0 8px 20px -4px ${roles[activeRole].color}55`
                                     }}
                                 >
                                     Login as {roles[activeRole].id.charAt(0).toUpperCase() + roles[activeRole].id.slice(1)}
                                 </button>
                             </div>
                             <div className="feature-image-section">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${activeRole}-${activeFeatureIndex}`}
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                                    >
                                        <img 
                                            src={roles[activeRole].features[activeFeatureIndex].image} 
                                            alt={`${roles[activeRole].features[activeFeatureIndex].title} Preview`} 
                                            style={{ 
                                                maxWidth: '100%', 
                                                height: roles[activeRole].isMobile ? '550px' : 'auto',
                                                borderRadius: roles[activeRole].isMobile ? '0' : '16px',
                                                objectFit: 'contain',
                                                filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))',
                                                border: !roles[activeRole].isMobile ? `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` : 'none'
                                            }} 
                                        />
                                    </motion.div>
                                </AnimatePresence>
                             </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
            {/* Footer */}
            <footer style={{ padding: '4rem 2rem', textAlign: 'center', borderTop: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)' }}>
                <p style={{ color: isDark ? '#64748b' : '#94a3b8' }}>&copy; {new Date().getFullYear()} GymKro. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
