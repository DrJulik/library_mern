import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import Button from '@/components/ui/Button';
import authService from '@/services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="h-full flex items-center justify-center py-6 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-library-600 to-library-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-library-900">Forgot Password?</h1>
              <p className="text-gray-500 mt-2">
                No worries! Enter your email and we'll send you reset instructions.
              </p>
            </div>

            {success ? (
              /* Success State */
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h2>
                <p className="text-gray-500 mb-6">
                  We've sent a password reset link to <strong className="text-gray-700">{email}</strong>
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button 
                    onClick={() => setSuccess(false)}
                    className="text-library-600 hover:underline font-medium"
                  >
                    try again
                  </button>
                </p>
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email Address:
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-library-600 focus:ring-2 focus:ring-library-600/20 transition-all"
                      placeholder="Enter your email address"
                      required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full"
                >
                  Send Reset Link
                </Button>

                {/* Back to Login */}
                <div className="text-center">
                  <Link 
                    to="/login"
                    className="text-sm text-library-600 hover:text-library-700 font-medium hover:underline transition-colors inline-flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-library-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
