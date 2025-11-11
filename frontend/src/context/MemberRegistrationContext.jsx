// src/context/MemberRegistrationContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../services/api';

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
    if (!id || id === 'undefined' || id === 'null' || isNaN(id)) {
      throw new Error('Invalid member ID');
    }
    return Number(id);
  };

  /* -------------------------------------------------- */
  /* 1. Fetch all gyms */
  /* -------------------------------------------------- */
  const fetchGyms = useCallback(async () => {
    setIsLoading(true);
    clearMessages();
    try {
      const { data } = await api.get('/gym/my-gyms');
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
      const { data } = await api.post('/member/admin/add-multiple', membersArray);
      setSuccessMessage(data.message || `${membersArray.length} members added`);
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
      const { data } = await api.post(`/member/admin/${userId}/resend-invite`);
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
      const { data } = await api.get(`/member/${id}`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Member not found';
      setApiError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------- */
  /* 5. GET MEMBER BY ID – MAPPED (for edit) */
  /* -------------------------------------------------- */
  const getMemberById = useCallback(async (memberId) => {
    try {
      const id = validateMemberId(memberId);
      setIsLoading(true);
      clearMessages();
      const { data } = await api.get(`/member/${id}`);

      const timeSlot = data.timing || data.workoutTimeSlot || '';
      const [fromPart = '', toPart = ''] = timeSlot.split(' to ');
      const [fromTime = '', fromPeriod = ''] = fromPart.trim().split(' ');
      const [toTime = '', toPeriod = ''] = toPart.trim().split(' ');
      const [fromHour = '', fromMinute = ''] = fromTime.split(':');
      const [toHour = '', toMinute = ''] = toTime.split(':');

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
        fromHour, fromMinute, fromPeriod,
        toHour, toMinute, toPeriod,
        registrationFee: (data.registrationFee || 0).toString(),
        planPrice: (data.planPrice || 0).toString(),
        discount: (data.discount || 0).toString(),
        totalAmount: data.totalPaid || data.amountPaid || 0,
        paymentMethod: data.paymentMethod || '',
        startDate: data.startDate || data.joiningDate || '',
        workoutTimeSlot: timeSlot,
      };
    } catch (err) {
      const msg = err.response?.data?.message || 'Member not found';
      setApiError(msg);
      return null;
    } finally {
      setIsLoading(false);
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
      const { data } = await api.get(`/member/user/${userId}`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Member not found';
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
      if (!gymId) {
        // Optional: fallback to all members
        const { data } = await api.get('/member/all');
        return data || [];
      }

      const { data } = await api.get(`/member/gym/${gymId}`);
      return data || [];
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load members';
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
        const { data } = await api.get(`/member/search?keyword=${encodeURIComponent(keyword)}`);
        return data || [];
      }

      const { data } = await api.get(`/member/gym/${gymId}`);
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
      const { data } = await api.put(`/member/${id}`, payload);
      setSuccessMessage(data.message || 'Member updated');
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
      const { data } = await api.delete(`/member/${id}`);
      setSuccessMessage(data.message || 'Member deleted');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Delete failed';
      setApiError(msg);
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
      }}
    >
      {children}
    </MemberRegistrationContext.Provider>
  );
};

export const useMemberRegistration = () => useContext(MemberRegistrationContext);