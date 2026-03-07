import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { CreateBookData } from '@/types';
import { getApiErrorMessage } from '@/services/api';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBookData) => Promise<void>;
}

const initialForm: CreateBookData = {
  title: '',
  author: '',
  description: '',
  price: 0,
  quantity: 1,
  genre: '',
  imageLink: '',
  subtitle: '',
};

export default function AddBookModal({ isOpen, onClose, onSubmit }: AddBookModalProps) {
  const [form, setForm] = useState<CreateBookData>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title?.trim() || !form.author?.trim() || !form.description?.trim()) {
      setError('Title, author, and description are required');
      return;
    }
    if (form.price < 0 || form.quantity < 1) {
      setError('Price must be ≥ 0 and quantity must be ≥ 1');
      return;
    }
    setIsLoading(true);
    try {
      const payload: CreateBookData = {
        title: form.title.trim(),
        author: form.author.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        quantity: Math.floor(Number(form.quantity)),
      };
      if (form.genre?.trim()) payload.genre = form.genre.trim();
      if (form.imageLink?.trim()) payload.imageLink = form.imageLink.trim();
      if (form.subtitle?.trim()) payload.subtitle = form.subtitle.trim();
      await onSubmit(payload);
      setForm(initialForm);
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setForm(initialForm);
      setError(null);
      onClose();
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-library-600 focus:ring-2 focus:ring-library-600/20';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Book" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            className={inputClass}
            placeholder="Book title"
            required
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-semibold text-gray-700 mb-1">
            Author <span className="text-red-500">*</span>
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={form.author}
            onChange={handleChange}
            className={inputClass}
            placeholder="Author name"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`${inputClass} min-h-[80px]`}
            placeholder="Brief description"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price || ''}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={form.quantity || ''}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-semibold text-gray-700 mb-1">
            Genre
          </label>
          <input
            id="genre"
            name="genre"
            type="text"
            value={form.genre || ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="e.g. Fiction, Science"
          />
        </div>

        <div>
          <label htmlFor="imageLink" className="block text-sm font-semibold text-gray-700 mb-1">
            Cover image URL
          </label>
          <input
            id="imageLink"
            name="imageLink"
            type="url"
            value={form.imageLink || ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-semibold text-gray-700 mb-1">
            Subtitle
          </label>
          <input
            id="subtitle"
            name="subtitle"
            type="text"
            value={form.subtitle || ''}
            onChange={handleChange}
            className={inputClass}
            placeholder="Optional subtitle"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={isLoading} disabled={isLoading}>
            Add Book
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
