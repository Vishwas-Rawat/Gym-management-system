import { memberActivityApi } from './api';

export const workoutService = {
  // 1. Trainer: Assign / Update Workout Plan
  assignWorkout: async (data) => {
    // Endpoint: /api/workout/assign
    // Note: Documentation says /api/workout means likely Port 8083 (Member Activity Service)
    const response = await memberActivityApi.post('/api/workout/assign', data);
    return response.data;
  },

  // 2. Trainer: View Member's Assigned Workout Plan
  getMemberWorkoutPlan: async (memberId) => {
    // Endpoint: /api/workout/member/{memberId}/plan
    const response = await memberActivityApi.get(`/api/workout/member/${memberId}/plan`);
    return response.data;
  },

  // 3. Member: View My Current Workout Plan
  getMyWorkoutPlan: async () => {
    // Endpoint: /api/workout/my-plan
    const response = await memberActivityApi.get('/api/workout/my-plan');
    return response.data;
  },

  // 4. Get Exercise Dictionary (Port 8085)
  getExerciseDictionary: async () => {
    // Endpoint: /api/exercise/dictionary
    const response = await memberActivityApi.get('/api/exercise/dictionary');
    return response.data;
  },

  // 5. Add New Exercise to Master Dictionary
  createExercise: async (exerciseData) => {
    // Expected: { muscleGroup, displayName, code }
    const response = await memberActivityApi.post('/api/exercise', exerciseData);
    return response.data;
  }
};

