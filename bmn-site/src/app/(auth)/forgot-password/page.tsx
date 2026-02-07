'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getFriendlyAuthError } from '@/lib/auth-errors';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<{message: string, solution?: string} | null>(null);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/profile/reset-password`,
      });

      if (supabaseError) throw supabaseError;
      setSuccess(true);
    } catch (err: unknown) {
      setError(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-display text-text-primary">Reset Password</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {success ? (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Check your email</h2>
            <p className="mt-2 text-text-secondary text-sm leading-relaxed">
              We&apos;ve sent a password reset link to <br />
              <span className="font-semibold text-text-primary">{email}</span>
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left">
            <p className="text-xs text-text-secondary leading-relaxed">
              Didn&apos;t receive the email? Check your spam folder or wait a few minutes. 
              The link will expire in 1 hour.
            </p>
          </div>
          <Link
            href="/login"
            className="block w-full btn-primary py-2.5 text-sm font-bold"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-bmn-border pl-10 px-4 py-2 text-text-primary placeholder:text-text-secondary focus:border-bmn-blue focus:outline-none focus:ring-2 focus:ring-bmn-blue sm:text-sm transition-shadow"
                placeholder="you@company.com"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 mb-6 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1 text-left">
                <p className="text-sm font-semibold text-red-800">{error.message}</p>
                {error.solution && (
                  <p className="text-xs text-red-700 leading-relaxed font-medium">
                    {error.solution}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <div className="text-center mt-6 pt-6 border-t border-gray-100">
        <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-gradient-primary hover:underline hover:decoration-bmn-blue transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>
      </div>
    </>
  );
}
