import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  Avatar,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { CalendarMonth, FitnessCenter, Group, Person } from '@mui/icons-material';
import { useGym } from '../context/GymContext';
import { useAttendance } from '../context/AttendanceContext';

const AdminAttendancePage = () => {
  const { gyms, getMyGyms, loading: gymLoading } = useGym();
  const { getGymAttendanceStats, loading: attendanceLoading } = useAttendance();

  const [selectedGymId, setSelectedGymId] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // Fetch gyms on mount
  useEffect(() => {
    getMyGyms();
  }, []);

  // Set default gym
  useEffect(() => {
    if (gyms.length > 0 && !selectedGymId) {
      setSelectedGymId(gyms[0].gymId);
    }
  }, [gyms, selectedGymId]);

  // Fetch attendance when gym changes
  useEffect(() => {
    if (selectedGymId) {
      loadAttendance(selectedGymId);
    }
  }, [selectedGymId]);

  const loadAttendance = async (gymId) => {
    setFetchError(null);
    try {
      const data = await getGymAttendanceStats(gymId);
      // Data format: { gymId: 25, records: [ ... ] }
      setAttendanceRecords(data.records || []);
    } catch (err) {
      console.error("Failed to load attendance", err);
      setFetchError("Failed to load attendance records.");
      setAttendanceRecords([]);
    }
  };

  const handleGymChange = (e) => {
    setSelectedGymId(e.target.value);
  };

  // Stats calculation
  const totalPresent = attendanceRecords.filter(r => r.status === 'PRESENT').length;
  const trainersPresent = attendanceRecords.filter(r => r.role === 'TRAINER' && r.status === 'PRESENT').length;
  const membersPresent = attendanceRecords.filter(r => r.role === 'MEMBER' && r.status === 'PRESENT').length;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* HEADER */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
            Attendance Logs
            </Typography>
            <Typography variant="body1" color="text.secondary">
            View daily attendance for all members and trainers.
            </Typography>
        </Box>

        {/* GYM SELECTOR */}
        <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 2 }}>
            <InputLabel>Select Gym</InputLabel>
            <Select
            value={selectedGymId}
            label="Select Gym"
            onChange={handleGymChange}
            disabled={gymLoading}
            >
            {gyms.map((gym) => (
                <MenuItem key={gym.gymId} value={gym.gymId}>
                {gym.gymName}
                </MenuItem>
            ))}
            </Select>
        </FormControl>
      </Box>

      {/* STATS CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", bgcolor: 'primary.main', color: 'white' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3 }}>
                        <FitnessCenter />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>{totalPresent}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Present</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
             <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: 'secondary.light', borderRadius: 3, color: 'secondary.main' }}>
                        <Person />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="text.primary">{trainersPresent}</Typography>
                        <Typography variant="body2" color="text.secondary">Trainers Present</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
             <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: 'info.light', borderRadius: 3, color: 'info.main' }}>
                        <Group />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="text.primary">{membersPresent}</Typography>
                        <Typography variant="body2" color="text.secondary">Members Present</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
      </Grid>

      {/* ATTENDANCE TABLE */}
      <Paper sx={{ borderRadius: 4, boxShadow: "0 4px 24px rgba(0,0,0,0.05)", overflow: 'hidden' }}>
        {attendanceLoading ? (
             <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                <CircularProgress />
             </Box>
        ) : attendanceRecords.length === 0 ? (
             <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No attendance records found for this gym.</Typography>
             </Box>
        ) : (
            <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
                <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {attendanceRecords.map((record) => (
                    <TableRow key={record.id} hover>
                    <TableCell sx={{ color: 'text.secondary' }}>
                        {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: record.role === 'TRAINER' ? 'secondary.main' : 'primary.main' }}>
                                {record.fullName ? record.fullName[0] : (record.role === 'TRAINER' ? 'T' : 'M')}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>
                                {record.fullName || `User #${record.userId}`}
                            </Typography>
                        </Box>
                    </TableCell>
                    <TableCell>
                        <Chip 
                            label={record.role} 
                            size="small" 
                            color={record.role === 'TRAINER' ? 'secondary' : 'primary'}
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                        />
                    </TableCell>
                    <TableCell>
                        <Chip 
                            label={record.status} 
                            size="small" 
                            color={record.status === 'PRESENT' ? 'success' : 'error'}
                            sx={{ fontWeight: 700, borderRadius: 1 }}
                        />
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default AdminAttendancePage;
