import mongoose, { Schema } from 'mongoose';

const notifyRequestSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  },
  { timestamps: true }
);

notifyRequestSchema.index({ user: 1, book: 1 }, { unique: true });

export default mongoose.model('NotifyRequest', notifyRequestSchema);
