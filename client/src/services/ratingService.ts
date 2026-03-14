import api from './api';

interface SubmitRatingResponse {
  success: boolean;
  message: string;
  rating: number;
}

interface GetUserRatingResponse {
  success: boolean;
  rating: number | null;
}

const ratingService = {
  submitRating: async (bookId: string, rating: number): Promise<SubmitRatingResponse> => {
    const response = await api.post<SubmitRatingResponse>(`/v1/rating/${bookId}`, { rating });
    return response.data;
  },

  getUserRating: async (bookId: string): Promise<GetUserRatingResponse> => {
    const response = await api.get<GetUserRatingResponse>(`/v1/rating/${bookId}`);
    return response.data;
  },
};

export default ratingService;
