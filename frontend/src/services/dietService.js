import { dietApi } from './api';

// Trainer: Assign Diet Plan to Member
export const assignDietPlan = async (dietData) => {
  try {
    const response = await dietApi.post('/api/diet/assign', dietData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Trainer: View Latest Diet Plan of a Member
export const getMemberDietPlan = async (memberId) => {
  try {
    const response = await dietApi.get(`/api/diet/member/${memberId}/plan`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Member: View My Current Diet Plan
export const getMyDietPlan = async () => {
  try {
    const response = await dietApi.get('/api/diet/my-plan');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
