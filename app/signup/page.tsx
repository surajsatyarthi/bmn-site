'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
          }
        }
      })

      if (error) throw error

      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bmn-light-bg px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white border border-bmn-border rounded-lg p-8 shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold uppercase text-bmn-blue mb-2">
              Account Created!
            </h2>
            <p className="text-text-muted mb-4">
              Please check your email to verify your account.
            </p>
            <p className="text-sm text-text-muted">
              Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bmn-light-bg px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mr-3">
              <path d="M2.5 13.5L8.5 4L13.5 11.5L21.5 2" stroke="#2046f5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-3xl font-extrabold text-bmn-blue">BMN</span>
          </div>
          <p className="text-xs uppercase tracking-widest text-text-muted">Business Market Network</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white border border-bmn-border rounded-lg p-8 shadow-sm">
          <div className="mb-6">
            <div className="inline-block bg-bmn-blue text-white px-3 py-1 text-xs font-bold uppercase rounded mb-4">
              Create Account
            </div>
            <h1 className="font-display text-2xl font-bold uppercase text-bmn-blue">
              Join BMN Today
            </h1>
            <p className="text-sm text-text-muted mt-2">
              Connect with global businesses across 200+ countries
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p className="text-sm font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold uppercase text-text-muted tracking-wide mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-bmn-border rounded-md focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:border-transparent text-sm"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="companyName" className="block text-xs font-bold uppercase text-text-muted tracking-wide mb-2">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-bmn-border rounded-md focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:border-transparent text-sm"
                placeholder="Your Company Ltd."
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase text-text-muted tracking-wide mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-bmn-border rounded-md focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:border-transparent text-sm"
                placeholder="you@company.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase text-text-muted tracking-wide mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-bmn-border rounded-md focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:border-transparent text-sm"
                placeholder="Minimum 6 characters"
                disabled={loading}
              />
              <p className="text-xs text-text-muted mt-1">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bmn-blue text-white py-3 px-6 rounded-md font-bold text-sm uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-bmn-blue font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          © 2026 Business Market Network. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}
