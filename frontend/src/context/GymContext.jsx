import React, { createContext, useState, useContext } from 'react';
import api, { userApi } from '../services/api';

const GymContext = createContext();

export const useGym = () => useContext(GymContext);

export const GymProvider = ({ children }) => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create Gyms
  const createGyms = async (gymData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.post('/gym/create', gymData);
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create gyms.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Get My Gyms
  const getMyGyms = async () => {
    setLoading(true);
    try {
      const response = await userApi.get('/gym/my-gyms');
      setGyms(response.data || []);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Get my gyms error:", err);
      setError("Failed to fetch gyms.");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update Gym
  const updateGym = async (gymId, updateData) => {
    setLoading(true);
    try {
      const response = await userApi.put(`/gym/update/${gymId}`, updateData);
      // Update local state
      setGyms(prev => prev.map(g => g.gymId === gymId ? response.data : g));
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update gym.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Delete Gym
  const deleteGym = async (gymId) => {
    setLoading(true);
    try {
      await userApi.delete(`/gym/delete/${gymId}`);
      // Update local state
      setGyms(prev => prev.filter(g => g.gymId !== gymId));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete gym.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <GymContext.Provider
      value={{
        gyms,
        loading,
        error,
        createGyms,
        getMyGyms,
        updateGym,
        deleteGym
      }}
    >
      {children}
    </GymContext.Provider>
  );
};
