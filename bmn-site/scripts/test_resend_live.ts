
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey || apiKey.startsWith('re_mock_')) {
  console.error('❌ ERROR: RESEND_API_KEY is missing or in Mock Mode.');
  console.error('Please add a real API key to .env.local to test live sending.');
  process.exit(1);
}

const resend = new Resend(apiKey);

async function testLiveEmail() {
  console.log('📧 Sending Test Email via Resend...');
  
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev', // Default testing domain
    to: 'businessmarketnetwork1@gmail.com', // Verified account email
    subject: '[BMN] Production Integration Test ✅',
    html: '<strong>Success!</strong><br/>BMN is now connected to Resend and ready to send emails.',
  });

  if (error) {
    console.error('❌ Test Failed:', error);
    process.exit(1);
  }

  console.log('✅ Email Sent Successfully!');
  console.log('ID:', data?.id);
}

testLiveEmail();
