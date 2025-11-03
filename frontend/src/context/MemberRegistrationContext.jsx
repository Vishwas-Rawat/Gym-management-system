// src/context/MemberRegistrationContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../services/api';

const MemberRegistrationContext = createContext();

export const MemberRegistrationProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = () => {
    setApiError('');
    setSuccessMessage('');
  };

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    clearMessages();
    try {
      const { data } = await api.get('/member/all');
      return data || [];
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load members';
      setApiError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchMembers = useCallback(async (keyword) => {
    setIsLoading(true);
    clearMessages();
    try {
      const { data } = await api.get(`/member/search?keyword=${encodeURIComponent(keyword)}`);
      return data || [];
    } catch (err) {
      setApiError('Search failed');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addMember = useCallback(async (payload) => {
    setIsLoading(true);
    clearMessages();
    try {
      const { data } = await api.post('/member/admin/add', payload);
      setSuccessMessage(data.message || 'Member added successfully');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add member';
      setApiError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteMember = useCallback(async (memberId) => {
    setIsLoading(true);
    clearMessages();
    try {
      const { data } = await api.delete(`/member/${memberId}`);
      setSuccessMessage(data.message || 'Member deleted');
      return true;
    } catch (err) {
      setApiError(err.response?.data?.message || 'Delete failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <MemberRegistrationContext.Provider
      value={{
        isLoading,
        apiError,
        successMessage,
        clearMessages,
        fetchMembers,
        searchMembers,
        addMember,
        deleteMember,
      }}
    >
      {children}
    </MemberRegistrationContext.Provider>
  );
};

export const useMemberRegistration = () => useContext(MemberRegistrationContext);