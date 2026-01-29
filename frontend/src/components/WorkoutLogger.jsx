import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControlLabel,
    Checkbox,
    Alert,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { logWorkout, getMuscleGroups, getExercisesByMuscleGroup } from '../services/memberService';

const WorkoutLogger = ({ onLogSuccess }) => {
     const [formData, setFormData] = useState({
        exerciseName: '', // Stores the CODE
        setsCount: '',
        repsCount: '',
        weight: '',
        durationMinutes: '',
        completed: true
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Dropdown Data States
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
    const [loadingExercises, setLoadingExercises] = useState(false);

    useEffect(() => {
        const fetchMuscleGroups = async () => {
            try {
                const groups = await getMuscleGroups();
                setMuscleGroups(groups || []);
            } catch (err) {
                console.error("Failed to load muscle groups", err);
                setMessage({ type: 'error', text: 'Failed to load muscle groups.' });
            }
        };
        fetchMuscleGroups();
    }, []);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleMuscleGroupChange = async (e) => {
        const group = e.target.value;
        setSelectedMuscleGroup(group);
        setFormData({ ...formData, exerciseName: '' }); // Clear exercise
        setExercises([]);

        if (group) {
            setLoadingExercises(true);
            try {
                const exList = await getExercisesByMuscleGroup(group);
                setExercises(exList || []);
            } catch (err) {
                console.error("Failed to load exercises", err);
                setMessage({ type: 'error', text: 'Failed to load exercises for selected group.' });
            } finally {
                setLoadingExercises(false);
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData.exerciseName || !formData.setsCount) {
             setMessage({ type: 'error', text: 'Exercise and Sets are required.' });
             return;
        }

        setLoading(true);
        try {
            await logWorkout({
                ...formData,
                setsCount: parseInt(formData.setsCount),
                repsCount: parseInt(formData.repsCount) || 0,
                weight: parseFloat(formData.weight) || 0,
                durationMinutes: parseFloat(formData.durationMinutes) || 0
            });
            setMessage({ type: 'success', text: 'Workout logged successfully!' });
             setFormData({
                exerciseName: '',
                setsCount: '',
                repsCount: '',
                weight: '',
                durationMinutes: '',
                completed: true
            });
            setSelectedMuscleGroup('');
            setExercises([]);
            if (onLogSuccess) onLogSuccess();
        } catch (error) {
             setMessage({ type: 'error', text: error.toString() });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4 }}>
             <Box sx={{ mb: 3 }}>
                 <Typography variant="h6" fontWeight={800} color="primary.main">Create Own Workout</Typography>
                 <Typography variant="body2" color="text.secondary">Log your daily workout exercises and sets.</Typography>
             </Box>
             <Grid container spacing={2}>
                 {/* Muscle Group Dropdown */}
                 <Grid item xs={12}>
                     <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                         <InputLabel>Muscle Group</InputLabel>
                         <Select
                             value={selectedMuscleGroup}
                             label="Muscle Group"
                             onChange={handleMuscleGroupChange}
                             MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                         >
                             {muscleGroups.map((group) => (
                                 <MenuItem key={group} value={group} sx={{ whiteSpace: 'normal' }}>
                                    {group}
                                 </MenuItem>
                             ))}
                         </Select>
                     </FormControl>
                 </Grid>

                 {/* Exercise Dropdown */}
                 <Grid item xs={12}>
                     <FormControl fullWidth size="small" disabled={!selectedMuscleGroup} sx={{ minWidth: 200 }}>
                         <InputLabel>Exercise</InputLabel>
                         <Select
                             name="exerciseName"
                             value={formData.exerciseName}
                             label="Exercise"
                             onChange={handleChange}
                             renderValue={(selected) => {
                                 const ex = exercises.find(e => e.code === selected);
                                 return ex ? ex.displayName : selected;
                             }}
                             MenuProps={{ PaperProps: { sx: { maxHeight: 300, maxWidth: '95vw' } } }}
                             sx={{ 
                                 '& .MuiSelect-select': { 
                                     whiteSpace: 'normal !important', 
                                     height: 'auto', 
                                     minHeight: '1.4375em' 
                                 } 
                             }}
                         >
                             {loadingExercises ? (
                                 <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                             ) : (
                                 exercises.map((ex) => (
                                     <MenuItem key={ex.code} value={ex.code} sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                         {ex.displayName}
                                     </MenuItem>
                                 ))
                             )}
                         </Select>
                     </FormControl>
                 </Grid>

                 {/* Numeric Inputs - Fully Responsive */}
                 <Grid item xs={12} sm={6} md={3}>
                     <TextField 
                        fullWidth size="small" 
                        label="Sets" 
                        name="setsCount"
                        type="number"
                        value={formData.setsCount}
                        onChange={handleChange}
                    />
                 </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                     <TextField 
                        fullWidth size="small" 
                        label="Reps" 
                        name="repsCount"
                        type="number"
                        value={formData.repsCount}
                        onChange={handleChange}
                    />
                 </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                     <TextField 
                        fullWidth size="small" 
                        label="Weight (kg)" 
                        name="weight"
                        type="number"
                        value={formData.weight}
                        onChange={handleChange}
                    />
                 </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                     <TextField 
                        fullWidth size="small" 
                        label="Duration (min)" 
                        name="durationMinutes"
                        type="number"
                        value={formData.durationMinutes}
                        onChange={handleChange}
                    />
                 </Grid>
                 
                 <Grid item xs={12}>
                     <FormControlLabel 
                        control={<Checkbox checked={formData.completed} onChange={handleChange} name="completed" />}
                        label="Completed"
                     />
                 </Grid>
                 <Grid item xs={12}>
                    <Button 
                        variant="contained" 
                        fullWidth 
                        onClick={handleSubmit}
                        disabled={loading || !formData.exerciseName}
                        startIcon={<Add />}
                    >
                        {loading ? 'Logging...' : 'Log Set'}
                    </Button>
                </Grid>
             </Grid>
              <Snackbar open={!!message.text} autoHideDuration={3000} onClose={() => setMessage({ type: '', text: '' })}>
                <Alert severity={message.type === 'error' ? 'error' : 'success'}>{message.text}</Alert>
            </Snackbar>
        </Paper>
    );
  };
export default WorkoutLogger;
