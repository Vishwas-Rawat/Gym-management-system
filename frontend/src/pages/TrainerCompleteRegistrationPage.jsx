// src/pages/TrainerCompleteRegistrationPage.jsx
import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { motion } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import lightTheme from '../themes/lightTheme';
import TrainerCompleteRegistrationForm from '../components/TrainerCompleteRegistrationForm';
import { TrainerRegistrationProvider, useTrainerRegistration } from '../context/TrainerRegistrationContext';
import { useSearchParams } from 'react-router-dom';

const TrainerCompleteRegistrationPageContent = () => {
  const [searchParams] = useSearchParams();
  const { setCompleteRegForm } = useTrainerRegistration();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setCompleteRegForm((prev) => ({ ...prev, token }));
    }
  }, [searchParams, setCompleteRegForm]);

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
