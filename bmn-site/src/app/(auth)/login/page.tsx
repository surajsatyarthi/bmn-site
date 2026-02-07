'use client'



import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { getFriendlyAuthError } from '@/lib/auth-errors'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<{message: string, solution?: string} | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to onboarding on successful login
      // (The onboarding page will redirect to dashboard if already completed)
      router.push('/onboarding')
      router.refresh()
    } catch (err: unknown) {
      setError(getFriendlyAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Welcome Back
        </h1>
        <p className="text-text-secondary text-sm mt-2">
           Enter your credentials to access your account
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-4 mb-6 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-red-800">{error.message}</p>
            {error.solution && (
              <p className="text-xs text-red-700 leading-relaxed font-medium">
                {error.solution}
              </p>
            )}
          </div>
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
            className="w-full px-4 py-2 border border-bmn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:ring-offset-2 text-sm text-text-primary placeholder:text-text-secondary transition-shadow"
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>

        <div>
           <div className="flex items-center justify-between mb-2">
             <label htmlFor="password" className="block text-sm font-semibold text-text-primary">
               Password
             </label>
             <Link href="/forgot-password" className="text-xs text-gradient-primary hover:underline hover:decoration-bmn-blue font-medium">
               Forgot password?
             </Link>
           </div>
           <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-bmn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:ring-offset-2 text-sm text-text-primary placeholder:text-text-secondary transition-shadow pr-10"
              placeholder="Enter your password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-text-secondary hover:text-text-primary focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-gradient-primary font-bold hover:underline hover:decoration-bmn-blue">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  )
}
