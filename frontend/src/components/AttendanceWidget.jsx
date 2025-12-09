import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { CheckCircle, Cancel, AccessTime } from '@mui/icons-material';
import { useAttendance } from '../context/AttendanceContext';
import { motion } from 'framer-motion';

const AttendanceWidget = ({ onAttendanceUpdate }) => {
  const { loading, error, todayStatus, markAttendance, checkTodayAttendance } = useAttendance();

  useEffect(() => {
    checkTodayAttendance();
  }, []);

  const handleMarkAttendance = async (status = 'PRESENT') => {
    await markAttendance(status);
    if (onAttendanceUpdate) onAttendanceUpdate();
  };

  return (
    <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2 }}>
        <Typography variant="h6" fontWeight={600} color="text.secondary">
          Today's Attendance
        </Typography>

        {loading ? (
          <CircularProgress size={40} sx={{ color: "#6366f1" }} />
        ) : (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {todayStatus === 'PRESENT' ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'success.main' }}>
                  <CheckCircle sx={{ fontSize: 60, mb: 1 }} />
                  <Typography variant="h5" fontWeight={700}>
                    Present
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Marked for today
                  </Typography>
                  <Button 
                    size="small" 
                    variant="text" 
                    color="error" 
                    onClick={() => handleMarkAttendance('ABSENT')}
                    sx={{ mt: 1, fontSize: '0.75rem', opacity: 0.7, '&:hover': { opacity: 1, bgcolor: 'error.50' } }}
                  >
                    Mark Absent
                  </Button>
                </Box>
              ) : todayStatus === 'ABSENT' ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'error.main' }}>
                  <Cancel sx={{ fontSize: 60, mb: 1 }} />
                  <Typography variant="h5" fontWeight={700}>
                    Absent
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Marked for today
                  </Typography>
                  <Button 
                    size="small" 
                    variant="text" 
                    color="primary" 
                    onClick={() => handleMarkAttendance('PRESENT')}
                    sx={{ mt: 1, fontSize: '0.75rem' }}
                  >
                    Mark Present
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'text.disabled' }}>
                  <AccessTime sx={{ fontSize: 60, mb: 1 }} />
                  <Typography variant="h5" fontWeight={700} color="text.primary">
                    Not Marked
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please mark your attendance
                  </Typography>
                </Box>
              )}
            </motion.div>

            {todayStatus !== 'PRESENT' && todayStatus !== 'ABSENT' && (
              <Button
                variant="contained"
                size="large"
                onClick={() => handleMarkAttendance('PRESENT')}
                disabled={loading}
                sx={{
                  mt: 2,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  bgcolor: "#6366f1",
                  "&:hover": { bgcolor: "#4f46e5" },
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
                }}
              >
                Mark Attendance
              </Button>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2, width: '100%', borderRadius: '8px' }}>
                {error}
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceWidget;
