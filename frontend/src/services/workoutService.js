import { memberActivityApi } from './api';

export const workoutService = {
  // 1. Trainer: Assign / Update Workout Plan
  assignWorkout: async (data) => {
    // Endpoint: /api/workout/assign
    // Note: Documentation says /api/workout means likely Port 8085 (Member Activity Service)
    const response = await memberActivityApi.post('/api/workout/assign', data);
    return response.data;
  },

  // 2. Get Latest Workout Plan (Member or Trainer)
  getLatestWorkout: async (memberId) => {
    // Endpoint: /api/workout/member/{memberId}/latest
    const response = await memberActivityApi.get(`/api/workout/member/${memberId}/latest`);
    return response.data;
  },

  // 3. Member: View My Current Workout Plan
  getMyWorkoutPlan: async () => {
      // Endpoint: /api/workout/my-plan
      const response = await memberActivityApi.get('/api/workout/my-plan');
      return response.data;
  }
};

