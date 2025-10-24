import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useMemberRegistration } from '../context/MemberRegistrationContext';

const MemberCompleteRegistrationForm = () => {
  const {
    completeRegForm,
    handleCompleteRegChange,
    handleCompleteRegistration,
    errors,
    isLoading,
    apiError,
    successMessage,
    isRedirecting,
  } = useMemberRegistration();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const fitnessGoals = ['Muscle Gain', 'Weight Loss', 'Strength Training', 'Endurance', 'Flexibility'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  return (
    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleCompleteRegistration(); }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Token Field (Read-only) */}
      <TextField
        fullWidth
        label="Registration Token"
        name="token"
        value={completeRegForm.token}
        InputProps={{ readOnly: true }}
        error={!!errors.token}
        helperText={errors.token}
        variant="outlined"
      />

      {/* Password Fields */}
      <TextField
        fullWidth
        label="New Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={completeRegForm.password}
        onChange={handleCompleteRegChange}
        error={!!errors.password}
        helperText={errors.password}
        required
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        value={completeRegForm.confirmPassword}
        onChange={handleCompleteRegChange}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        required
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Optional Fields */}
      <TextField
        fullWidth
        label="Age (Optional)"
        name="age"
        type="number"
        value={completeRegForm.age}
        onChange={handleCompleteRegChange}
        variant="outlined"
        inputProps={{ min: 16, max: 80 }}
      />

      <TextField
        fullWidth
        label="Date of Birth (Optional)"
        name="dateOfBirth"
        type="date"
        value={completeRegForm.dateOfBirth}
        onChange={handleCompleteRegChange}
        InputLabelProps={{ shrink: true }}
        variant="outlined"
      />

      <FormControl fullWidth variant="outlined">
        <InputLabel>Gender (Optional)</InputLabel>
        <Select
          name="gender"
          value={completeRegForm.gender}
          onChange={handleCompleteRegChange}
          label="Gender (Optional)"
        >
          <MenuItem value="">Select Gender</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel>Fitness Goal (Optional)</InputLabel>
        <Select
          name="fitnessGoal"
          value={completeRegForm.fitnessGoal}
          onChange={handleCompleteRegChange}
          label="Fitness Goal (Optional)"
        >
          <MenuItem value="">Select Goal</MenuItem>
          {fitnessGoals.map((goal) => (
            <MenuItem key={goal} value={goal}>{goal}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth variant="outlined">
        <InputLabel>Preferred Workout Time (Optional)</InputLabel>
        <Select
          name="workoutTimeSlot"
          value={completeRegForm.workoutTimeSlot}
          onChange={handleCompleteRegChange}
          label="Preferred Workout Time (Optional)"
        >
          <MenuItem value="">Select Time Slot</MenuItem>
          {timeSlots.map((slot) => (
            <MenuItem key={slot} value={slot}>{slot}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Error/Success Messages */}
      {apiError && (
        <Typography color="error.main" align="center" variant="body2" sx={{ my: 1 }}>
          {apiError}
        </Typography>
      )}
      {successMessage && (
        <Typography color="success.main" align="center" variant="body2" sx={{ my: 1 }}>
          {successMessage}
          {isRedirecting && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <CircularProgress size={20} color="inherit" />
            </Box>
          )}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading || isRedirecting}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        fullWidth
        sx={{ borderRadius: '10px', fontWeight: 600, py: 1.5 }}
      >
        {isLoading ? 'Completing Registration...' : 'Complete Registration'}
      </Button>
    </Box>
  );
};

export default MemberCompleteRegistrationForm;