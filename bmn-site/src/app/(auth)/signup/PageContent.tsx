'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { AuthErrorResponse, getFriendlyAuthError } from '@/lib/auth-errors'


export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<AuthErrorResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (password !== confirmPassword) {
      setError({
        message: 'The passwords you entered do not match.',
        solution: 'Please carefully re-type your password in both fields.',
        supportRecommended: false,
        technical: 'PASS_MISMATCH'
      })
      return
    }

    if (!termsAccepted) {
      setError({
        message: 'You must accept the Terms of Service to continue.',
        solution: 'Please review and check the box below to proceed.',
        supportRecommended: false,
        technical: 'TERMS_NOT_ACCEPTED'
      })
      return
    }
// ... (existing code for submit logic)

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
      
      // Store email in sessionStorage for the verify page help text
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('signup_email', email)
      }
      
      // Redirect to verify email page
      router.push('/verify-email')
      router.refresh()
    } catch (err: unknown) {
      setError(getFriendlyAuthError(err))
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
        <div className="bg-red-50 border border-red-100 p-4 mb-6 rounded-xl flex flex-col gap-4">
          <div className="flex items-start gap-3">
            {/* Icon removed to save space as per user request */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-red-800">{error.message}</p>
              {error.solution && (
                <p className="text-xs text-green-700 leading-relaxed font-semibold">
                  {error.solution}
                </p>
              )}
            </div>
          </div>
          
          {error.technical && (
            <div className="bg-white/50 rounded-lg p-2 border border-orange-100/50">
              <p className="text-[10px] text-orange-600 font-mono break-all line-clamp-2">
                <span className="font-bold mr-1">Error ID:</span> {error.technical}
              </p>
            </div>
          )}

          {error.supportRecommended && (
            <button
              type="button"
              onClick={() => {
                const tawk = (window as unknown as { Tawk_API?: { maximize: () => void } }).Tawk_API;
                if (tawk?.maximize) {
                  tawk.maximize();
                } else {
                  alert('Support chat is loading. Please try again in a second.');
                }
              }}
              className="text-xs font-bold text-green-800 hover:text-green-900 flex items-center gap-1.5 bg-green-100/50 w-fit px-3 py-1.5 rounded-full transition-colors self-end"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Chat with Support
            </button>
          )}


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
           <div className="relative">
             <input
               id="password"
               type={showPassword ? 'text' : 'password'}
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               minLength={6}
               className="w-full px-4 py-2 border border-bmn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:border-transparent transition-shadow text-sm text-text-primary placeholder:text-gray-400 pr-10"
               placeholder="Min. 6 characters"
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

        <div>
           <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text-primary mb-1.5">
             Confirm Password
           </label>
             <div className="relative">
               <input
                 id="confirmPassword"
                 type={showConfirmPassword ? 'text' : 'password'}
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 required
                 minLength={6}
                 className="w-full px-4 py-2 border border-bmn-border rounded-lg focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:border-transparent transition-shadow text-sm text-text-primary placeholder:text-gray-400 pr-10"
                 placeholder="Re-enter your password"
                 disabled={loading}
               />
               <button
                 type="button"
                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                 className="absolute right-3 top-2.5 text-text-secondary hover:text-text-primary focus:outline-none"
                 tabIndex={-1}
               >
                 {showConfirmPassword ? (
                   <EyeOff className="h-4 w-4" />
                 ) : (
                   <Eye className="h-4 w-4" />
                 )}
               </button>
             </div>
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
               className="h-4 w-4 border-bmn-border rounded focus:ring-bmn-blue cursor-pointer" // Removed icon-gradient-primary
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
