// src/components/TrainerCompleteRegistrationForm.jsx
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
import { useTrainerRegistration } from '../context/TrainerRegistrationContext';

const TrainerCompleteRegistrationForm = () => {
  const {
    completeRegForm,
    handleCompleteRegChange,
    handleCompleteRegistration,
    errors,
    isLoading,
    apiError,
    successMessage,
    isRedirecting,
  } = useTrainerRegistration();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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
        helperText={errors.token || "This token is automatically retrieved from your invite link."}
        variant="outlined"
        disabled
        sx={{ bgcolor: 'action.hover' }}
      />

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
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={completeRegForm.dateOfBirth}
        onChange={handleCompleteRegChange}
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        required
      />

      <FormControl fullWidth variant="outlined" required>
        <InputLabel>Gender</InputLabel>
        <Select
          name="gender"
          value={completeRegForm.gender}
          onChange={handleCompleteRegChange}
          label="Gender"
        >
          <MenuItem value="">Select Gender</MenuItem>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
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
        disabled={isLoading || isRedirecting || !completeRegForm.token}
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        fullWidth
        sx={{ borderRadius: '10px', fontWeight: 600, py: 1.5 }}
      >
        {isLoading ? 'Completing Registration...' : 'Complete Registration'}
      </Button>
    </Box>
  );
};

export default TrainerCompleteRegistrationForm;
