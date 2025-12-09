import api, { userApi } from './api';

export const authService = {
  // 1. Admin Self-Registration
  register: async (data) => {
    // Auth usually on 8083
    const response = await userApi.post('/user/register', data);
    return response.data;
  },

  // 2. Verify OTP
  verifyOtp: async (userId, otpCode) => {
    const response = await userApi.post(`/user/verify-otp?userId=${userId}&otpCode=${otpCode}`);
    return response.data;
  },

  // 3. Resend OTP
  resendOtp: async (userId) => {
    const response = await userApi.post(`/user/resend-otp?userId=${userId}`);
    return response.data;
  },

  // 4. Login
  login: async (credentials) => {
    const response = await userApi.post('/user/login', credentials);
    return response.data;
  },

  // 5. Member Complete Registration
  completeMemberRegistration: async (data) => {
    // This might be on member service? Docs said /member/complete-registration. 
    // Usually member management is split. 
    // If it's pure Auth, 8083. If it creates member profile, maybe 8085?
    // Docs: "5. Member Registration... Url: /member/complete-registration"
    // Does not specify port explicitly in that section.
    // However, Gym Management Auth Doc says Base URL: http://localhost:8083
    // So 8083 is likely correct for ALL these.
    const response = await userApi.post('/member/complete-registration', data);
    return response.data;
  },

  // 6. Trainer Complete Registration
  completeTrainerRegistration: async (data) => {
    const response = await userApi.post('/trainer/complete-registration', data);
    return response.data;
  },

  // 7. Get User Profile
  getUserProfile: async (userId) => {
    const response = await userApi.get(`/user/profile/${userId}`);
    return response.data;
  },
  
  // 8. Check Status

  checkStatus: async () => {
      // User requests 8085 for check-status
      const response = await api.get('/auth/check-status');
      return response.data;
  },

  // 9. Logout
  logout: async () => {
    return await userApi.post('/auth/logout');
  },

  // 10. Forgot Password
  forgotPassword: async (email) => {
    const response = await userApi.post('/auth/forgot-password', { email });
    return response.data;
  },

  // 11. Reset Password
  resetPassword: async (data) => {
    // data: { email, otp, newPassword }
    const response = await userApi.post('/auth/reset-password', data);
    return response.data;
  }
};


