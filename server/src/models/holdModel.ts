import mongoose, { Schema } from 'mongoose';
import { IHold } from '../types';

const holdSchema = new Schema<IHold>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IHold>('Hold', holdSchema);
