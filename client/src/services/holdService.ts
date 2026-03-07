import api from './api';
import { Hold, HoldListResponse, PlaceHoldResponse } from '../types';

interface HoldActionResponse {
  success: boolean;
  message: string;
  hold?: Hold;
}

const holdService = {
  placeHold: async (bookId: string): Promise<PlaceHoldResponse> => {
    const response = await api.post<PlaceHoldResponse>(`/v1/hold/${bookId}`);
    return response.data;
  },

  getMyHolds: async (): Promise<HoldListResponse> => {
    const response = await api.get<HoldListResponse>('/v1/hold/my-holds');
    return response.data;
  },

  getAllHolds: async (status?: string): Promise<HoldListResponse> => {
    const params = status ? { status } : {};
    const response = await api.get<HoldListResponse>('/v1/hold', { params });
    return response.data;
  },

  approveHold: async (holdId: string): Promise<HoldActionResponse> => {
    const response = await api.patch<HoldActionResponse>(`/v1/hold/${holdId}/approve`);
    return response.data;
  },

  rejectHold: async (holdId: string): Promise<HoldActionResponse> => {
    const response = await api.patch<HoldActionResponse>(`/v1/hold/${holdId}/reject`);
    return response.data;
  },

  releaseHold: async (holdId: string): Promise<HoldActionResponse> => {
    const response = await api.patch<HoldActionResponse>(`/v1/hold/${holdId}/release`);
    return response.data;
  },
};

export default holdService;
