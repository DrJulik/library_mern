import mongoose, { Schema } from 'mongoose';
import { IBook } from '../types';

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    available: { type: Boolean, default: true },
    genre: { type: String, trim: true },
    language: { type: String, trim: true },
    yearPublished: { type: Number },
    imageLink: { type: String, trim: true },
    isbn: { type: String, trim: true },
    publisher: { type: String, trim: true },
    pages: { type: Number },
    slug: { type: String, trim: true },
    subtitle: { type: String, trim: true },
  },
  { timestamps: true }
);

const Book = mongoose.model<IBook>('Book', bookSchema);

export default Book;

