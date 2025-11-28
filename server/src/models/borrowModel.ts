import mongoose, { Schema } from 'mongoose';
import { IBorrow } from '../types';

const borrowSchema = new Schema<IBorrow>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowedDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  fine: { type: Number, default: 0 },
  notified: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'borrowed', 'returned', 'overdue'],
    default: 'pending',
  },
});

const Borrow = mongoose.model<IBorrow>('Borrow', borrowSchema);

export default Borrow;

