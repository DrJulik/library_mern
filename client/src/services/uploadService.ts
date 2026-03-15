import api from './api';

interface UploadResponse {
  success: boolean;
  url: string;
  publicId?: string;
}

const uploadService = {
  uploadBookImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadResponse>('/v1/upload/book-image', formData);

    if (!response.data.success || !response.data.url) {
      throw new Error('Upload failed');
    }

    return response.data.url;
  },
};

export default uploadService;
