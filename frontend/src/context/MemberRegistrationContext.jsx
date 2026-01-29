// src/context/MemberRegistrationContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import api, { userApi } from '../services/api'; // userApi is on port 8083
import { authService } from '../services/authService';

const MemberRegistrationContext = createContext();

export const MemberRegistrationProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [gyms, setGyms] = useState([]);

  const clearMessages = () => {
    setApiError('');
    setSuccessMessage('');
  };

  const validateMemberId = (id) => {
    if (id === undefined || id === null || id === 'undefined' || id === 'null') {
      throw new Error(`Invalid member ID: ${id}`);
    }
    const numId = Number(id);
    if (isNaN(numId)) {
      throw new Error(`Invalid member ID (NaN): ${id}`);
    }
    return numId;
  };

  /* -------------------------------------------------- */
  /* 1. Fetch all gyms */
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
      const msg = err.response?.data?.followup || 'Failed to load gyms';
      setApiError(msg);
      console.error('FETCH GYMS ERROR', err);
      setGyms([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 2. Add multiple members */
  /* -------------------------------------------------- */
  const addMultipleMembers = useCallback(async (membersArray) => {
    setIsLoading(true);
    clearMessages();
    try {
      // POST /member/admin/add-multiple (Port 8083)
      const { data } = await userApi.post('/member/admin/add-multiple', membersArray);
      setSuccessMessage(data.message || `${membersArray.length} members added successfully`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add members';
      setApiError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      const { data } = await userApi.post(`/member/admin/${userId}/resend-invite`);
      setSuccessMessage(data.message);
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
  /* 4. GET MEMBER DETAIL – RAW */
  /* -------------------------------------------------- */
  const getMemberDetail = useCallback(async (memberId) => {
    try {
      const id = validateMemberId(memberId);
      setIsLoading(true);
      clearMessages();
      const { data } = await userApi.get(`/member/${id}`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Member not found';
      setApiError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 5. GET MEMBER BY ID – MAPPED (for edit) */
  /* -------------------------------------------------- */
  const getMemberById = useCallback(async (memberId, background = false) => {
    try {
      const id = validateMemberId(memberId);
      if (!background) setIsLoading(true);
      clearMessages();
      const { data } = await userApi.get(`/member/${id}`);

      const workoutTimeSlot = data.workoutTimeSlot || data.timing || '';

      let monthsPaid = data.monthsPaid?.toString() || '';
      let monthsFree = data.monthsFree?.toString() || '0';
      if (!data.monthsPaid && data.membershipPlan) {
        const plan = data.membershipPlan || '';
        const paidMatch = plan.match(/(\d+)\s*month/i);
        const freeMatch = plan.toLowerCase().includes('free') ? '1' : '0';
        monthsPaid = paidMatch ? paidMatch[1] : '';
        monthsFree = freeMatch;
      }

      return {
        id: data.memberId || data.id,
        fullName: data.fullName || '',
        email: data.email || '',
        phoneNo: data.phoneNo || data.phoneNumber || '',
        gymId: data.gymId || '',
        monthsPaid,
        monthsFree,
        workoutTimeSlot,
        registrationFee: (data.registrationFee || 0).toString(),
        planPrice: (data.planPrice || 0).toString(),
        discount: (data.discount || 0).toString(),
        totalAmount: data.totalPaid || data.amountPaid || 0,
        paymentMethod: data.paymentMethod || '',
        joiningDate: data.joiningDate || data.startDate || '',
        workoutTimeSlot: timeSlot,
      };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Member not found';
      setApiError(msg);
      return null;
    } finally {
      if (!background) setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 6. Get member by userId */
  /* -------------------------------------------------- */
  const getMemberByUserId = useCallback(async (userId) => {
    if (!userId) {
      setApiError('Invalid user ID');
      return null;
    }
    setIsLoading(true);
    clearMessages();
    try {
      const { data } = await userApi.get(`/member/user/${userId}`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Member not found';
      setApiError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 7. List members by gymId → NEW API */
  /* -------------------------------------------------- */
  const fetchMembers = useCallback(async (gymId = null) => {
    setIsLoading(true);
    clearMessages();
    try {
      // NOTE: For now, if no gymId is provided, we try to fetch all.
      // Ideally, Admin should select a gym.
      if (!gymId) {
        // Check if user is a trainer
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');
        
        if (role === 'TRAINER' && userId) {
             const { data } = await userApi.get(`/trainer/${userId}/members`);
             return data || [];
        }

        // If no gymId, fetch active members for MY gyms (Admin only)
        const { data } = await userApi.get('/member/admin/all/my-members');
        return data || [];
      }

      const { data } = await userApi.get(`/member/gym/${gymId}`);
      return data || [];
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load members';
      setApiError(msg);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 8. Search members by gymId → NEW API */
  /* -------------------------------------------------- */
  const searchMembers = useCallback(async (keyword, gymId = null) => {
    if (!keyword?.trim()) return [];
    setIsLoading(true);
    clearMessages();
    try {
      if (!gymId) {
        const { data } = await userApi.get(`/member/search?keyword=${encodeURIComponent(keyword)}`);
        return data || [];
      }

      const { data } = await userApi.get(`/member/gym/${gymId}`);
      // Filter client-side if needed
      const filtered = data.filter(m =>
        m.fullName?.toLowerCase().includes(keyword.toLowerCase()) ||
        m.email?.toLowerCase().includes(keyword.toLowerCase()) ||
        m.phoneNo?.includes(keyword)
      );
      return filtered;
    } catch (err) {
      setApiError('Search failed');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 9. Add single member */
  /* -------------------------------------------------- */
  const addMember = useCallback((payload) => addMultipleMembers([payload]), [addMultipleMembers]);

  /* -------------------------------------------------- */
  /* 10. UPDATE MEMBER */
  /* -------------------------------------------------- */
  const updateMember = useCallback(async (memberId, payload) => {
    try {
      const id = validateMemberId(memberId);
      setIsLoading(true);
      clearMessages();
      // PUT /member/{memberId} (Port 8083)
      const { data } = await userApi.put(`/member/${id}`, payload);
      setSuccessMessage(data.message || 'Member updated successfully');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed';
      setApiError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 11. Soft-delete */
  /* -------------------------------------------------- */
  const deleteMember = useCallback(async (memberId) => {
    try {
      const id = validateMemberId(memberId);
      setIsLoading(true);
      clearMessages();
      const { data } = await userApi.delete(`/member/${id}`);
      setSuccessMessage(data.message || 'Member deleted');
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
  /* 12. Send Payment Reminder */
  /* -------------------------------------------------- */
  const sendPaymentReminder = useCallback(async (memberId) => {
    try {
      const id = validateMemberId(memberId);
      setIsLoading(true);
      clearMessages();
      const { data } = await userApi.post(`/member/admin/send-reminder/${id}`);
      // Remove "(expired)" from the message if present
      const cleanMessage = (data.message || 'Payment reminder sent successfully').replace('(expired)', '').trim();
      setSuccessMessage(cleanMessage);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send reminder';
      setApiError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 13. COMPLETE REGISTRATION (Member) */
  /* -------------------------------------------------- */
  const [completeRegForm, setCompleteRegForm] = useState({
    token: '',
    username: '',
    password: '',
    confirmPassword: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    fitnessGoal: '',
    workoutTimeSlot: '',
  });

  const [errors, setErrors] = useState({});
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleCompleteRegChange = (e) => {
    const { name, value } = e.target;
    setCompleteRegForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCompleteRegistration = async () => {
    setIsLoading(true);
    clearMessages();
    setErrors({}); // Clear previous errors
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
        fitnessGoal: completeRegForm.fitnessGoal,
        workoutTimeSlot: completeRegForm.workoutTimeSlot,
        age: completeRegForm.age,
      };

      const data = await authService.completeMemberRegistration(payload);
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
    <MemberRegistrationContext.Provider
      value={{
        isLoading,
        apiError,
        successMessage,
        clearMessages,
        gyms,
        fetchGyms,
        fetchMembers,
        searchMembers,
        addMember,
        addMultipleMembers,
        getMemberDetail,
        getMemberById,
        getMemberByUserId,
        updateMember,
        deleteMember,
        resendInvite,
        sendPaymentReminder,
        // Complete Registration exports
        completeRegForm,
        setCompleteRegForm,
        handleCompleteRegChange,
        handleCompleteRegistration,
        errors,
        isRedirecting,
      }}
    >
      {children}
    </MemberRegistrationContext.Provider>
  );
};

export const useMemberRegistration = () => useContext(MemberRegistrationContext);