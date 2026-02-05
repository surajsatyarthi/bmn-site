'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to homepage on successful login
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bmn-light-bg px-4">
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

        {/* Login Card */}
        <div className="bg-white border border-bmn-border rounded-lg p-8 shadow-sm">
          <div className="mb-6">
            <div className="inline-block bg-bmn-blue text-white px-3 py-1 text-xs font-bold uppercase rounded mb-4">
              Sign In
            </div>
            <h1 className="font-display text-2xl font-bold uppercase text-bmn-blue">
              Welcome Back
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p className="text-sm font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder="you@example.com"
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
                className="w-full px-4 py-3 border border-bmn-border rounded-md focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:border-transparent text-sm"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bmn-blue text-white py-3 px-6 rounded-md font-bold text-sm uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Don't have an account?{' '}
              <Link href="/signup" className="text-bmn-blue font-semibold hover:underline">
                Sign Up
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
