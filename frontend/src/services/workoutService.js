import api from './api';

export const workoutService = {
  assignWorkout: async (data) => {
    const response = await api.post('/api/workout/assign', data);
    return response.data;
  },

  getLatestWorkout: async (memberId) => {
    const response = await api.get(`/trainer/${memberId}/members`);
    return response.data;
  }
};
