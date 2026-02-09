// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Resend Webhook Events we care about
type ResendWebhookEvent = 
  | 'email.sent'
  | 'email.delivered'
  | 'email.bounced'
  | 'email.failed'
  | 'email.complained'
  | 'email.suppressed'
  | 'email.delivery_delayed';

interface ResendWebhookPayload {
  type: ResendWebhookEvent;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
    // Bounce/Failure specific
    bounce_type?: 'hard' | 'soft';
    error_message?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Implement signature verification for production
    // const signature = request.headers.get('svix-signature');
    
    const payload: ResendWebhookPayload = await request.json();
    
    console.log(`[Resend Webhook] ${payload.type}:`, payload.data.email_id);

    // Store webhook event in database
    const { error: logError } = await supabaseAdmin
      .from('email_logs')
      .insert({
        email_id: payload.data.email_id,
        event_type: payload.type,
        recipient: payload.data.to[0],
        subject: payload.data.subject,
        from_address: payload.data.from,
        bounce_type: payload.data.bounce_type,
        error_message: payload.data.error_message,
        created_at: payload.created_at,
      });

    if (logError) {
      console.error('[Resend Webhook] Failed to log event:', logError);
    }

    // Handle critical events
    switch (payload.type) {
      case 'email.bounced':
      case 'email.failed':
        // Alert admin or mark user email as invalid
        console.error(`[ALERT] Email ${payload.type} for ${payload.data.to[0]}`);
        
        // Lookup user ID by email (profiles.id is UUID, payload.data.to[0] is email string)
        const { data: bouncedUser } = await supabaseAdmin.auth.admin.listUsers();
        const targetBouncedUser = bouncedUser?.users.find(u => u.email === payload.data.to[0]);
        
        if (targetBouncedUser) {
          await supabaseAdmin
            .from('profiles')
            .update({ 
              email_deliverable: false,
              last_email_error: payload.data.error_message || 'Bounce/Failure'
            })
            .eq('id', targetBouncedUser.id); // ✅ UUID to UUID match
        } else {
          console.warn(`[Resend Webhook] User not found for email: ${payload.data.to[0]}`);
        }
        break;

      case 'email.complained':
        // User marked as spam - stop sending emails
        console.error(`[ALERT] Spam complaint from ${payload.data.to[0]}`);
        
        // Lookup user ID by email
        const { data: complainedUser } = await supabaseAdmin.auth.admin.listUsers();
        const targetComplainedUser = complainedUser?.users.find(u => u.email === payload.data.to[0]);
        
        if (targetComplainedUser) {
          await supabaseAdmin
            .from('profiles')
            .update({ 
              email_notifications_enabled: false,
              last_email_error: 'Spam complaint'
            })
            .eq('id', targetComplainedUser.id); // ✅ UUID to UUID match
        } else {
          console.warn(`[Resend Webhook] User not found for email: ${payload.data.to[0]}`);
        }
        break;

      case 'email.delivered':
        // Success - update delivery stats
        console.log(`✅ Email delivered to ${payload.data.to[0]}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Resend Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
