'use client'

import { useState, useRef, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const OTP_LENGTH = 8

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill('')
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const emailParam =
      params.get('email') || sessionStorage.getItem('reset_email') || ''
    setEmail(emailParam)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, OTP_LENGTH)

    if (!pasted) return

    const newOtp = [...otp]
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i]
    }

    setOtp(newOtp)
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleVerify = async () => {
    const otpCode = otp.join('')

    if (otpCode.length !== OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits`)
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'recovery',
      })

      if (error) throw error

      window.location.href = '/set-new-password'
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid code. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError('Email not found. Restart the password reset process.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/email-verification?email=${email}`,
      })

      if (error) throw error

      alert('A new verification code has been sent to your email.')
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to resend code'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h1 className="text-orange-500 font-bold text-2xl mb-6">Woohl</h1>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify your email
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          Enter the {OTP_LENGTH}-digit code sent to{' '}
          <span className="font-semibold">
            {email || 'your email'}
          </span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}

              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== OTP_LENGTH}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50 mb-4"
        >
          {loading ? 'Verifying...' : 'Verify code'}
        </button>

        <p className="text-center text-gray-600 text-sm">
          Didn’t receive the code?{' '}
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-orange-500 hover:text-orange-600 font-medium hover:underline disabled:opacity-50"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  )
}
