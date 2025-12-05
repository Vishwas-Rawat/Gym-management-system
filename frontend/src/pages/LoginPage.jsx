import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Typography, TextField, Button, CircularProgress, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import lightTheme from '../themes/lightTheme';
import { motion } from 'framer-motion';
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const navigate = useNavigate();
  const { formData, errors, apiError, successMessage, isLoading, handleChange, handleSubmit } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (successMessage && successMessage.includes('Redirecting')) {
      // The redirection is now handled in the handleSubmit callback, but we keep this as a fallback or for other messages
    }
  }, [successMessage, navigate]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username);
    const payload = {
      password: formData.password,
      [isEmail ? 'email' : 'username']: formData.username
    };

    handleSubmit('/user/login', (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        
        let role = data.role;
        
        // If role is not in the response, try to decode it from the token
        if (!role && data.token) {
            try {
                const decoded = jwtDecode(data.token);
                role = decoded.role || decoded.sub?.role || decoded.authorities?.[0]?.authority;
            } catch (err) {
                console.error("Failed to decode token", err);
            }
        }

        role = role?.toUpperCase();
        
        if (role === 'ADMIN') {
            return { redirect: '/admin/dashboard' };
        }
        if (role === 'TRAINER') {
            return { redirect: '/trainer/dashboard' };
        }
        
        // Default fallback (e.g. for members or unknown roles)
        return { redirect: '/' };
      }
      return null;
    }, { username: true, password: true }, payload);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        <Box 
            component={motion.form}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleFormSubmit} 
            noValidate 
            sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Email Address or Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formData.username || ''}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={formData.password || ''}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem', fontWeight: 600, borderRadius: '8px' }}
          >
            Login
          </Button>
        </Box>
      </AuthLayout>
    </ThemeProvider>
  );
};

export default LoginPage;