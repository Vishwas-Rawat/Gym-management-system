import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Typography, TextField, Button, CircularProgress, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import lightTheme from '../themes/lightTheme';

const LoginPage = () => {
  const navigate = useNavigate();
  const { formData, errors, apiError, successMessage, isLoading, handleChange, handleSubmit } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (successMessage && successMessage.includes('Redirecting')) {
      const timer = setTimeout(() => navigate('/dashboard'), 2000);
      return () => clearTimeout(timer);
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
        return { redirect: '/dashboard' };
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
        <Box component="form" onSubmit={handleFormSubmit} noValidate sx={{ mt: 1 }}>
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
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </AuthLayout>
    </ThemeProvider>
  );
};

export default LoginPage;