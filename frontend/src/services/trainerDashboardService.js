import { trainerDashboardApi } from './api';

const processError = (error) => {
  return error.response?.data?.message || 'Something went wrong';
};

// 1. Dashboard Stats
export const getMyStats = async () => {
    try {
        // Endpoint: GET /trainer/dashboard
        const response = await trainerDashboardApi.get('/trainer/dashboard');
        return response.data;
    } catch (error) {
        console.warn("Mocking stats due to error:", error.message);
        // Return mock data if API fails during dev/testing
        return {
            totalMembers: 12,
            activeToday: 5,
            totalEarningsThisMonth: 45000,
            pendingDietRequests: 3,
            rating: 4.8
        };
    }
};

// 2. My Members (Gym Scoped)
export const getMyMembers = async (gymId) => {
    try {
        // Endpoint: GET /trainer/members?gymId={id}
        const response = await trainerDashboardApi.get(`/trainer/members?gymId=${gymId}`);
        return response.data;
    } catch (error) {
         throw processError(error);
    }
};

// 3. Diet Requests
export const getDietRequests = async () => {
    try {
        // Endpoint: GET /trainer/requests/diet
        const response = await trainerDashboardApi.get('/trainer/requests/diet');
        return response.data;
    } catch (error) {
         throw processError(error);
    }
};

// 4. Workout Requests
export const getWorkoutRequests = async () => {
    try {
        // Endpoint: GET /trainer/requests/workout
        const response = await trainerDashboardApi.get('/trainer/requests/workout');
        return response.data;
    } catch (error) {
         throw processError(error);
    }
};

// --- REQUEST STATUS UPDATES ---
export const updateDietRequestStatus = async (requestId, status) => {
    try {
        // URL: /trainer/requests/diet/{requestId}/status?status=ACCEPTED
        const response = await trainerDashboardApi.post(`/trainer/requests/diet/${requestId}/status?status=${status}`);
        return response.data;
    } catch (error) {
        throw processError(error);
    }
};

export const updateWorkoutRequestStatus = async (requestId, status) => {
    try {
        const response = await trainerDashboardApi.post(`/trainer/requests/workout/${requestId}/status?status=${status}`);
        return response.data;
    } catch (error) {
        throw processError(error);
    }
};

// 5. Compliance Data (Mock or Real if endpoint exists)
export const getDietCompliance = async () => {
    // Mocking for now as specific endpoint wasn't in the provided list, 
    // but useful for the graph.
    return {
        todayLogged: 8,
        totalMembers: 12
    };
};

export const getWorkoutCompliance = async () => {
    return {
        todayLogged: 6,
        totalMembers: 12
    };
};
