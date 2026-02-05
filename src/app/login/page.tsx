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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to homepage on successful login
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <span className="text-3xl font-display font-bold text-bmn-blue">BMN</span>
          <p className="text-xs uppercase tracking-widest text-text-secondary font-display font-bold mt-2">Business Market Network</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-bmn-border rounded-lg p-8">
          <h1 className="font-display text-2xl font-bold text-text-primary mb-6">
            Welcome Back
          </h1>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <p className="text-sm font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-bmn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:ring-offset-2 text-sm text-text-primary placeholder:text-text-secondary"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text-primary mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-bmn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:ring-offset-2 text-sm text-text-primary placeholder:text-text-secondary"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-bmn-blue font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-text-secondary mt-8">
          © 2026 Business Market Network. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}
