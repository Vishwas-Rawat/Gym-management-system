import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  IconButton,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useGym } from '../context/GymContext';

const GymRegistrationPage = () => {
  const navigate = useNavigate();
  const { createGyms, loading } = useGym();
  const [gyms, setGyms] = useState([{ gymName: '', address: '', city: '', state: '', contactNumber: '', email: '', openingHours: '' }]);
  const [activeGymIndex, setActiveGymIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrors, setShowErrors] = useState(false);

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
    typography: {
      fontFamily: "'Inter', sans-serif",
      h5: { fontWeight: 700, letterSpacing: '0.3px' },
      body2: { fontSize: '0.875rem' },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              transition: 'all 0.3s ease',
              '&:hover fieldset': { borderColor: '#342bddff' },
              '&.Mui-focused fieldset': { borderColor: '#342bddff' },
            },
            '& .MuiInputLabel-root': {
              color: '#4B5563',
              '&.Mui-focused': { color: '#342bddff' },
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
            '&:disabled': { background: 'grey', color: '#FFFFFF', opacity: 0.6 },
          },
        },
      },
    },
  });

  const validateForm = (gym) => {
    const newErrors = {};
    if (!gym.gymName || gym.gymName.trim() === '') newErrors.gymName = 'Gym name is required';
    if (!gym.address || gym.address.trim() === '') newErrors.address = 'Address is required';
    if (!gym.city || gym.city.trim() === '') newErrors.city = 'City is required';
    if (!gym.state || gym.state.trim() === '') newErrors.state = 'State is required';
    if (!gym.contactNumber || !/^\d{10}$/.test(gym.contactNumber)) newErrors.contactNumber = 'Valid 10-digit contact number is required';
    if (!gym.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gym.email)) newErrors.email = 'Valid email is required';
    if (!gym.openingHours || gym.openingHours.trim() === '') newErrors.openingHours = 'Opening hours are required';
    return newErrors;
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGyms = [...gyms];
    updatedGyms[index][name] = value;
    setGyms(updatedGyms);
    setErrors((prev) => ({ ...prev, [index]: {} }));
  };

  const addGym = () => {
    const newGyms = [...gyms, { gymName: '', address: '', city: '', state: '', contactNumber: '', email: '', openingHours: '' }];
    setGyms(newGyms);
    setErrors((prev) => ({ ...prev, [newGyms.length - 1]: {} }));
    setActiveGymIndex(newGyms.length - 1);
  };

  const removeGym = (index) => {
    if (gyms.length <= 1) return;
    const updatedGyms = gyms.filter((_, i) => i !== index);
    setGyms(updatedGyms);
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
    setActiveGymIndex(Math.max(0, index - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    const allErrors = {};
    gyms.forEach((gym, index) => {
      const errorsForGym = validateForm(gym);
      if (Object.keys(errorsForGym).length > 0) allErrors[index] = errorsForGym;
    });

    setErrors(allErrors);
    setShowErrors(true);

    if (Object.keys(allErrors).length > 0) return;

    const result = await createGyms(gyms);

    if (result.success) {
      setSuccessMessage('Gyms registered successfully! Redirecting...');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } else {
      setApiError(result.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          background: theme.palette.background.default,
        }}
      >
        {/* Left Image Area */}
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
              inset: 0,
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
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Register Your Gym
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: '80%' }}>
              Add your fitness centers to manage them efficiently
            </Typography>
          </Box>
        </Box>

        {/* Right Form Area */}
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
                Gym Registration
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              {gyms.map((gym, index) => (
                <Button
                  key={index}
                  variant={activeGymIndex === index ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setActiveGymIndex(index)}
                  sx={{ mr: 1, mb: 1 }}
                >
                  {gym.gymName.length > 8 ? `${gym.gymName.slice(0, 8)}...` : gym.gymName || `Gym ${index + 1}`}
                  {gyms.length > 1 && activeGymIndex === index && (
                    <IconButton
                      color="error"
                      onClick={(e) => { e.stopPropagation(); removeGym(index); }}
                      sx={{ ml: 1 }}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Button>
              ))}
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={addGym}
                sx={{ mb: 1 }}
              >
                Add Gym
              </Button>
            </Box>

            <AnimatePresence mode="wait">
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <motion.div
                  key={activeGymIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {gyms[activeGymIndex].gymName.trim() || `Gym ${activeGymIndex + 1}`} Details
                  </Typography>
                  <TextField
                    fullWidth
                    label="Gym Name"
                    name="gymName"
                    value={gyms[activeGymIndex].gymName}
                    onChange={(e) => handleChange(activeGymIndex, e)}
                    error={showErrors && !!errors[activeGymIndex]?.gymName}
                    helperText={showErrors && errors[activeGymIndex]?.gymName}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={gyms[activeGymIndex].address}
                    onChange={(e) => handleChange(activeGymIndex, e)}
                    error={showErrors && !!errors[activeGymIndex]?.address}
                    helperText={showErrors && errors[activeGymIndex]?.address}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={gyms[activeGymIndex].city}
                    onChange={(e) => handleChange(activeGymIndex, e)}
                    error={showErrors && !!errors[activeGymIndex]?.city}
                    helperText={showErrors && errors[activeGymIndex]?.city}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={gyms[activeGymIndex].state}
                    onChange={(e) => handleChange(activeGymIndex, e)}
                    error={showErrors && !!errors[activeGymIndex]?.state}
                    helperText={showErrors && errors[activeGymIndex]?.state}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Contact Number"
                    name="contactNumber"
                    value={gyms[activeGymIndex].contactNumber}
                    onChange={(e) => handleChange(activeGymIndex, e)}
                    error={showErrors && !!errors[activeGymIndex]?.contactNumber}
                    helperText={showErrors && errors[activeGymIndex]?.contactNumber}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={gyms[activeGymIndex].email}
                    onChange={(e) => handleChange(activeGymIndex, e)}
                    error={showErrors && !!errors[activeGymIndex]?.email}
                    helperText={showErrors && errors[activeGymIndex]?.email}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Opening Hours"
                    name="openingHours"
                    value={gyms[activeGymIndex].openingHours}
                    onChange={(e) => handleChange(activeGymIndex, e)}
                    error={showErrors && !!errors[activeGymIndex]?.openingHours}
                    helperText={showErrors && errors[activeGymIndex]?.openingHours}
                    required
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </motion.div>

                {(apiError || successMessage) && (
                  <Typography
                    color={successMessage ? 'success.main' : 'error.main'}
                    align="center"
                    variant="body2"
                    sx={{ my: 1, fontWeight: 500 }}
                  >
                    {successMessage || apiError}
                    {successMessage && (
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
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  fullWidth
                >
                  Register Gyms
                </Button>
              </Box>
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default GymRegistrationPage;
