import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import { Whatshot, FitnessCenter, MonitorWeight, FormatQuote, AccessTime } from '@mui/icons-material';
import { getHomeStats } from '../services/memberService';
import { motion } from 'framer-motion';

const StatCard = ({ icon, title, value, subtitle, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay * 0.1 }}
    >
        <Card sx={{ height: '100%', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
             <Box sx={{ position: 'absolute', right: -15, top: -15, opacity: 0.1, transform: 'rotate(15deg)' }}>
                {React.cloneElement(icon, { sx: { fontSize: 80, color: color } })}
            </Box>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}15`, color: color, display: 'flex' }}>
                         {React.cloneElement(icon, { sx: { fontSize: 24 } })}
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>{title}</Typography>
                </Box>
                <Typography variant="h4" fontWeight={800} sx={{ color: color }}>
                    {value}
                </Typography>
                {subtitle && (
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </CardContent>
        </Card>
    </motion.div>
);

const MemberHome = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getHomeStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load home stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <LinearProgress />;

    if (!stats) return <Typography>Failed to load dashboard.</Typography>;

    const calorieProgress = Math.min((stats.caloriesConsumed / stats.caloriesTarget) * 100, 100);

    return (
        <Grid container spacing={3}>
             {/* Quote of the day (Full Width) */}
            <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'primary.main', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <FormatQuote sx={{ fontSize: 100, position: 'absolute', right: 20, top: 0, opacity: 0.2 }} />
                    <Typography variant="h6" fontWeight={700} sx={{ fontStyle: 'italic', zIndex: 1, position: 'relative' }}>
                        "{stats.quote}"
                    </Typography>
                </Paper>
            </Grid>

            <Grid item xs={6} md={3}>
                <StatCard 
                    icon={<Whatshot />} 
                    title="Streak" 
                    value={`${stats.streak} Days`} 
                    color="#f59e0b"
                    delay={1}
                />
            </Grid>
            <Grid item xs={6} md={3}>
                <StatCard 
                    icon={<MonitorWeight />} 
                    title="Weight" 
                    value={`${stats.weight} kg`} 
                    color="#10b981"
                    delay={2}
                />
            </Grid>
             <Grid item xs={12} md={6}>
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                 >
                    <Card sx={{ height: '100%', borderRadius: 4 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6" fontWeight={700}>Calories</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {stats.caloriesConsumed} / {stats.caloriesTarget} kcal
                                </Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={calorieProgress} sx={{ height: 10, borderRadius: 5, mb: 2 }} />
                             <Box sx={{ display: 'flex', gap: 2 }}>
                                  <Box sx={{ p: 1, bgcolor: '#ecfdf5', borderRadius: 2, flex: 1 }}>
                                      <Typography variant="caption" color="success.main" fontWeight={700}>Protein</Typography>
                                      <Typography variant="body2" fontWeight={700}>-- g</Typography> 
                                  </Box>
                                   <Box sx={{ p: 1, bgcolor: '#eff6ff', borderRadius: 2, flex: 1 }}>
                                      <Typography variant="caption" color="primary.main" fontWeight={700}>Carbs</Typography>
                                      <Typography variant="body2" fontWeight={700}>-- g</Typography> 
                                  </Box>
                             </Box>
                        </CardContent>
                    </Card>
                 </motion.div>
            </Grid>

            {/* Next Workout */}
            <Grid item xs={12}>
                 <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4 }}
                 >
                    <Paper sx={{ p: 3, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 3, color: 'primary.main' }}>
                                <FitnessCenter />
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Next Workout</Typography>
                                <Typography variant="h6" fontWeight={700}>{stats.nextWorkoutName || "Rest Day"}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                             {stats.workoutCompleted ? (
                                 <Typography color="success.main" fontWeight={700}>Completed</Typography>
                             ) : (
                                  <Typography color="text.secondary">Upcoming</Typography>
                             )}
                        </Box>
                    </Paper>
                 </motion.div>
            </Grid>
        </Grid>
    );
};

export default MemberHome;
