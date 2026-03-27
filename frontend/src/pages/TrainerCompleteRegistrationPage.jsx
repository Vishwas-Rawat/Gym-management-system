// src/pages/TrainerCompleteRegistrationPage.jsx
import React, { useEffect, useState } from 'react';
import { ThemeProvider, CssBaseline, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import lightTheme from '../themes/lightTheme';
import TrainerCompleteRegistrationForm from '../components/TrainerCompleteRegistrationForm';
import { TrainerRegistrationProvider, useTrainerRegistration } from '../context/TrainerRegistrationContext';
import { useSearchParams } from 'react-router-dom';
import { ErrorOutline } from '@mui/icons-material';

const TrainerCompleteRegistrationPageContent = () => {
  const [searchParams] = useSearchParams();
  const { setCompleteRegForm } = useTrainerRegistration();
  const [missingToken, setMissingToken] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setCompleteRegForm((prev) => ({ ...prev, token }));
    } else {
      setMissingToken(true);
    }
  }, [searchParams, setCompleteRegForm]);

  if (missingToken) {
    return (
      <AuthLayout title="Registration Error" navText="Return to login" navLink="/login">
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4 }}>
          <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Invalid or Missing Registration Token
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please check the link in your email and try again.
          </Typography>
        </Paper>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Trainer Registration"
      navText="Finish setting up your trainer account"
      navAction="Already have an account?"
      navLink="/login"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TrainerCompleteRegistrationForm />
      </motion.div>
    </AuthLayout>
  );
};

const TrainerCompleteRegistrationPage = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <TrainerRegistrationProvider>
        <TrainerCompleteRegistrationPageContent />
      </TrainerRegistrationProvider>
    </ThemeProvider>
  );
};

export default TrainerCompleteRegistrationPage;
