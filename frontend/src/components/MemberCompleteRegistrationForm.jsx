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

  const fitnessGoals = ['Weight Loss', 'Muscle Gain', 'Strength Training', 'Endurance', 'Flexibility'];
  
  // Custom Styles for Premium Look
  const fieldStyle = {
    mb: 2.5,
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      transition: 'all 0.3s ease',
      '& fieldset': { borderColor: 'var(--border-muted)' },
      '&:hover fieldset': { borderColor: '#f97316' },
      '&.Mui-focused fieldset': { borderColor: '#f97316', borderWidth: '2px' },
    },
    '& .MuiInputLabel-root': { color: '#f97316' }, // Orange by default
    '& .MuiInputLabel-root.Mui-focused': { color: '#f97316' },
    '& .MuiOutlinedInput-input': { color: 'var(--text-primary)' },
  };

  const sectionTitleStyle = {
    color: '#f97316', // Vibrant Orange
    fontWeight: 600,
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    mb: 2,
    mt: 1,
    display: 'flex',
    itemsCenter: 'center',
    gap: 1
  };

  return (
    <Box 
      component="form" 
      onSubmit={(e) => { e.preventDefault(); handleCompleteRegistration(); }} 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1,
        maxHeight: '70vh',
        overflowY: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { background: 'var(--border-muted)', borderRadius: '10px' }
      }}
    >
      <Typography sx={sectionTitleStyle}>Account Security</Typography>
      
      {/* Username Field */}
      <TextField
        fullWidth
        label="Username"
        name="username"
        value={completeRegForm.username}
        onChange={handleCompleteRegChange}
        error={!!errors.username}
        helperText={errors.username}
        required
        variant="outlined"
        sx={fieldStyle}
      />

      {/* Password Fields */}
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
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
          sx={fieldStyle}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'var(--text-secondary)' }}>
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
          sx={fieldStyle}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} sx={{ color: 'var(--text-secondary)' }}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Typography sx={sectionTitleStyle}>Personal Details</Typography>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          fullWidth
          label="Age"
          name="age"
          type="number"
          value={completeRegForm.age}
          onChange={handleCompleteRegChange}
          variant="outlined"
          sx={fieldStyle}
          inputProps={{ min: 16, max: 80 }}
        />

        <TextField
          fullWidth
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={completeRegForm.dateOfBirth}
          onChange={handleCompleteRegChange}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          sx={fieldStyle}
        />
      </Box>

      <FormControl fullWidth variant="outlined" sx={fieldStyle}>
        <InputLabel>Gender</InputLabel>
        <Select
          name="gender"
          value={completeRegForm.gender}
          onChange={handleCompleteRegChange}
          label="Gender"
          sx={{ borderRadius: '12px' }}
        >
          <MenuItem value="">Select Gender</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <Typography sx={sectionTitleStyle}>Fitness Profile</Typography>

      <FormControl fullWidth variant="outlined" sx={fieldStyle}>
        <InputLabel>Fitness Goal</InputLabel>
        <Select
          name="fitnessGoal"
          value={completeRegForm.fitnessGoal}
          onChange={handleCompleteRegChange}
          label="Fitness Goal"
          sx={{ borderRadius: '12px' }}
        >
          <MenuItem value="">Select Goal</MenuItem>
          {fitnessGoals.map((goal) => (
            <MenuItem key={goal} value={goal}>{goal}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Preferred Workout Time"
        name="workoutTimeSlot"
        placeholder="e.g. 06:00 AM to 08:00 AM"
        value={completeRegForm.workoutTimeSlot}
        onChange={handleCompleteRegChange}
        variant="outlined"
        sx={fieldStyle}
        helperText="Specify your preferred daily timing"
      />

      {/* Status Messages */}
      <Box sx={{ minHeight: '24px', mb: 1 }}>
        {apiError && (
          <Typography color="var(--text-danger)" align="center" variant="body2" sx={{ fontWeight: 500 }}>
            {apiError}
          </Typography>
        )}
        {successMessage && (
          <Typography color="var(--text-success)" align="center" variant="body2" sx={{ fontWeight: 500 }}>
            {successMessage}
          </Typography>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        disabled={isLoading || isRedirecting || !completeRegForm.token}
        fullWidth
        sx={{ 
          borderRadius: '12px', 
          fontWeight: 700, 
          py: 1.8,
          fontSize: '1rem',
          backgroundColor: 'var(--primary)',
          '&:hover': { backgroundColor: 'var(--primary-soft)' },
          boxShadow: '0 4px 12px var(--primary-glow)',
          transition: 'all 0.3s ease',
          mt: 1
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} sx={{ color: 'white' }} />
        ) : isRedirecting ? (
          'Redirecting to login...'
        ) : (
          'Complete Registration'
        )}
      </Button>

      {/* Hidden Token for context */}
      <input type="hidden" name="token" value={completeRegForm.token} />
    </Box>
  );
};

export default MemberCompleteRegistrationForm;