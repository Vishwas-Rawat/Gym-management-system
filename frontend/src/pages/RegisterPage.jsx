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
  const [stepErrors, setStepErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [userId, setUserId] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  // Theme configuration
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#342bddff' },
      secondary: { main: '#4F46E5' },
      background: { default: 'linear-gradient(135deg, #E5E7EB 0%, #F3F4F6 100%)' },
      text: { primary: '#111827', secondary: '#4B5563' },
      success: { main: '#46e546ff' },
      error: { main: '#EF4444' },
    },
    typography: { fontFamily: "'Inter', sans-serif" },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover fieldset': { borderColor: '#342bddff' },
              '&.Mui-focused fieldset': { borderColor: '#342bddff' },
            },
            '& .MuiInputLabel-root.Mui-focused': { color: '#342bddff' },
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
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
              background: 'linear-gradient(90deg, #342bddff, #342bddff)',
            },
            '&:disabled': { background: 'grey', opacity: 0.6 },
          },
        },
      },
    },
  });

  // Resend OTP timer
  useEffect(() => {
    let countdown;
    if (resendTimer > 0) {
      countdown = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(countdown);
  }, [resendTimer]);

  // Clear errors when entering a new step
  useEffect(() => {
    const clearStepErrors = () => {
      if (step === 0) {
        setErrors(prev => ({ ...prev, username: '', email: '', password: '', confirmPassword: '' }));
      } else if (step === 1) {
        setErrors(prev => ({ ...prev, firstName: '', lastName: '', dateOfBirth: '', gender: '' }));
      } else if (step === 2) {
        setErrors(prev => ({ ...prev, phoneNumber: '', address: '' })); // This fixes the bug!
      }
    };
    clearStepErrors();
  }, [step]);

  // Form validation per step
  const validateStep = (stepIndex) => {
    const newErrors = {};
    let isValid = true;

    if (stepIndex === 0) {
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = 'Valid email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match';
    } else if (stepIndex === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    } else if (stepIndex === 2) {
      if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber))
        newErrors.phoneNumber = '10-digit phone number is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      setStepErrors(prev => ({ ...prev, [stepIndex]: true }));
      isValid = false;
    } else {
      setStepErrors(prev => ({ ...prev, [stepIndex]: false }));
    }

    return isValid;
  };

  // Fixed: Validate current step before going next
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const response = await api.post('/user/register', formData);
      const data = response.data;

      if (data?.status === 'success' && data.userId) {
        setUserId(data.userId.toString());
        setIsRegistered(true);
        setSuccessMessage('Registration successful! Please verify your email with the OTP sent.');
        setResendTimer(60);
        if (data.message.toLowerCase().includes('already started registration')) {
          setSuccessMessage('You already started registration. A new OTP has been sent.');
        }
        setShowOtpField(true);
      } else {
        setApiError(data?.message || 'Registration failed.');
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otpCode)) {
      setApiError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(`/user/verify-otp?userId=${userId}&otpCode=${otpCode}`);
      if (response.data?.status === 'success') {
        setSuccessMessage('Email verified! Redirecting...');
        setIsRedirecting(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setApiError(response.data?.message || 'Invalid OTP');
      }
    } catch (err) {
      setApiError('OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await api.post(`/user/resend-otp?userId=${userId}`);
      setSuccessMessage('OTP resent successfully!');
      setResendTimer(60);
    } catch (err) {
      setApiError('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitized = name === 'phoneNumber' ? value.replace(/\D/g, '') : value;
    setFormData(prev => ({ ...prev, [name]: sanitized }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on typing
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const steps = ['Account Details', 'Personal Info', 'Contact Info'];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #E5E7EB 0%, #F3F4F6 100%)' }}>
        {/* Left Side - Image */}
        <Box sx={{ flex: 1, position: 'relative', display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ height: '100%', backgroundImage: `url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', px: 4 }}>
            <Typography variant="h3" fontWeight={700}>Transform Your Gym</Typography>
            <Typography variant="h6" sx={{ mt: 2, maxWidth: '80%' }}>Unlock powerful admin tools to elevate your fitness business in 2025</Typography>
          </Box>
        </Box>

        {/* Right Side - Form */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 4, md: 6 } }}>
          <Box sx={{ maxWidth: 500, m: 'auto', width: '100%' }}>
            <Typography variant="h5" fontWeight={700} mb={4}>Admin Sign-Up</Typography>

            {!isRegistered && !showOtpField ? (
              <>
                {/* Step Indicators */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                  {steps.map((label, i) => (
                    <Box key={i} sx={{ textAlign: 'center', flex: 1 }}>
                      <Box
                        sx={{
                          width: 36, height: 36, borderRadius: '50%', mx: 'auto', mb: 1,
                          bgcolor: stepErrors[i] ? 'error.main' : (step >= i ? 'primary.main' : 'text.secondary'),
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 600,
                        }}
                        component={motion.div}
                        animate={{ scale: step === i ? 1.2 : 1 }}
                      >
                        {i + 1}
                      </Box>
                      <Typography variant="caption" color={stepErrors[i] ? 'error' : (step >= i ? 'primary' : 'text.secondary')}>
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <AnimatePresence mode="wait">
                  <Box component="form" onSubmit={step === 2 ? handleSubmit : e => e.preventDefault()} sx={{ mt: 2 }}>

                    {/* Step 0: Account Details */}
                    {step === 0 && (
                      <motion.div key="step0" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                        <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} error={!!errors.username} helperText={errors.username} required sx={{ mb: 3 }} />
                        <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} required sx={{ mb: 3 }} />
                        <TextField fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} required
                          InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={togglePasswordVisibility}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }}
                          sx={{ mb: 3 }}
                        />
                        <TextField fullWidth label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} required
                          InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={toggleConfirmPasswordVisibility}>{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }}
                          sx={{ mb: 3 }}
                        />
                      </motion.div>
                    )}

                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                        <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={!!errors.firstName} helperText={errors.firstName} required sx={{ mb: 3 }} />
                        <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={!!errors.lastName} helperText={errors.lastName} required sx={{ mb: 3 }} />
                        <TextField fullWidth label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth} required InputLabelProps={{ shrink: true }} sx={{ mb: 3 }} />
                        <FormControl fullWidth error={!!errors.gender} sx={{ mb: 3 }}>
                          <InputLabel>Gender</InputLabel>
                          <Select name="gender" value={formData.gender} onChange={handleChange} label="Gender">
                            <MenuItem value=""><em>Select</em></MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                          {errors.gender && <Typography color="error" variant="caption" sx={{ ml: 2, mt: 0.5 }}>{errors.gender}</Typography>}
                        </FormControl>
                      </motion.div>
                    )}

                    {/* Step 2: Contact Info */}
                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                        <TextField
                          fullWidth
                          label="Phone Number *"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          error={!!errors.phoneNumber}
                          helperText={errors.phoneNumber || '10-digit phone number is required'}
                          required
                          inputProps={{ maxLength: 10 }}
                          sx={{ mb: 3 }}
                        />
                        <TextField
                          fullWidth
                          label="Address *"
                          name="address"
                          multiline
                          rows={4}
                          value={formData.address}
                          onChange={handleChange}
                          error={!!errors.address}
                          helperText={errors.address || 'Address is required'}
                          required
                          sx={{ mb: 3 }}
                        />
                      </motion.div>
                    )}

                    {/* API Messages */}
                    {apiError && <Typography color="error" textAlign="center" sx={{ my: 2 }}>{apiError}</Typography>}
                    {successMessage && <Typography color="success.main" textAlign="center" sx={{ my: 2 }}>{successMessage}</Typography>}

                    {/* Navigation Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                      {step > 0 && (
                        <Button variant="outlined" onClick={handleBack} disabled={isLoading} sx={{ flex: 1 }}>
                          Back
                        </Button>
                      )}
                      {step < 2 ? (
                        <Button variant="contained" onClick={handleNext} disabled={isLoading} sx={{ flex: 1 }}>
                          Next
                        </Button>
                      ) : (
                        <Button type="submit" variant="contained" disabled={isLoading} startIcon={isLoading && <CircularProgress size={20} />} sx={{ flex: 1 }}>
                          Register
                        </Button>
                      )}
                    </Box>

                    {/* Login Link */}
                    <Box textAlign="center" mt={4}>
                      <Typography variant="body2" color="text.secondary">
                        Already have an account?{' '}
                        <Button onClick={() => navigate('/login')} color="primary" sx={{ textTransform: 'none', fontWeight: 600 }}>
                          Log In
                        </Button>
                      </Typography>
                    </Box>
                  </Box>
                </AnimatePresence>
              </>
            ) : (
              /* OTP Verification Screen */
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Typography variant="h6" textAlign="center" mb={4}>
                  Verify Your Email
                </Typography>
                <Box component="form" onSubmit={handleVerifyOtp} sx={{ maxWidth: 400, mx: 'auto' }}>
                  <TextField
                    fullWidth
                    label="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    inputProps={{ maxLength: 6 }}
                    sx={{ mb: 3 }}
                  />
                  {apiError && <Typography color="error" textAlign="center">{apiError}</Typography>}
                  {successMessage && <Typography color="success.main" textAlign="center">{successMessage}</Typography>}
                  <Button type="submit" variant="contained" fullWidth disabled={isLoading || isRedirecting} sx={{ mt: 2 }}>
                    {isLoading ? <CircularProgress size={24} /> : 'Verify OTP'}
                  </Button>
                  <Button onClick={handleResendOtp} disabled={resendTimer > 0 || isLoading} fullWidth variant="text" sx={{ mt: 2 }}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </Button>
                </Box>
              </motion.div>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default RegisterPage;