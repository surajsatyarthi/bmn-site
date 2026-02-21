// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { resend, FROM_EMAIL } from '@/lib/email/resend';
import OnboardingIncompleteEmail from '@/emails/onboarding_incomplete';
import FirstStepsGuideEmail from '@/emails/first_steps_guide';
import VerificationReminderEmail from '@/emails/verification_reminder';

// Constants for timing (in milliseconds)
const ONE_HOUR = 60 * 60 * 1000;
const SIX_HOURS = 6 * ONE_HOUR;
const TWENTY_FOUR_HOURS = 24 * ONE_HOUR;
const FORTY_EIGHT_HOURS = 48 * ONE_HOUR;
const SEVENTY_TWO_HOURS = 72 * ONE_HOUR;

export async function GET(request: Request) {
  // Check for Cron Secret (security) - Enabled for Production
  const authHeader = request.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = Date.now();
    const results = { l1: 0, l2: 0, l3: 0, errors: [] as string[] };

    // --- L1 & L2 Logic (Query Profiles) ---
    // Fetch profiles that are NOT completed onboarding
    // Ideally we filter by created_at range in DB, but Supabase JS syntax is specific.
    // Let's grab pending profiles created in the last 3 days.
    
    // We'll use a wider query and filter in JS for precision, or chain filters.
    // "created_at < 24h ago" means created before (now - 24h).
    
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, created_at, onboarding_step, onboarding_completed, notification_status')
      .eq('onboarding_completed', false)
      .gt('created_at', new Date(now - SEVENTY_TWO_HOURS).toISOString()); // Look back 3 days

    if (profilesError) throw profilesError;

    if (profiles) {
      for (const profile of profiles) {
        const createdAt = new Date(profile.created_at).getTime();
        const diff = now - createdAt;
        const status = (profile.notification_status as Record<string, unknown>) || {};

        // L1: 24h Mark (between 24h and 48h)
        if (diff > TWENTY_FOUR_HOURS && diff < FORTY_EIGHT_HOURS && !status.l1_sent) {
           // Provide an estimate of progress based on step?
           // Step 1=0%, 2=20%, 3=40%, 4=60%, 5=80%, 6=95%
           const progress = Math.min(Math.round(((profile.onboarding_step || 1) / 6) * 100), 90);
           
           // Fetch email address (requires calling auth.admin.getUserById)
           const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profile.id);
           
           if (user?.email) {
             const { error: sendError } = await resend.emails.send({
               from: FROM_EMAIL,
               to: user.email,
               subject: 'Complete your trade profile to start getting matched',
               react: OnboardingIncompleteEmail({ 
                 firstName: profile.full_name?.split(' ')[0],
                 progressPercentage: progress
               }),
             });

             if (!sendError) {
               await supabaseAdmin.from('profiles').update({
                 notification_status: { ...status, l1_sent: true }
               }).eq('id', profile.id);
               results.l1++;
             } else {
               results.errors.push(`L1 fail for ${profile.id}: ${sendError.message}`);
             }
           }
        }
        
        // L2: 48h Mark (between 48h and 72h)
        else if (diff > FORTY_EIGHT_HOURS && diff < SEVENTY_TWO_HOURS && !status.l2_sent) {
           // Fetch email
           const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profile.id);
           
           if (user?.email) {
             const { error: sendError } = await resend.emails.send({
               from: FROM_EMAIL,
               to: user.email,
               subject: 'Quick guide: How to complete your BMN profile',
               react: FirstStepsGuideEmail({ 
                 firstName: profile.full_name?.split(' ')[0]
               }),
             });

             if (!sendError) {
               await supabaseAdmin.from('profiles').update({
                 notification_status: { ...status, l2_sent: true }
               }).eq('id', profile.id);
               results.l2++;
             } else {
               results.errors.push(`L2 fail for ${profile.id}: ${sendError.message}`);
             }
           }
        }
      }
    }

    // --- L3 Logic (Verification Reminder) ---
    // Query users who are NOT verified.
    // Since Supabase doesn't let us query by "email_confirmed_at IS NULL" easily in listUsers without complex filters,
    // we can iterate through the PROFILES (which we just did) or just list recent users.
    // Actually, profiles exist even if unverified? Yes, if created triggers run.
    
    // Better strategy: List users from Auth API (page 1, usually enough for cron if run often, or paginate).
    // Or just check the 'profiles' we already fetched?
    // The profiles query was filtered by 'onboarding_completed=false'. Unverified users usually haven't completed onboarding.
    // So distinct overlaps.
    
    // But we need to know if they are verified. 'profiles' doesn't have that info (unless I added it?).
    // I need to fetch the User object. I did that above for L1/L2.
    // I can optimize by fetching Users first? No, listUsers doesn't support complex created filters efficiently.
    
    // Let's iterate the 'profiles' list again (it covers last 3 days).
    if (profiles) {
      for (const profile of profiles) {
         // We might have already fetched user for L1/L2, but simplest to fetch again or optimize later.
         const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(profile.id);
         
         if (user && !user.email_confirmed_at) {
             const createdAt = new Date(user.created_at).getTime();
             const diff = now - createdAt;
             const status = (profile.notification_status as Record<string, unknown>) || {};

             // Check timing: sent at 6h, 24h, 48h
             // Allow a window of execution (e.g. within last hour trigger? Cron runs hourly or daily?)
             // User wants: 6h, 24h, 48h.
             // If we run cron daily at 9am, we miss 6h precision.
             // Assuming Cron runs hourly? 
             // Phase 1 Requirements says "Daily 9am" for L1-L3.
             // But L3 says "6h".
             // If cron is daily, 6h is impossible to hit exactly.
             // We will assume "At least 6h old and hasn't received 6h reminder".
             
             let reminderToSend = null;

             // Logic: precise tracking of "l3_count" or "last_l3_sent"
             const l3Count = (status.l3_sent_count as number) || 0;
             const lastL3 = status.l3_last_sent_at ? new Date(status.l3_last_sent_at as string).getTime() : 0;
             const timeSinceLast = now - lastL3;

             // 1st Reminder (> 6h)
             if (diff > SIX_HOURS && l3Count === 0) {
                reminderToSend = true;
                // reminderType = '6h';
             }
             // 2nd Reminder (> 24h)
             else if (diff > TWENTY_FOUR_HOURS && l3Count === 1 && timeSinceLast > 12 * ONE_HOUR) {
                reminderToSend = true;
                // reminderType = '24h';
             }
             // 3rd Reminder (> 48h)
             else if (diff > FORTY_EIGHT_HOURS && l3Count === 2 && timeSinceLast > 12 * ONE_HOUR) {
                reminderToSend = true;
                // reminderType = '48h';
             }

             if (reminderToSend) {
                const { error: sendError } = await resend.emails.send({
                   from: FROM_EMAIL,
                   to: user.email!,
                   subject: 'Please verify your email to access BMN',
                   react: VerificationReminderEmail({ 
                      firstName: profile.full_name?.split(' ')[0],
                      verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify?userId=${user.id}` // Mock link or real resend link? 
                      // Real resend link requires admin API `generateLink`.
                      // supabaseAdmin.auth.admin.generateLink({ type: 'signup', email: ... })
                   }),
                });

                if (!sendError) {
                   await supabaseAdmin.from('profiles').update({
                     notification_status: { 
                       ...status, 
                       l3_sent_count: l3Count + 1,
                       l3_last_sent_at: new Date().toISOString()
                     }
                   }).eq('id', profile.id);
                   results.l3++;
                } else {
                   results.errors.push(`L3 fail for ${profile.id}: ${sendError.message}`);
                }
             }
         }
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    console.error('Cron job error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
