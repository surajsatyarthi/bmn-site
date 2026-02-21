import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { resend, FROM_EMAIL } from '@/lib/email/resend';
import WelcomeEmail from '@/emails/welcome_onboarding';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(`${origin}/login?error=${error.message}`);
    }

    if (session?.user) {
      try {
        // T1: Check if we should send Welcome Email
        // We use a safe check to avoid blocking the user flow
        const userId = session.user.id;
        
        // Fetch profile to check notification status
        // Note: Using Drizzle here, or could use Supabase client if prefer
        // Let's use Supabase client for consistency with Auth flow usually, 
        // but Drizzle is already set up and likely more typed access.
        // However, I need to know where 'db' is exported. 
        // I will assume '@/lib/db' exports 'db'. If not I will check.
        
        // Fallback to Supabase for now to avoid import errors if db setup is unknown
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, notification_status')
          .eq('id', userId)
          .single();

        const notifStatus = (profile?.notification_status as Record<string, unknown>) || {};

        if (!notifStatus.welcome_sent) {
          // Send Welcome Email
          const { error: emailError } = await resend.emails.send({
            from: FROM_EMAIL,
            to: session.user.email!,
            subject: "Welcome to Business Market Network – Let's Find Your Buyers",
            react: WelcomeEmail({ firstName: profile?.full_name?.split(' ')[0] || 'Trader' }),
          });

          if (!emailError) {
             // Update profile
             await supabase
               .from('profiles')
               .update({ 
                 notification_status: { ...notifStatus, welcome_sent: true } 
               })
               .eq('id', userId);
          } else {
             console.error('Failed to send welcome email:', emailError);
          }
        }
      } catch (err) {
        console.error('Error in welcome email logic:', err);
        // Don't block redirect
      }
    }
  }

  // Redirect to onboarding after successful OAuth/Verification
  return NextResponse.redirect(`${origin}/onboarding`);
}
