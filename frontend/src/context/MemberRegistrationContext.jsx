import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const MemberRegistrationContext = createContext();

export const MemberRegistrationProvider = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Complete Registration Form Data
  const [completeRegForm, setCompleteRegForm] = useState({
    token: searchParams.get('token') || '',
    password: '',
    confirmPassword: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    fitnessGoal: '',
    workoutTimeSlot: '',
  });

  // Add Member Form Data (Admin)
  const [addMemberForm, setAddMemberForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gymId: '',
    membershipPlan: 'Gold',
    joiningDate: '',
    amountPaid: '',
    paymentMethod: 'Credit Card',
    workoutTimeSlot: '',
  });

  const [errors, setErrors] = useState({});

  // Validation functions
  const validateCompleteReg = () => {
    const newErrors = {};
    if (!completeRegForm.token) newErrors.token = 'Registration token is required';
    if (!completeRegForm.password || completeRegForm.password.length < 8) 
      newErrors.password = 'Password must be at least 8 characters';
    if (completeRegForm.password !== completeRegForm.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddMember = () => {
    const newErrors = {};
    if (!addMemberForm.firstName) newErrors.firstName = 'First name is required';
    if (!addMemberForm.lastName) newErrors.lastName = 'Last name is required';
    if (!addMemberForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addMemberForm.email))
      newErrors.email = 'Valid email is required';
    if (!addMemberForm.gymId || isNaN(addMemberForm.gymId))
      newErrors.gymId = 'Valid gym ID is required';
    if (!addMemberForm.membershipPlan) newErrors.membershipPlan = 'Membership plan is required';
    if (!addMemberForm.joiningDate) newErrors.joiningDate = 'Joining date is required';
    if (!addMemberForm.amountPaid || isNaN(addMemberForm.amountPaid) || addMemberForm.amountPaid <= 0)
      newErrors.amountPaid = 'Valid amount is required';
    if (!addMemberForm.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Complete Registration API
  const handleCompleteRegistration = async () => {
    if (!validateCompleteReg()) return;

    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const payload = {
        token: completeRegForm.token,
        password: completeRegForm.password,
        ...(completeRegForm.age && { age: parseInt(completeRegForm.age) }),
        ...(completeRegForm.dateOfBirth && { dateOfBirth: completeRegForm.dateOfBirth }),
        ...(completeRegForm.gender && { gender: completeRegForm.gender }),
        ...(completeRegForm.fitnessGoal && { fitnessGoal: completeRegForm.fitnessGoal }),
        ...(completeRegForm.workoutTimeSlot && { workoutTimeSlot: completeRegForm.workoutTimeSlot }),
      };

      const response = await api.post('/member-self/complete-registration', payload);
      const data = response.data;

      if (data.success) {
        setSuccessMessage(data.message || 'Registration completed successfully!');
        setIsRedirecting(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setApiError(data.message || 'Registration failed');
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to complete registration');
    } finally {
      setIsLoading(false);
    }
  };

  // Add Member API (Admin) - MODIFIED TO RETURN SUCCESS
  const handleAddMember = async () => {
    if (!validateAddMember()) return false;

    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      const payload = {
        firstName: addMemberForm.firstName,
        lastName: addMemberForm.lastName,
        email: addMemberForm.email,
        ...(addMemberForm.phoneNumber && { phoneNumber: addMemberForm.phoneNumber }),
        gymId: parseInt(addMemberForm.gymId),
        membershipPlan: addMemberForm.membershipPlan,
        joiningDate: addMemberForm.joiningDate,
        amountPaid: parseFloat(addMemberForm.amountPaid),
        paymentMethod: addMemberForm.paymentMethod,
        ...(addMemberForm.workoutTimeSlot && { workoutTimeSlot: addMemberForm.workoutTimeSlot }),
      };

      const response = await api.post('/member/admin/add', payload);
      const data = response.data;

      if (data.success) {
        setSuccessMessage(data.message || 'Member added successfully!');
        // Reset form
        setAddMemberForm({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          gymId: '',
          membershipPlan: 'Gold',
          joiningDate: '',
          amountPaid: '',
          paymentMethod: 'Credit Card',
          workoutTimeSlot: '',
        });
        return true; // ✅ Success
      } else {
        setApiError(data.message || 'Failed to add member');
        return false;
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to add member');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegChange = (e) => {
    const { name, value } = e.target;
    setCompleteRegForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddMemberChange = (e) => {
    const { name, value } = e.target;
    setAddMemberForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const value = {
    // Complete Registration
    completeRegForm,
    handleCompleteRegChange,
    handleCompleteRegistration,
    
    // Add Member (Admin)
    addMemberForm,
    handleAddMemberChange,
    handleAddMember,
    
    // Shared
    isLoading,
    apiError,
    successMessage,
    isRedirecting,
    errors,
    setApiError,
    setSuccessMessage,
  };

  return (
    <MemberRegistrationContext.Provider value={value}>
      {children}
    </MemberRegistrationContext.Provider>
  );
};

export const useMemberRegistration = () => useContext(MemberRegistrationContext);