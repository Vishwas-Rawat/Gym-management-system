import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Grid,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
  Stack,
  Divider,
  Alert
} from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const EXERCISE_ENUMS = [
  "BARBELL_BENCH_PRESS",
  "INCLINE_BENCH_PRESS",
  "DUMBBELL_PRESS",
  "PUSH_UPS",
  "PULL_UPS",
  "LAT_PULLDOWN",
  "BARBELL_ROW",
  "DEADLIFT",
  "BACK_SQUAT",
  "FRONT_SQUAT",
  "LEG_PRESS",
  "LUNGES",
  "LEG_EXTENSIONS",
  "LEG_CURLS",
  "SHOULDER_PRESS",
  "LATERAL_RAISES",
  "BICEP_CURLS",
  "TRICEP_EXTENSIONS",
  "PLANK",
  "CRUNCHES",
  "RUSSIAN_TWIST",
  "CARDIO_TREADMILL",
  "CARDIO_CYCLE"
];

const DAYS_OF_WEEK = [
  "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"
];

const AssignWorkoutForm = ({ memberId, onSuccess, onCancel }) => {
  const [planName, setPlanName] = useState('');
  const [exercises, setExercises] = useState([
    {
      exerciseName: '',
      sets: 3,
      reps: 10,
      restSeconds: 60,
      notes: '',
      days: []
    }
  ]);
  const [error, setError] = useState('');

  const handleExerciseChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        exerciseName: '',
        sets: 3,
        reps: 10,
        restSeconds: 60,
        notes: '',
        days: []
      }
    ]);
  };

  const removeExercise = (index) => {
    const updated = exercises.filter((_, i) => i !== index);
    setExercises(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!planName.trim()) {
      setError('Plan name is required');
      return;
    }
    if (exercises.length === 0) {
      setError('At least one exercise is required');
      return;
    }
    for (const ex of exercises) {
      if (!ex.exerciseName) {
        setError('All exercises must have a name selected');
        return;
      }
      if (ex.days.length === 0) {
        setError(`Please select at least one day for ${ex.exerciseName}`);
        return;
      }
    }

    const payload = {
      memberId,
      planName,
      exercises
    };
    onSuccess(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        fullWidth
        label="Workout Plan Name"
        value={planName}
        onChange={(e) => setPlanName(e.target.value)}
        placeholder="e.g. Push Pull Legs - Beginner"
        required
        sx={{ mb: 4 }}
      />

      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
        Exercises
      </Typography>

      <Stack spacing={3}>
        <AnimatePresence>
          {exercises.map((exercise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, position: 'relative', borderColor: 'divider' }}>
                <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
                  <IconButton onClick={() => removeExercise(index)} color="error" size="small">
                    <Delete />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Exercise</InputLabel>
                      <Select
                        value={exercise.exerciseName}
                        label="Exercise"
                        onChange={(e) => handleExerciseChange(index, 'exerciseName', e.target.value)}
                      >
                        {EXERCISE_ENUMS.map((name) => (
                          <MenuItem key={name} value={name}>
                            {name.replace(/_/g, ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Days</InputLabel>
                      <Select
                        multiple
                        value={exercise.days}
                        onChange={(e) => handleExerciseChange(index, 'days', e.target.value)}
                        input={<OutlinedInput label="Days" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                              <Chip key={value} label={value.substring(0, 3)} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {DAYS_OF_WEEK.map((day) => (
                          <MenuItem key={day} value={day}>
                            {day}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4} md={2}>
                    <TextField
                      fullWidth
                      label="Sets"
                      type="number"
                      size="small"
                      value={exercise.sets}
                      onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || 0)}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      fullWidth
                      label="Reps"
                      type="number"
                      size="small"
                      value={exercise.reps}
                      onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value) || 0)}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      fullWidth
                      label="Rest (s)"
                      type="number"
                      size="small"
                      value={exercise.restSeconds}
                      onChange={(e) => handleExerciseChange(index, 'restSeconds', parseInt(e.target.value) || 0)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      size="small"
                      value={exercise.notes}
                      onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                      placeholder="e.g. Drop set on last set"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </Stack>

      <Button
        startIcon={<Add />}
        onClick={addExercise}
        variant="outlined"
        fullWidth
        sx={{ mt: 2, mb: 4, borderStyle: 'dashed', borderWidth: 2 }}
      >
        Add Exercise
      </Button>

      <Divider sx={{ mb: 3 }} />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<Save />}
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Save Workout Plan
        </Button>
      </Stack>
    </Box>
  );
};

export default AssignWorkoutForm;
