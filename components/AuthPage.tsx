'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

interface AuthPageProps {
  defaultMode?: 'signin' | 'signup'
}

export default function AuthPage({ defaultMode = 'signin' }: AuthPageProps) {
  const router = useRouter()

  const [isSignIn, setIsSignIn] = useState(defaultMode === 'signin')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToMarketing: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // ===================== SIGN UP =====================
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

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
      })

      if (error) throw error

      // Email confirmation ON
      if (data.user && !data.session) {
        router.replace('/signup-success')
        return
      }

      // Auto-login case (email confirmation OFF)
      if (data.session) {
        await supabase.auth.getSession() // ensure cookie write
        router.replace('/dashboard')
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Registration failed'
      )
    } finally {
      setLoading(false)
    }
  }

  // ===================== SIGN IN =====================
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      await supabase.auth.getSession() // wait for session persistence
      router.replace('/dashboard')
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Sign in failed'
      )
    } finally {
      setLoading(false)
    }
  }

  // ===================== GOOGLE SIGN IN =====================
  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Google sign-in failed'
      )
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 md:p-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          Join Woohl. Grow With Us
        </h1>

        <div className="flex justify-center gap-8 mb-8">
          <button
            onClick={() => setIsSignIn(true)}
            className={isSignIn ? 'border-b-2 border-orange-500' : ''}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={!isSignIn ? 'border-b-2 border-orange-500' : ''}
          >
            I&apos;M NEW USER
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={isSignIn ? handleEmailSignIn : handleEmailSignUp}>
          {!isSignIn && (
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full mb-4 p-3 border rounded"
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full mb-4 p-3 border rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full mb-4 p-3 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded mb-4"
          >
            {loading ? 'Processing…' : isSignIn ? 'Sign In' : 'Register'}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border py-3 rounded"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  )
}
