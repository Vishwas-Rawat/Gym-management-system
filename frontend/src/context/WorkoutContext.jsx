import React, { createContext, useContext, useState, useCallback } from 'react';
import { workoutService } from '../services/workoutService';

const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage('');
  }, []);

  const assignWorkout = useCallback(async (data) => {
    setLoading(true);
    clearMessages();
    try {
      const result = await workoutService.assignWorkout(data);
      setSuccessMessage(result.message || 'Workout plan assigned successfully!');
      return result;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign workout plan');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  const getLatestWorkout = useCallback(async (memberId) => {
    setLoading(true);
    clearMessages();
    try {
      const plan = await workoutService.getLatestWorkout(memberId);
      setCurrentPlan(plan);
      return plan;
    } catch (err) {
      // If 404, it might just mean no plan exists
      if (err.response?.status === 404) {
        setCurrentPlan(null);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch workout plan');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [clearMessages]);

  const value = {
    loading,
    error,
    successMessage,
    currentPlan,
    assignWorkout,
    getLatestWorkout,
    clearMessages
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};
