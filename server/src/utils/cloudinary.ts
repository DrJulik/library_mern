import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_CLIENT_SECRET,
});

export { cloudinary };
