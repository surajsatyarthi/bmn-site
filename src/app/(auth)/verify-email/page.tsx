'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? null);
        if (user.email_confirmed_at) {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    };
    getUser();
  }, [supabase, router]);

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Verification email resent! Check your inbox.');
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bmn-light-bg px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-bmn-border text-center">
        <div className="flex justify-center">
          <div className="rounded-full bg-blue-50 p-4">
            <Mail className="h-10 w-10 icon-gradient-primary" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold font-display text-text-primary">Check your email</h2>
          <p className="mt-2 text-text-secondary">
            We&apos;ve sent a verification link to <br />
            <span className="font-semibold text-text-primary">{email || 'your email'}</span>
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleResend}
            disabled={loading || !email}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
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

        {message && (
          <div className={`mt-4 rounded-lg p-3 text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
