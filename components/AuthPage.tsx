'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface AuthPageProps {
  defaultMode?: 'signin' | 'signup';
}

export default function AuthPage({ defaultMode = 'signin' }: AuthPageProps) {
  const [isSignIn, setIsSignIn] = useState(defaultMode === 'signin');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToMarketing: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: formData.name,
            marketing_consent: formData.agreeToMarketing,
          },
        },
      });

      if (error) throw error;

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        // Redirect to success page
        window.location.href = '/signup-success';
      } else if (data.session) {
        await supabase.auth.getSession();
        window.location.replace('/dashboard');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      await supabase.auth.getSession(); // ensure session is written
      window.location.replace('/dashboard');

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred with Google sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
          Join Woohl. Grow With Us
        </h1>

        {/* Toggle between Sign In and New User */}
        <div className="flex justify-center gap-8 mb-8">
          <button
            onClick={() => setIsSignIn(true)}
            className={`text-lg font-medium pb-2 transition-colors ${isSignIn
                ? 'text-gray-900 border-b-2 border-orange-500'
                : 'text-gray-400'
              }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`text-lg font-medium pb-2 transition-colors ${!isSignIn
                ? 'text-gray-900 border-b-2 border-orange-500'
                : 'text-gray-400'
              }`}
          >
            I&apos;M NEW USER
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={isSignIn ? handleEmailSignIn : handleEmailSignUp}>
          {/* Name Field - Only for New Users */}
          {!isSignIn && (
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 text-base mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-base mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="block text-gray-700 text-base mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Forgot Password - Only for Sign In */}
          {isSignIn && (
            <div className="mb-6">
              <a
                href="/forgot-password"
                className="text-orange-500 hover:text-orange-600 text-sm hover:underline"
              >
                Forgot your Password ?
              </a>
            </div>
          )}

          {/* Terms and Marketing Consent - Only for New Users */}
          {!isSignIn && (
            <>
              <p className="text-sm text-gray-600 mb-4 mt-6">
                By registering, you agree to our Terms & Conditions, Privacy and Cookie
                Policy and to join our loyalty programme
              </p>

              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToMarketing"
                    checked={formData.agreeToMarketing}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-gray-700 text-sm">
                    Sign up, & never miss out on exclusive member rewards tailored new
                    arrivals & new launches.
                  </span>
                </label>
              </div>
            </>
          )}

          {/* Sign In / Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {loading ? 'Processing...' : isSignIn ? 'Sign in' : 'Register'}
          </button>

          {/* Switch between Sign In and Register */}
          {isSignIn ? (
            <p className="text-center text-gray-600 text-sm mb-6">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignIn(false)}
                className="text-orange-500 hover:text-orange-600 font-medium hover:underline"
              >
                Create one
              </button>
            </p>
          ) : (
            <p className="text-center text-gray-600 text-sm mb-6">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignIn(true)}
                className="text-orange-500 hover:text-orange-600 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          )}

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}