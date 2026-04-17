// src/context/TrainerRegistrationContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import api, { userApi } from '../services/api'; // userApi is 8083

const TrainerRegistrationContext = createContext();

export const TrainerRegistrationProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [gyms, setGyms] = useState([]);

  const clearMessages = () => {
    setApiError('');
    setSuccessMessage('');
  };

  const validateId = (id) => {
    if (id === undefined || id === null || id === 'undefined' || id === 'null') {
      throw new Error(`Invalid ID: ${id}`);
    }
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new Error(`Invalid ID (NaN): ${id}`);
    }
    return numId;
  };

  /* -------------------------------------------------- */
  /* 1. Fetch all gyms (Reused from Member context logic if needed, or separate endpoint) */
  /* -------------------------------------------------- */
  const fetchGyms = useCallback(async () => {
    setIsLoading(true);
    clearMessages();
    try {
      const { data } = await userApi.get('/gym/my-gyms');
      const gymList = Array.isArray(data) ? data : [];
      setGyms(gymList);
      return gymList;
    } catch (err) {
      console.error('FETCH GYMS ERROR', err);
      // Don't set error here to avoid blocking UI if just gyms fail
      setGyms([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 2. Add multiple trainers */
  /* -------------------------------------------------- */
  const addMultipleTrainers = useCallback(async (trainersArray) => {
    setIsLoading(true);
    clearMessages();
    try {
      const { data } = await userApi.post('/trainer/admin/add-trainers', trainersArray);
      setSuccessMessage(data[0]?.message || `${trainersArray.length} trainers added`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add trainers';
      setApiError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTrainer = useCallback((payload) => addMultipleTrainers([payload]), [addMultipleTrainers]);

  /* -------------------------------------------------- */
  /* 3. Resend invite */
  /* -------------------------------------------------- */
  const resendInvite = useCallback(async (userId) => {
    if (!userId) {
      setApiError('Invalid user ID');
      return;
    }
    setIsLoading(true);
    clearMessages();
    try {
      const { data } = await userApi.post(`/trainer/admin/trainer/${userId}/resend`);
      setSuccessMessage(data.message || 'Invite resent successfully');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Resend failed';
      setApiError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 4. GET TRAINER DETAIL */
  /* -------------------------------------------------- */
  /* -------------------------------------------------- */
  /* 4. GET TRAINER DETAIL */
  /* -------------------------------------------------- */
  /* -------------------------------------------------- */
  /* HELPER: Map nested user data to top-level */
  /* -------------------------------------------------- */
  const mapTrainerData = (data) => {
    if (!data) return data;
    if (Array.isArray(data)) {
      return data.map(item => mapTrainerData(item));
    }
    
    // The backend now provides a flat structure:
    // trainerId, fullName, email, phoneNo, specialization, experienceYears, gymName
    // We keep mapTrainerData for backward compatibility or if some fields are missing
    return {
      ...data,
      fullName: data.fullName || (data.user?.userProfile ? `${data.user.userProfile.firstName} ${data.user.userProfile.lastName}` : ''),
      email: data.email || data.user?.email || '',
      phoneNo: data.phoneNo || data.user?.phoneNumber || '',
    };
  };

  /* -------------------------------------------------- */
  /* 4. GET TRAINER DETAIL */
  /* -------------------------------------------------- */
  const getTrainerById = useCallback(async (trainerId) => {
    try {
      const id = validateId(trainerId);
      setIsLoading(true);
      clearMessages();
      const { data } = await userApi.get(`/trainer/${id}`);
      return mapTrainerData(data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Trainer not found';
      setApiError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 5. List trainers (All or by Gym) */
  /* -------------------------------------------------- */
  const fetchTrainers = useCallback(async (gymId = null) => {
    setIsLoading(true);
    clearMessages();
    try {
      let endpoint = '/trainer/admin/all/my-trainers';
      if (gymId) {
        endpoint = `/trainer/gym/${gymId}`;
      }
      const { data } = await userApi.get(endpoint);
      const list = data || [];
      return mapTrainerData(list);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load trainers';
      setApiError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 6. Search trainers */
  /* -------------------------------------------------- */
  const searchTrainers = useCallback(async (keyword, gymId = null) => {
    if (!keyword?.trim()) return [];
    setIsLoading(true);
    clearMessages();
    try {
      const { data } = await userApi.get(`/trainer/search?keyword=${encodeURIComponent(keyword)}`);
      
      let results = data || [];
      if (gymId) {
        results = results.filter(t => t.gymId === Number(gymId) || t.gymName === gymId); 
      }
      return mapTrainerData(results);
    } catch (err) {
      setApiError('Search failed');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 7. UPDATE TRAINER */
  /* -------------------------------------------------- */
  const updateTrainer = useCallback(async (trainerId, payload) => {
    try {
      const id = validateId(trainerId);
      setIsLoading(true);
      clearMessages();
      const { data } = await userApi.put(`/trainer/${id}`, payload);
      setSuccessMessage(data.message || 'Trainer updated successfully');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Update failed';
      setApiError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 8. Soft-delete */
  /* -------------------------------------------------- */
  const deleteTrainer = useCallback(async (trainerId) => {
    try {
      const id = validateId(trainerId);
      setIsLoading(true);
      clearMessages();
      const { data } = await userApi.delete(`/trainer/${id}`);
      setSuccessMessage(data.message || 'Trainer deleted');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Delete failed';
      setApiError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 9. ASSIGN MEMBERS */
  /* -------------------------------------------------- */
  const assignMembers = useCallback(async (trainerId, memberIds) => {
    try {
      if (!trainerId || !memberIds || memberIds.length === 0) {
        throw new Error("Trainer ID and Member IDs are required");
      }
      setIsLoading(true);
      clearMessages();
      const payload = { trainerId: Number(trainerId), memberIds: memberIds.map(Number) };
      const { data } = await userApi.post('/trainer/admin/assign-members', payload);
      setSuccessMessage(data.message || 'Members assigned successfully');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Assign members failed';
      setApiError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 10. COMPLETE REGISTRATION (Trainer) */
  /* -------------------------------------------------- */
  const [completeRegForm, setCompleteRegForm] = useState({
    token: '',
    username: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
  });

  const [errors, setErrors] = useState({});
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleCompleteRegChange = (e) => {
    const { name, value } = e.target;
    setCompleteRegForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCompleteRegistration = async () => {
    setIsLoading(true);
    clearMessages();
    setErrors({});
    try {
      if (completeRegForm.password !== completeRegForm.confirmPassword) {
        setErrors({ confirmPassword: 'Passwords do not match' });
        throw new Error('Passwords do not match');
      }
      
      const payload = {
        token: completeRegForm.token,
        password: completeRegForm.password,
        username: completeRegForm.username,
        gender: completeRegForm.gender,
        dateOfBirth: completeRegForm.dateOfBirth,
      };

      const { data } = await userApi.post('/trainer/complete-registration', payload);
      setSuccessMessage(data.message || 'Registration completed successfully!');
      setIsRedirecting(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TrainerRegistrationContext.Provider
      value={{
        isLoading,
        apiError,
        successMessage,
        clearMessages,
        gyms,
        fetchGyms,
        fetchTrainers,
        searchTrainers,
        addTrainer,
        addMultipleTrainers,
        getTrainerById,
        updateTrainer,
        deleteTrainer,
        resendInvite,
        assignMembers,
        // Complete Registration
        completeRegForm,
        setCompleteRegForm,
        handleCompleteRegChange,
        handleCompleteRegistration,
        errors,
        isRedirecting,
      }}
    >
      {children}
    </TrainerRegistrationContext.Provider>
  );
};

export const useTrainerRegistration = () => useContext(TrainerRegistrationContext);
