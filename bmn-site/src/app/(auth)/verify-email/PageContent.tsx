'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Mail, RefreshCw, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getFriendlyAuthError } from '@/lib/auth-errors';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string, solution?: string} | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get email from sessionStorage (set during signup) or from current user
    const loadEmail = async () => {
      // First try sessionStorage (most reliable after signup redirect)
      const storedEmail = sessionStorage.getItem('signup_email');
      if (storedEmail) {
        setEmail(storedEmail);
        return;
      }

      // Otherwise try to get from current user (if they're logged in)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email ?? null);
        // Only redirect if email is already confirmed
        if (user.email_confirmed_at) {
          router.push('/onboarding');
        }
      }
    };
    
    loadEmail();
  }, [supabase, router]);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: supabaseError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (supabaseError) {
        setError(getFriendlyAuthError(supabaseError));
      } else {
        setSuccess('Verification email resent! Check your inbox.');
      }
    } catch (err: unknown) {
      // This catch block handles unexpected exceptions during the resend process,
      // though Supabase client typically returns errors in the 'error' object.
      setError(getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-blue-50 p-4">
            <Mail className="h-10 w-10 icon-gradient-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold font-display text-text-primary">Check your email</h2>
        <p className="mt-2 text-text-secondary">
          We&apos;ve sent a verification link to <br />
          <span className="font-semibold text-text-primary">{email || 'your email'}</span>
        </p>
      </div>
      
      <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100 text-left">
        <h3 className="text-sm font-bold text-amber-900 mb-2">Can&apos;t find the email?</h3>
        <ul className="text-xs text-amber-800 space-y-2 list-disc list-inside">
          <li>Check your <strong>Spam</strong> or <strong>Promotions</strong> folder.</li>
          <li>Wait <strong>up to 4 minutes</strong> (sometimes arrival is delayed).</li>
          <li>Ensure the email address above is correct.</li>
          <li>If you still don&apos;t see it, try resending below.</li>
        </ul>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleResend}
          disabled={loading || !email}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
          {loading ? 'Sending...' : 'Resend Verification Email'}
        </button>

        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-left">
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

      {success && (
        <div className="mt-4 bg-green-50 border border-green-100 p-4 rounded-xl flex items-start gap-3 text-left">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-green-800">{success}</p>
        </div>
      )}
    </>
  );
}
