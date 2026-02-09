
import { render } from '@react-email/render';
import VerificationEmail from '../src/emails/verification_email';
import PasswordResetEmail from '../src/emails/password_reset';
import fs from 'fs';
import path from 'path';
import React from 'react';

// Ensure output directory exists
const outDir = path.join(process.cwd(), 'docs', 'email-templates');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function generate() {
  console.log('Generating Verification Email HTML...');
  const verificationHtml = await render(<VerificationEmail verificationUrl="{{ .ConfirmationURL }}" />);
  fs.writeFileSync(path.join(outDir, 'verification_email.html'), verificationHtml);
  console.log('✅ Generated docs/email-templates/verification_email.html');

  console.log('Generating Password Reset Email HTML...');
  const resetHtml = await render(<PasswordResetEmail resetUrl="{{ .ConfirmationURL }}" />);
  fs.writeFileSync(path.join(outDir, 'password_reset.html'), resetHtml);
  console.log('✅ Generated docs/email-templates/password_reset.html');
}

generate().catch(console.error);
