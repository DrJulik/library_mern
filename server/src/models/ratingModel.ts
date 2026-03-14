import mongoose, { Schema } from 'mongoose';
import { IRating } from '../types';

const ratingSchema = new Schema<IRating>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

// One rating per user per book
ratingSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model<IRating>('Rating', ratingSchema);
