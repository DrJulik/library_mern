import api from './api';

interface ReadingListResponse {
  success: boolean;
  inList?: boolean;
  message?: string;
}

interface ReadingListItem {
  book: { _id: string; title: string; author: string; imageLink?: string; description?: string };
  createdAt: string;
}

interface MyReadingListResponse {
  success: boolean;
  items: ReadingListItem[];
  books: { _id: string; title: string; author: string; imageLink?: string }[];
}

const readingListService = {
  add: async (bookId: string): Promise<ReadingListResponse> => {
    const res = await api.post<ReadingListResponse>(`/v1/reading-list/${bookId}`);
    return res.data;
  },

  remove: async (bookId: string): Promise<ReadingListResponse> => {
    const res = await api.delete<ReadingListResponse>(`/v1/reading-list/${bookId}`);
    return res.data;
  },

  getMine: async (): Promise<MyReadingListResponse> => {
    const res = await api.get<MyReadingListResponse>('/v1/reading-list/mine');
    return res.data;
  },

  check: async (bookId: string): Promise<{ success: boolean; inList: boolean }> => {
    const res = await api.get<{ success: boolean; inList: boolean }>(`/v1/reading-list/check/${bookId}`);
    return res.data;
  },
};

export default readingListService;
