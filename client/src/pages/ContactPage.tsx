import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import { useUIStore } from '@/store/useUIStore';

export default function ContactPage() {
  const addToast = useUIStore((s) => s.addToast);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submit – in production you'd POST to an API
    await new Promise((r) => setTimeout(r, 500));
    addToast({ type: 'success', message: "Thank you for your message. We'll get back to you soon." });
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Link to="/" className="text-library-600 hover:underline text-sm mb-6 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-8">
          Have a question, suggestion, or need help? Send us a message.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-library-500 focus:border-library-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-library-500 focus:border-library-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-library-500 focus:border-library-500"
              placeholder="What is this regarding?"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-library-500 focus:border-library-500 resize-y min-h-[120px]"
              placeholder="Your message..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-library-600 text-white font-medium rounded-lg hover:bg-library-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-gray-200 flex gap-4 text-sm">
          <Link to="/privacy" className="text-library-600 hover:underline">Privacy Statement</Link>
          <Link to="/terms" className="text-library-600 hover:underline">Terms of Use</Link>
        </div>
      </div>
    </Layout>
  );
}
