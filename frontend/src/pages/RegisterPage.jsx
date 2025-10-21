import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN',
    username: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [userId, setUserId] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  // Theme configuration with vibrant emerald green and indigo
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#342bddff',
      },
      secondary: {
        main: '#4F46E5',
      },
      background: {
        default: 'linear-gradient(135deg, #E5E7EB 0%, #F3F4F6 100%)',
      },
      text: {
        primary: '#111827',
        secondary: '#4B5563',
      },
      success: {
        main: '#46e546ff',
      },
      error: {
        main: '#EF4444',
      },
    },
    typography: {
      fontFamily: "'Inter', sans-serif",
      h5: {
        fontWeight: 700,
        letterSpacing: '0.3px',
      },
      body2: {
        fontSize: '0.875rem',
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover fieldset': {
                borderColor: '#342bddff',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#342bddff',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#4B5563',
              '&.Mui-focused': {
                color: '#342bddff',
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '10px',
            padding: '12px 24px',
            fontWeight: 600,
            background: 'linear-gradient(90deg, #4F46E5, #4F46E5)',
            color: '#FFFFFF',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
              background: 'linear-gradient(90deg, #342bddff, #342bddff)',
            },
            '&:disabled': {
              background: 'grey',
              color: '#FFFFFF',
              opacity: 0.6,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '10px',
          },
        },
      },
    },
  });

  // Countdown timer for resend OTP
  useEffect(() => {
    let countdown;
    if (resendTimer > 0) {
      countdown = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [resendTimer]);

  // Form validation for each step
  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.username) newErrors.username = 'Username is required';
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required';
      if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    } else if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    } else if (step === 2) {
      if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = '10-digit phone number is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    }
    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  // Handle registration submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 2 || !validateStep()) {
      console.log('Submission blocked: step=', step, 'validation failed');
      return;
    }
    setApiError('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      console.log('Sending registration request with data:', formData);
      const response = await api.post('/user/register', formData);
      console.log('Registration response:', response.data);
      const data = response.data;

      if (data && data.status === 'success' && data.userId) {
        setUserId(data.userId.toString());
        if (data.message.includes('successfully')) {
          setIsRegistered(true);
          setSuccessMessage('Registration successful! Please verify your email with the OTP sent.');
          setResendTimer(60);
        } else if (data.message.includes('not verified')) {
          setShowOtpField(true);
          setSuccessMessage('User already registered. An OTP has been resent. Please verify.');
          setResendTimer(60);
        } else {
          setApiError('Registration failed: Unexpected response from server.');
        }
      } else {
        setApiError(data?.message || 'Registration failed: Unexpected response from server.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed due to a network error. Please try again.';
      setApiError(errorMsg);
      console.error('Registration error:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    if (!otpCode || !/^\d{6}$/.test(otpCode)) {
      setApiError('Please enter a valid 6-digit OTP code');
      console.log('OTP validation failed:', otpCode);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Verifying OTP:', { userId, otpCode });
      const response = await api.post(`/user/verify-otp?userId=${userId}&otpCode=${otpCode}`);
      console.log('OTP verification response:', response.data);
      const data = response.data;

      if (data && data.status === 'success' && data.message.includes('successful')) {
        setSuccessMessage('Email verified successfully! Redirecting to login...');
        setIsRedirecting(true);
        setTimeout(() => {
          console.log('Navigating to /login');
          navigate('/login');
        }, 2000);
      } else {
        setApiError(data?.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'OTP verification failed due to a network error.';
      setApiError(errorMsg);
      console.error('OTP verification error:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    if (!userId) {
      setApiError('No user ID available. Please register again.');
      console.log('Resend OTP failed: No userId');
      return;
    }
    setApiError('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      console.log('Resending OTP for userId:', userId);
      const response = await api.post(`/user/resend-otp?userId=${userId}`);
      console.log('Resend OTP response:', response.data);
      const data = response.data;

      if (data && data.status === 'success' && data.message.includes('successfully')) {
        setSuccessMessage('OTP resent successfully! Please check your email.');
        setResendTimer(60);
      } else {
        setApiError(data?.message || 'Failed to resend OTP. Try again.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to resend OTP due to a network error.';
      setApiError(errorMsg);
      console.error('Resend OTP error:', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === 'phoneNumber' ? value.replace(/\D/g, '') : value;
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const steps = ['Account Details', 'Personal Info', 'Contact Info'];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden', background: 'linear-gradient(135deg, #E5E7EB 0%, #F3F4F6 100%)' }}>
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Box
            sx={{
              height: '100%',
              backgroundImage: `url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textAlign: 'center',
              px: 4,
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Transform Your Gym
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: '80%' }}>
              Unlock powerful admin tools to elevate your fitness business in 2025
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, sm: 4, md: 6 },
          }}
          component={motion.div}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ width: '100%', maxWidth: 500 }}>
            <Box display="flex" justifyContent="start" alignItems="center" mb={4}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                Admin Sign-Up
              </Typography>
            </Box>
            {!isRegistered && !showOtpField ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                  {steps.map((label, index) => (
                    <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: step >= index ? theme.palette.primary.main : theme.palette.text.secondary,
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 1,
                          fontWeight: 600,
                        }}
                        component={motion.div}
                        animate={{ scale: step === index ? 1.2 : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="caption" sx={{ color: step >= index ? theme.palette.primary.main : theme.palette.text.secondary }}>
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <AnimatePresence mode="wait">
                  <Box component="form" onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {step === 0 && (
                      <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <TextField
                          fullWidth
                          label="Username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          helperText={formData.username ? '' : 'Username is required'}
                          required
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          helperText={formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Valid email is required' : ''}
                          required
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleChange}
                          helperText={formData.password && formData.password.length < 8 ? 'Password must be at least 8 characters' : ''}
                          required
                          variant="outlined"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Confirm Password"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          helperText={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
                          required
                          variant="outlined"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 2 }}
                        />
                      </motion.div>
                    )}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <TextField
                          fullWidth
                          label="First Name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          helperText={formData.firstName ? '' : 'First name is required'}
                          required
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          helperText={formData.lastName ? '' : 'Last name is required'}
                          required
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          helperText={formData.dateOfBirth ? '' : 'Date of birth is required'}
                          InputLabelProps={{ shrink: true }}
                          required
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            label="Gender"
                            required
                          >
                            <MenuItem value="" disabled>
                              Select gender
                            </MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                          {!formData.gender && <Typography color="text.secondary" variant="caption" sx={{ mt: 0.5 }}>Gender is required</Typography>}
                        </FormControl>
                      </motion.div>
                    )}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          helperText={formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber) ? '10-digit phone number is required' : ''}
                          required
                          variant="outlined"
                          inputProps={{ maxLength: 10 }}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          multiline
                          rows={3}
                          value={formData.address}
                          onChange={handleChange}
                          helperText={formData.address ? '' : 'Address is required'}
                          required
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                        <FormControlLabel
                          control={<Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} color="primary" />}
                          label="I agree to the terms and conditions"
                          sx={{ mb: 2 }}
                        />
                        {!agreeTerms && <Typography color="text.secondary" variant="caption">You must agree to the terms</Typography>}
                      </motion.div>
                    )}
                    {apiError && (
                      <Typography color="error.main" align="center" variant="body2" sx={{ my: 1 }}>
                        {apiError}
                      </Typography>
                    )}
                    {successMessage && (
                      <Typography color="success.main" align="center" variant="body2" sx={{ my: 1 }}>
                        {successMessage}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      {step > 0 && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleBack}
                          disabled={isLoading}
                          sx={{ borderRadius: '10px', fontWeight: 600 }}
                        >
                          Back
                        </Button>
                      )}
                      {step < 2 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                          disabled={isLoading}
                          sx={{ ml: 'auto', borderRadius: '10px', fontWeight: 600 }}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={isLoading}
                          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                          fullWidth
                          sx={{ borderRadius: '10px', fontWeight: 600 }}
                        >
                          Register
                        </Button>
                      )}
                    </Box>
                    <input type="hidden" name="role" value="ADMIN" />
                  </Box>
                </AnimatePresence>
              </>
            ) : showOtpField || isRegistered ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Box component="form" onSubmit={handleVerifyOtp} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      fullWidth
                      label="Enter OTP"
                      name="otpCode"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      inputProps={{ maxLength: 6 }}
                      required
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
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
                      sx={{ mb: 1, borderRadius: '10px', fontWeight: 600 }}
                    >
                      Verify OTP
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      disabled={isLoading || resendTimer > 0 || isRedirecting}
                      onClick={handleResendOtp}
                      fullWidth
                      sx={{ borderRadius: '10px', fontWeight: 600 }}
                    >
                      {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </Button>
                  </Box>
                </motion.div>
              </AnimatePresence>
            ) : null}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default RegisterPage;