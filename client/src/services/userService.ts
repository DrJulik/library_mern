import api from './api';
import { User, RegisterData, UsersResponse } from '../types';

const userService = {
  // Get all users (admin only)
  getAllUsers: async (): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>('/users/all');
    return response.data;
  },

  // Register new admin (admin only)
  registerNewAdmin: async (adminData: RegisterData): Promise<{ success: boolean; message: string; user: User }> => {
    const response = await api.post('/users/add/admin', adminData);
    return response.data;
  },
};

export default userService;

