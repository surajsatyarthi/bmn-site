
import { Resend } from 'resend';

// Initialize Resend client
// Note: ENV variables must be set in your .env.local
// RESEND_API_KEY=re_xxxxx
// RESEND_FROM_EMAIL=noreply@businessmarket.network

const apiKey = process.env.RESEND_API_KEY;

// Mock Resend Client for development/fallback
class MockResend {
  emails = {
    send: async (payload: { to: string | string[]; subject: string; react?: unknown; [key: string]: unknown }) => {
      console.log('📧 [MOCK EMAIL] Sending to:', payload.to);
      console.log('📧 [MOCK EMAIL] Subject:', payload.subject);
      // console.log('📧 [MOCK EMAIL] HTML:', payload.react); // Too verbose
      return { data: { id: 'mock_id_' + Date.now() }, error: null };
    }
  }
}

let resendClient: Resend | MockResend;

if (apiKey) {
  resendClient = new Resend(apiKey);
} else {
  console.warn('⚠️ RESEND_API_KEY is not set. Using Mock Resend Client (emails will be logged to console).');
  resendClient = new MockResend();
}

export const resend = resendClient;

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@businessmarket.network';
