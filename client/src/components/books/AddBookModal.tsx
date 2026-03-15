import { useState, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { CreateBookData } from '@/types';
import { getApiErrorMessage } from '@/services/api';
import uploadService from '@/services/uploadService';

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

const ACCEPT_IMAGES = 'image/jpeg,image/png,image/webp,image/gif';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function AddBookModal({ isOpen, onClose, onSubmit }: AddBookModalProps) {
  const [form, setForm] = useState<CreateBookData>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!isLoading && !isUploading) {
      setForm(initialForm);
      setError(null);
      onClose();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPT_IMAGES.split(',').includes(file.type)) {
      setError('Please select a JPEG, PNG, WebP, or GIF image.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image must be under 5MB.');
      return;
    }

    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadService.uploadBookImage(file);
      setForm((prev) => ({ ...prev, imageLink: url }));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsUploading(false);
      e.target.value = '';
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
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Cover image
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT_IMAGES}
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-library-500 hover:text-library-600 hover:bg-library-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading…' : 'Upload from device'}
              </button>
              <span className="flex items-center text-sm text-gray-500">or paste URL below</span>
            </div>
            <input
              id="imageLink"
              name="imageLink"
              type="url"
              value={form.imageLink || ''}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://... or upload above"
            />
            {form.imageLink && (
              <div className="mt-2">
                <img
                  src={form.imageLink}
                  alt="Cover preview"
                  className="h-24 object-cover rounded border border-gray-200"
                />
              </div>
            )}
          </div>
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
          <Button type="submit" loading={isLoading} disabled={isLoading || isUploading}>
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
