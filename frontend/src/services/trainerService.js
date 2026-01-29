import api, { userApi, trainerDashboardApi } from './api';

const processError = (error) => {
  return error.response?.data?.message || error.message || 'Something went wrong';
};

export const trainerService = {
  // 1. ADMIN: Add Multiple Trainers (8083)
  addMultipleTrainers: async (trainers) => {
    const response = await userApi.post('/trainer/admin/add-trainers', trainers);
    return response.data;
  },

  // 2. ADMIN: Resend Trainer Invite (8083)
  resendInvite: async (userId) => {
     const response = await userApi.post(`/trainer/admin/trainer/${userId}/resend`);
     return response.data;
  },

  // 3. PUBLIC: Trainer Complete Registration (Implemented in authService but good to be aware)

  // 4. ADMIN: Update Trainer Details (8083)
  updateTrainer: async (trainerId, data) => {
    const response = await userApi.put(`/trainer/${trainerId}`, data);
    return response.data;
  },

  // 5. ADMIN: Soft Delete Trainer (8083)
  deleteTrainer: async (trainerId) => {
    const response = await userApi.delete(`/trainer/${trainerId}`);
    return response.data;
  },

  // 6. Get All Active Trainers (8083)
  getAllTrainers: async () => {
    const response = await userApi.get('/trainer/all');
    return response.data;
  },

  // 7. Search Trainers (8083)
  searchTrainers: async (keyword) => {
    const response = await userApi.get(`/trainer/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  // 8. Get All Trainers in a Specific Gym (8083)
  getTrainersByGym: async (gymId) => {
    const response = await userApi.get(`/trainer/gym/${gymId}`);
    return response.data;
  },

  // 9. ADMIN: Assign Members to Trainer (8083)
  assignMembers: async (data) => {
    const response = await userApi.post('/trainer/admin/assign-members', data);
    return response.data;
  },

  // 10. TRAINER PANEL: Get My Assigned Members (Dashboard) (8085)
  getMyAssignedMembers: async (gymId) => {
      // NOTE: User doc says GET /trainer/members?gymId={id} on 8085
      const response = await api.get(`/trainer/members?gymId=${gymId}`);
      return response.data;
  },

  // 11. Get Workout Requests (8085)
  getWorkoutRequests: async () => {
      // NOTE: User doc says GET /trainer/requests/workout on 8085
      const response = await api.get('/trainer/requests/workout');
      return response.data;
  },

  // 12. Get Diet Requests (8085)
  getDietRequests: async () => {
      // NOTE: User doc says GET /trainer/requests/diet on 8085
      const response = await api.get('/trainer/requests/diet');
      return response.data;
  },

  // 13. Get Trainer By ID (8083)
  getTrainerById: async (trainerId) => {
    const response = await userApi.get(`/trainer/${trainerId}`);
    return response.data;
  }
};
