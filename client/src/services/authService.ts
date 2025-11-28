import api from './api';
import { AuthResponse, RegisterData, User } from '../types';

interface VerifyOtpData {
  email: string;
  otp: string;
}

interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}

interface ResetPasswordData {
  password: string;
}

const authService = {
  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (email: string, otp: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/verify-otp', { email, otp });
    return response.data;
  },

  // Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },

  // Logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.get('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<{ success: boolean; user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post('/auth/password/forgot', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put(`/auth/password/reset/${token}`, { password });
    return response.data;
  },

  // Update password
  updatePassword: async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.put('/auth/password/update', { oldPassword, newPassword });
    return response.data;
  },
};

export default authService;

