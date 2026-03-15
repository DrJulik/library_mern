import api from './api';

interface NotifyResponse {
  success: boolean;
  notified?: boolean;
  message?: string;
}

const notifyRequestService = {
  add: async (bookId: string): Promise<NotifyResponse> => {
    const res = await api.post<NotifyResponse>(`/v1/notify/${bookId}`);
    return res.data;
  },

  remove: async (bookId: string): Promise<NotifyResponse> => {
    const res = await api.delete<NotifyResponse>(`/v1/notify/${bookId}`);
    return res.data;
  },

  check: async (bookId: string): Promise<{ success: boolean; notified: boolean }> => {
    const res = await api.get<{ success: boolean; notified: boolean }>(`/v1/notify/check/${bookId}`);
    return res.data;
  },
};

export default notifyRequestService;
