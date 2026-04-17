import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { userApi } from '../services/api';
import AuthLayout from '../components/AuthLayout';
import { useTheme } from '../context/ThemeContext';
import {
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
  const { isDarkMode } = useTheme();
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
      const response = await userApi.post('/user/register', formData);
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
      const response = await userApi.post(`/user/verify-otp?userId=${userId}&otpCode=${otpCode}`);
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
      await userApi.post(`/user/resend-otp?userId=${userId}`);
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
    <>
      <CssBaseline />
      <AuthLayout
        title="Admin Sign-Up"
        navText="Unlock powerful admin tools to elevate your fitness business in 2025"
        navAction="Already have an account?"
        navLink="/login"
      >
        {!isRegistered && !showOtpField ? (
          <>
             {/* Step Indicators */}
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                  {steps.map((label, i) => (
                    <Box key={i} sx={{ textAlign: 'center', flex: 1 }}>
                      <Box
                        sx={{
                          width: 36, height: 36, borderRadius: '50%', mx: 'auto', mb: 1,
                          bgcolor: stepErrors[i] ? 'error.main' : (step >= i ? 'primary.main' : (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')),
                          color: step >= i ? 'white' : (isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700,
                          border: step >= i ? 'none' : '1px solid',
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                        }}
                        component={motion.div}
                        animate={{ scale: step === i ? 1.2 : 1 }}
                      >
                        {i + 1}
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          fontWeight: 700,
                          color: stepErrors[i] ? 'error.main' : (step >= i ? 'primary.main' : (isDarkMode ? 'rgba(255,255,255,0.5)' : '#64748b'))
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
            
            <AnimatePresence mode="wait">
                  <Box component="form" onSubmit={step === 2 ? handleSubmit : e => e.preventDefault()} 
                    sx={{ 
                      mt: 2,
                      '& .MuiInputLabel-root': { fontSize: '1.1rem' },
                      '& .MuiOutlinedInput-root': { fontSize: '1.1rem' },
                      '& .MuiMenuItem-root': { fontSize: '1.1rem' }
                    }}
                  >

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
                      <Button 
                        variant="outlined" 
                        onClick={handleBack} 
                        disabled={isLoading || step === 0} 
                        sx={{ 
                          flex: 1, 
                          py: 1.5,
                          fontWeight: 700,
                          borderRadius: '12px',
                          fontSize: '1.1rem',
                          borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)', 
                          color: 'primary.main', 
                          visibility: step === 0 ? 'hidden' : 'visible',
                          '&:hover': { 
                            borderColor: 'primary.main', 
                            background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255, 82, 82, 0.05)' 
                          } 
                        }}
                      >
                        Back
                      </Button>

                       {step < 2 ? (
                        <Button variant="contained" onClick={handleNext} disabled={isLoading} sx={{ flex: 1, py: 1.5, fontWeight: 700, borderRadius: '12px', fontSize: '1.1rem' }}>
                          Next
                        </Button>
                      ) : (
                        <Button type="submit" variant="contained" disabled={isLoading} startIcon={isLoading && <CircularProgress size={20} color="inherit" />} sx={{ flex: 1, py: 1.5, fontWeight: 700, borderRadius: '12px', fontSize: '1.1rem' }}>
                          Register
                        </Button>
                      )}
                    </Box>
                  </Box>
            </AnimatePresence>
          </>
        ) : (
             /* OTP Verification Screen */
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Typography variant="h6" textAlign="center" mb={4} sx={{ fontWeight: 800, color: isDarkMode ? 'white' : '#0f172a' }}>
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
                  {apiError && <Typography color="error" textAlign="center" sx={{ mb: 2, fontWeight: 600 }}>{apiError}</Typography>}
                  {successMessage && <Typography color="success.main" textAlign="center" sx={{ mb: 2, fontWeight: 600 }}>{successMessage}</Typography>}
                  <Button type="submit" variant="contained" fullWidth disabled={isLoading || isRedirecting} sx={{ mt: 2, py: 1.5, fontWeight: 700, borderRadius: '12px' }}>
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
                  </Button>
                  <Button onClick={handleResendOtp} disabled={resendTimer > 0 || isLoading} fullWidth variant="text" sx={{ mt: 2, fontWeight: 600, color: isDarkMode ? 'rgba(255,255,255,0.6)' : '#64748b' }}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </Button>
                </Box>
              </motion.div>
        )}
      </AuthLayout>
    </>
  );
};

export default RegisterPage;