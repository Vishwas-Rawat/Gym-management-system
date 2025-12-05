import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Stack,
  Card,
  CardContent
} from '@mui/material';
import {
  FitnessCenter,
  CalendarToday,
  Timer,
  Repeat,
  Notes
} from '@mui/icons-material';

const WorkoutPlanView = ({ plan }) => {
  if (!plan) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <FitnessCenter sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6">No workout plan assigned yet.</Typography>
      </Box>
    );
  }

  // Group exercises by day for easier viewing
  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const exercisesByDay = {};

  daysOfWeek.forEach(day => {
    exercisesByDay[day] = [];
  });

  if (plan.exercises && Array.isArray(plan.exercises)) {
    plan.exercises.forEach(ex => {
      if (ex.days && Array.isArray(ex.days)) {
        ex.days.forEach(day => {
          if (exercisesByDay[day]) {
            exercisesByDay[day].push(ex);
          }
        });
      }
    });
  }

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={800} color="primary.main" gutterBottom>
          {plan.planName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Assigned by {plan.trainerName} on {new Date(plan.createdAt).toLocaleDateString()}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {daysOfWeek.map(day => {
          const dayExercises = exercisesByDay[day];
          if (dayExercises.length === 0) return null;

          return (
            <Grid item xs={12} md={6} lg={4} key={day}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  borderRadius: 4,
                  borderColor: 'divider',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }
                }}
              >
                <Box sx={{ bgcolor: 'primary.main', px: 2, py: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700} color="white">
                    {day}
                  </Typography>
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    {dayExercises.map((ex, idx) => (
                      <Box key={idx} sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                          {ex.displayName || ex.exerciseName.replace(/_/g, ' ')}
                        </Typography>
                        
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                          <Chip 
                            icon={<Repeat sx={{ fontSize: 14 }} />} 
                            label={`${ex.sets} x ${ex.reps}`} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                          <Chip 
                            icon={<Timer sx={{ fontSize: 14 }} />} 
                            label={`${ex.restSeconds}s`} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Stack>

                        {ex.notes && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                            <Notes sx={{ fontSize: 14 }} /> {ex.notes}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default WorkoutPlanView;
