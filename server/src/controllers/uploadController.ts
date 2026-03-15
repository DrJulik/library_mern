import { Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { catchAsyncErrors, ErrorHandler } from '../middlewares/errorMiddleware';
import { AuthRequest } from '../types';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface UploadedFile {
  name: string;
  mimetype: string;
  size: number;
  data?: Buffer;
  tempFilePath?: string;
}

export const uploadBookImage = catchAsyncErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const file = (req as { files?: { image?: UploadedFile } }).files?.image;

    if (!file) {
      return next(new ErrorHandler('No image file provided. Use form field name "image".', 400));
    }

    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return next(new ErrorHandler('Invalid file type. Allowed: JPEG, PNG, WebP, GIF.', 400));
    }

    if (file.size > MAX_FILE_SIZE) {
      return next(new ErrorHandler('File too large. Maximum 5MB.', 400));
    }

    const uploadSource =
      file.tempFilePath ||
      (file.data && Buffer.isBuffer(file.data)
        ? `data:${file.mimetype};base64,${file.data.toString('base64')}`
        : null);

    if (!uploadSource) {
      return next(new ErrorHandler('Could not process uploaded file.', 400));
    }

    let result;
    try {
      result = await cloudinary.uploader.upload(uploadSource, {
        folder: 'library/books',
        resource_type: 'image',
      });
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return next(new ErrorHandler('Failed to upload image. Check Cloudinary configuration.', 500));
    }

    res.status(200).json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  }
);
