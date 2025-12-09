import { trainerDashboardApi } from './api';

const processError = (error) => {
  return error.response?.data?.message || 'Something went wrong';
};

export const getMyStats = async () => {
    try {
        const response = await trainerDashboardApi.get('/api/trainer/dashboard/my-stats');
        return response.data;
    } catch (error) {
        throw processError(error);
    }
};

export const getMyMembers = async () => {
    try {
        const response = await trainerDashboardApi.get('/api/trainer/dashboard/my-members');
        return response.data;
    } catch (error) {
         throw processError(error);
    }
};

export const getTodayAttendance = async () => {
    try {
        const response = await trainerDashboardApi.get('/api/trainer/dashboard/today-attendance');
        return response.data;
    } catch (error) {
         throw processError(error);
    }
};

export const getInactiveMembers = async () => {
    try {
        const response = await trainerDashboardApi.get('/api/trainer/dashboard/inactive-members');
        return response.data;
    } catch (error) {
         throw processError(error);
    }
};

export const getUpcomingBirthdays = async () => {
    try {
        const response = await trainerDashboardApi.get('/api/trainer/dashboard/upcoming-birthdays');
        return response.data;
    } catch (error) {
         throw processError(error);
    }
};

export const getDietCompliance = async () => {
    try {
        const response = await trainerDashboardApi.get('/api/trainer/dashboard/diet-compliance');
        return response.data;
    } catch (error) {
         throw processError(error);
    }
};

export const getWorkoutCompliance = async () => {
    try {
        const response = await trainerDashboardApi.get('/api/trainer/dashboard/workout-compliance');
        return response.data;
    } catch (error) {
         throw processError(error);
    }
};

export const getRevenueShare = async () => {
    try {
        const response = await trainerDashboardApi.get('/api/trainer/dashboard/revenue-share');
        return response.data;
    } catch (error) {
         throw processError(error);
    }
};
