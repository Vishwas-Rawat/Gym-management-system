import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (fields) => {
    const newErrors = {};
    if (fields.email && (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))) {
      newErrors.email = 'Valid email is required';
    }
    if (fields.password && (!formData.password || formData.password.length < 8)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (endpoint, successAction) => {
    setApiError('');
    setSuccessMessage('');
    if (!validateForm({ email: true, password: true })) return;

    setIsLoading(true);
    try {
      const response = await api.post(endpoint, formData);
      const data = response.data;
      if (successAction(data)) {
        setSuccessMessage('Success! Redirecting...');
        setTimeout(() => navigate(successAction(data).redirect || '/dashboard'), 2000);
      } else if (data.message?.includes('not verified')) {
        setApiError('Account not verified. Please verify your OTP first.');
        setTimeout(() => navigate(`/verify-otp?userId=${data.userId}`), 2000);
      } else {
        setApiError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setApiError(error.response?.data?.message || error.message || 'Failed due to a network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
    setSuccessMessage('');
  };

  const value = { formData, errors, apiError, successMessage, isLoading, handleChange, validateForm, handleSubmit };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);