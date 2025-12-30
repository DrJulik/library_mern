import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <Layout>
      <div className="h-full flex items-center justify-center py-6 px-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-8">
              <h1 className="text-3xl font-bold text-library-900">Log In</h1>
              <button 
                type="button"
                className="w-6 h-6 rounded-full bg-library-600 text-white text-sm flex items-center justify-center hover:bg-library-700 transition-colors"
                title="Login help"
              >
                ?
              </button>
            </div>

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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-library-600 focus:ring-2 focus:ring-library-600/20 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-24 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-library-600 focus:ring-2 focus:ring-library-600/20 transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-library-600 hover:text-library-700 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div>
                <Link 
                  to="/forgot-password" 
                  className="text-library-600 hover:text-library-700 text-sm font-medium hover:underline transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-library-600 border-gray-300 rounded focus:ring-library-600 cursor-pointer"
                />
                <label 
                  htmlFor="rememberMe" 
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  Remember me on this device
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  type="submit"
                  loading={isLoading}
                  className="px-8"
                >
                  Log In
                </Button>
                <Link 
                  to="/register"
                  className="text-library-600 hover:text-library-700 font-medium hover:underline transition-colors"
                >
                  Create an Account
                </Link>
              </div>
            </form>
          </div>

          {/* Welcome Panel */}
          <div className="bg-gradient-to-br from-library-700 via-library-800 to-library-900 rounded-2xl shadow-xl p-8 lg:p-10 text-white order-1 lg:order-2">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Your Library!
            </h2>
            <p className="text-library-100 mb-6 text-lg">
              Here's what you can do...
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-library-accent mt-2 flex-shrink-0"></div>
                <span className="text-gray-100">
                  Find what you want with a better search experience.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-library-accent mt-2 flex-shrink-0"></div>
                <span className="text-gray-100">
                  Track your borrowing history and due dates.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-library-accent mt-2 flex-shrink-0"></div>
                <span className="text-gray-100">
                  Rate and review titles you borrow, and share your opinions.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-library-accent mt-2 flex-shrink-0"></div>
                <span className="text-gray-100">
                  Get personalized recommendations based on your interests.
                </span>
              </li>
            </ul>

            <div className="mt-10 pt-8 border-t border-white/20">
              <h3 className="text-lg font-semibold mb-2">Trouble logging in?</h3>
              <Link 
                to="/forgot-password"
                className="text-library-accent hover:text-orange-400 font-medium hover:underline transition-colors"
              >
                Click here for help.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
