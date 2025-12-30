import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
    if (passwordError) setPasswordError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      // Navigate to OTP verification page with email
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      // Error is handled by the store
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 1, label: 'Too short' };
    
    let strength = 1;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    return { strength, label: labels[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Layout>
      <div className="h-full flex items-center justify-center py-6 px-4 overflow-auto">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Register Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-8">
              <h1 className="text-3xl font-bold text-library-900">Create Account</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-library-600 focus:ring-2 focus:ring-library-600/20 transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

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
                    placeholder="Minimum 6 characters"
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
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength.strength
                              ? passwordStrength.strength <= 2
                                ? 'bg-red-500'
                                : passwordStrength.strength <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength.strength <= 2
                        ? 'text-red-600'
                        : passwordStrength.strength <= 3
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm Password:
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-24 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                        : formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20'
                        : 'border-gray-200 focus:border-library-600 focus:ring-library-600/20'
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-library-600 hover:text-library-700 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showConfirmPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                    {showConfirmPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-600 text-xs mt-1">Passwords do not match</p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Passwords match
                  </p>
                )}
              </div>

              {/* Error Messages */}
              {(error || passwordError) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error || passwordError}
                </div>
              )}

              {/* Terms Notice */}
              <p className="text-sm text-gray-500">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-library-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-library-600 hover:underline">Privacy Policy</Link>.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  type="submit"
                  loading={isLoading}
                  className="px-8"
                >
                  Create Account
                </Button>
                <Link 
                  to="/login"
                  className="text-library-600 hover:text-library-700 font-medium hover:underline transition-colors"
                >
                  Already have an account?
                </Link>
              </div>
            </form>
          </div>

          {/* Welcome Panel */}
          <div className="bg-gradient-to-br from-library-700 via-library-800 to-library-900 rounded-2xl shadow-xl p-8 lg:p-10 text-white order-1 lg:order-2">
            <h2 className="text-2xl font-bold mb-4">
              Join Our Library Community
            </h2>
            <p className="text-library-100 mb-6 text-lg">
              Create your account and unlock a world of knowledge...
            </p>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-library-accent/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-library-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Access Thousands of Books</h3>
                  <p className="text-gray-300 text-sm">Browse and borrow from our extensive collection.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-library-accent/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-library-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Track Your Reading</h3>
                  <p className="text-gray-300 text-sm">Keep a record of all borrowed books and due dates.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-library-accent/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-library-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Personalized Recommendations</h3>
                  <p className="text-gray-300 text-sm">Get book suggestions based on your interests.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-library-accent/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-library-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Due Date Reminders</h3>
                  <p className="text-gray-300 text-sm">Never miss a return date with our notification system.</p>
                </div>
              </li>
            </ul>

            <div className="mt-10 pt-8 border-t border-white/20">
              <p className="text-gray-300 text-sm">
                Already have an account?{' '}
                <Link 
                  to="/login"
                  className="text-library-accent hover:text-orange-400 font-medium hover:underline transition-colors"
                >
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
