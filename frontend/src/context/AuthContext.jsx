import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { cryptoService } from '../services/cryptoService';

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
    if (fields.identifier && !formData.identifier) {
      newErrors.identifier = 'Username or Email is required';
    }
    if (fields.password && !formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (endpointMethod, successAction, validationRules = { email: true, password: true }, customPayload = null) => {
    setApiError('');
    setSuccessMessage('');
    if (!validateForm(validationRules)) return;

    setIsLoading(true);
    try {
      const payload = customPayload || formData;
      // Endpoint method is now a function from authService, or we can adapt the calling code.
      // To keep compatibility with existing generic usage, we might need a map or change usage.
      // However, to be cleaner, let's assume 'endpointMethod' is passed as a function or we refactor completely.
      // Based on current usage in pages (Generic RegisterPage might pass string '/user/register'...)
      
      let data;
      // Quick adapter for legacy string endpoints if necessary, OR we update the pages.
      // BUT simpler for now:
      if (typeof endpointMethod === 'function') {
           data = await endpointMethod(payload);
      } else if (endpointMethod === '/user/register') {
           data = await authService.register(payload);
      } else if (endpointMethod === '/user/login') {
           data = await authService.login(payload);
      } else {
           throw new Error("Invalid endpoint configuration");
      }

      const result = successAction(data);
      if (result) {
        setSuccessMessage('Success! Redirecting...');
        setTimeout(() => navigate(result.redirect || '/dashboard', { replace: true }), 2000);
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

  const resendOtp = async (userId) => {
    setApiError('');
    setSuccessMessage('');
    setIsLoading(true);
    try {
      const data = await authService.resendOtp(userId);
      setSuccessMessage(data.message || 'OTP resent successfully!');
    } catch (error) {
       setApiError(error.message || 'Failed to resend OTP');
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

  const logout = async (redirect = true) => {
    const userId = localStorage.getItem('userId');
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      if (userId) {
        localStorage.removeItem(`chat_priv_key_${userId}`);
        localStorage.removeItem(`chat_pub_key_${userId}`);
      }
      setFormData({});
      setErrors({});
      setApiError('');
      setSuccessMessage('');
      if (redirect) navigate('/login');
    }
  };

  const handleKeySync = async (password) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return false;
    try {
      // 1. Try to download keys
      const data = await authService.downloadKeys();
      if (data && data.encryptedPrivateKey && data.publicKey) {
        // 2. Decrypt private key
        const privateKeyJwk = await cryptoService.decryptPrivateKey(data.encryptedPrivateKey, password);
        if (privateKeyJwk) {
          localStorage.setItem(`chat_priv_key_${userId}`, privateKeyJwk);
          localStorage.setItem(`chat_pub_key_${userId}`, data.publicKey);
          console.log("Chat keys synced and decrypted successfully.");
          return true;
        }
      }
      
      // If we reach here, either keys don't exist OR decryption failed
      // Generate new keys if none exist on server
      if (!data || !data.encryptedPrivateKey) {
        const keyPair = await cryptoService.generateKeyPair();
        const publicKeyPem = await cryptoService.exportPublicKey(keyPair.publicKey);
        const privateKeyJwk = await cryptoService.exportPrivateKey(keyPair.privateKey);
        
        const encryptedPrivateKey = await cryptoService.encryptPrivateKey(privateKeyJwk, password);
        
        await authService.syncKeys({
          publicKey: publicKeyPem,
          encryptedPrivateKey: encryptedPrivateKey
        });
        
        localStorage.setItem(`chat_priv_key_${userId}`, privateKeyJwk);
        localStorage.setItem(`chat_pub_key_${userId}`, publicKeyPem);
        console.log("New chat keys generated and synced successfully.");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Key sync failed:", error);
      return false;
    }
  };

  const checkStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const data = await authService.checkStatus();
        const { active, message } = data;
        
        if (active === false) {
             console.warn("User is inactive:", message);
             alert(message || "Your account is inactive. Please contact admin.");
             logout(true);
        }
    } catch (error) {
        if (error.response?.status !== 404) {
             console.error("Status check failed", error);
        }
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const value = { 
      formData, 
      errors, 
      apiError, 
      successMessage, 
      isLoading, 
      handleChange, 
      validateForm, 
      handleSubmit, 
      logout, 
      checkStatus,
      resendOtp,
      handleKeySync
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);