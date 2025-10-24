import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, CssBaseline, Typography, TextField, Button, CircularProgress, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import lightTheme from '../themes/lightTheme';

const LoginPage = () => {
  const navigate = useNavigate();
  const { formData, errors, apiError, successMessage, isLoading, handleChange, validateForm, handleSubmit } = useAuth();

  useEffect(() => {
    if (successMessage && successMessage.includes('Redirecting')) {
      const timer = setTimeout(() => navigate('/dashboard'), 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit('/user/login', (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        return { redirect: '/dashboard' };
      }
      return null;
    });
  };

  const togglePasswordVisibility = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <AuthLayout
        title="Welcome Back"
        navText="Log in to manage your gym with powerful admin tools"
        navAction="Don't have an account?"
        navLink="/register"
      >
        <AnimatePresence mode="wait">
          <Box
            component="form"
            onSubmit={handleFormSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={formData.showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {(apiError || successMessage) && (
                <Typography
                  component="div"
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
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                fullWidth
              >
                Login
              </Button>
            </motion.div>
          </Box>
        </AnimatePresence>
      </AuthLayout>
    </ThemeProvider>
  );
};

export default LoginPage;