import mongoose, { Schema } from 'mongoose';

const readingListSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  },
  { timestamps: true }
);

readingListSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model('ReadingList', readingListSchema);
