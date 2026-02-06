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
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!termsAccepted) {
      setError('You must accept the Terms of Service to continue.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            // company_name removed - moves to onboarding
          }
        }
      })

      if (error) throw error
      
      // Redirect to verify email page immediately
      router.push('/verify-email')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during signup'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Create Account
        </h1>
        <p className="text-text-secondary text-sm mt-2">
           Start connecting with global trade partners today
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded text-sm">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-text-primary mb-1.5">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-bmn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:border-transparent transition-shadow text-sm text-text-primary placeholder:text-gray-400"
            placeholder="John Doe"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-bmn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:border-transparent transition-shadow text-sm text-text-primary placeholder:text-gray-400"
            placeholder="you@company.com"
            disabled={loading}
          />
        </div>

        <div>
           <label htmlFor="password" className="block text-sm font-semibold text-text-primary mb-1.5">
             Password
           </label>
           <input
             id="password"
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             minLength={6}
             className="w-full px-4 py-2 border border-bmn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:border-transparent transition-shadow text-sm text-text-primary placeholder:text-gray-400"
             placeholder="Min. 6 characters"
             disabled={loading}
           />
        </div>

        <div className="flex items-start pt-2">
           <div className="flex items-center h-5">
             <input
               id="terms"
               name="terms"
               type="checkbox"
               checked={termsAccepted}
               onChange={(e) => setTermsAccepted(e.target.checked)}
               required
               className="h-4 w-4 icon-gradient-primary border-bmn-border rounded focus:ring-bmn-blue cursor-pointer"
             />
           </div>
           <div className="ml-3 text-sm leading-snug">
             <label htmlFor="terms" className="text-text-secondary">
               I agree to the <Link href="/terms" className="text-gradient-primary font-medium hover:underline hover:decoration-bmn-blue">Terms</Link> and <Link href="/privacy" className="text-gradient-primary font-medium hover:underline hover:decoration-bmn-blue">Privacy Policy</Link>
             </label>
           </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center border-t border-gray-100 pt-6">
        <p className="text-sm text-text-secondary">
          Already have an account?{' '}
          <Link href="/login" className="text-gradient-primary font-bold hover:underline hover:decoration-bmn-blue">
            Sign In
          </Link>
        </p>
      </div>
    </>
  )
}
