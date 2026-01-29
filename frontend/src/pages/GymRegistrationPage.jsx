import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
import AuthLayout from '../components/AuthLayout';

const GymRegistrationPage = () => {
  const navigate = useNavigate();
  // ... existing code ...
  // Skipping down to JSX replacement for background
  
  // NOTE: replace_file_content cannot handle non-contiguous blocks elegantly if I want to update import AND usage.
  // I will update the IMPORT first, and then usage in a second step or if the tool allows splitting.
  // The tool instructions say: "Do NOT use this tool if you are only editing a single contiguous block of lines." (Use replace for single). "Use multi_replace... for multiple non-contiguous".
  
  // I will use multi_replace interaction.
  const { createGyms, loading } = useGym();
  const [gyms, setGyms] = useState([{ gymName: '', address: '', city: '', state: '', contactNumber: '', email: '', openingHours: '' }]);
  const [activeGymIndex, setActiveGymIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrors, setShowErrors] = useState(false);

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

  // ... form states ...

  return (
    <>
      <CssBaseline />
      <AuthLayout
        title="Gym Registration"
        subHeadline="MANAGE YOUR FITNESS EMPIRE"
        headline="SCALE YOUR <span style='color: #f97316'>GYM</span>, STREAMLINE <br /> OPERATIONS!"
        navText="Add your fitness centers to manage them efficiently and track performance."
        navAction="Already have gyms?"
        navLink="/admin/gyms"
        navButtonText="View Gyms"
      >
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Gym Tabs (Horizontal Scrollable for card width) */}
          <Box 
             sx={{ 
               mb: 3, 
               display: 'flex', 
               alignItems: 'center', 
               overflowX: 'auto', 
               pb: 1, 
               ml: -1,
               '&::-webkit-scrollbar': { height: '4px' },
               '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px' } 
             }}
          >
            {gyms.map((gym, index) => (
              <Button
                key={index}
                variant={activeGymIndex === index ? 'contained' : 'outlined'}
                onClick={() => setActiveGymIndex(index)}
                size="small"
                sx={{ 
                  ml: 1, 
                  minWidth: 'auto',
                  whiteSpace: 'nowrap',
                  borderRadius: '8px',
                  textTransform: 'none',
                  borderColor: activeGymIndex === index ? 'primary.main' : 'rgba(0,0,0,0.12)',
                  color: activeGymIndex === index ? 'white' : 'text.secondary'
                }}
              >
                {gym.gymName ? (gym.gymName.length > 8 ? `${gym.gymName.slice(0, 8)}...` : gym.gymName) : `Gym ${index + 1}`}
                {gyms.length > 1 && activeGymIndex === index && (
                  <IconButton
                    size="small"
                    component="span"
                    onClick={(e) => { e.stopPropagation(); removeGym(index); }}
                    sx={{ ml: 0.5, p: 0.5, color: 'inherit' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                )}
              </Button>
            ))}
            <IconButton 
              color="primary" 
              onClick={addGym} 
              sx={{ ml: 1, border: '1px dashed', borderColor: 'primary.main' }}
              title="Add another gym"
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>

          <AnimatePresence mode="wait">
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2.5,
                '& .MuiInputLabel-root': { fontSize: '0.95rem' },
                '& .MuiOutlinedInput-root': { borderRadius: '12px' }
              }}
            >
              <motion.div
                key={activeGymIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 700, color: 'text.primary' }}>
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
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
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
                    />
                </Box>

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

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
                  />
                </Box>
              </motion.div>

              {(apiError || successMessage) && (
                <Typography
                  color={successMessage ? 'success.main' : 'error.main'}
                  align="center"
                  variant="body2"
                  sx={{ my: 1, fontWeight: 600 }}
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
                sx={{ 
                    mt: 2, 
                    py: 1.5, 
                    fontSize: '1rem', 
                    fontWeight: 700, 
                    borderRadius: '12px',
                    textTransform: 'none'
                }}
              >
                Register Gyms
              </Button>
            </Box>
          </AnimatePresence>
        </Box>
      </AuthLayout>
    </>
  );
};

export default GymRegistrationPage;
