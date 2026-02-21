
import { Text, Button, Section } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import React from 'react';

interface VerificationReminderEmailProps {
  firstName?: string;
  verificationUrl?: string;
}

export const VerificationReminderEmail = ({ firstName = 'Trader', verificationUrl = '{{ .ConfirmationURL }}' }: VerificationReminderEmailProps) => {
  return (
    <EmailLayout preview="Please verify your email to access BMN">
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151' }}>
        Hi {firstName},
      </Text>
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '16px 0 24px' }}>
        You&apos;re almost there! We&apos;re still waiting for you to verify your email address.
      </Text>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button
          href={verificationUrl}
          style={{
            backgroundColor: '#2563eb',
            borderRadius: '6px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 'bold',
            textDecoration: 'none',
            textAlign: 'center',
            display: 'inline-block',
            padding: '12px 24px',
          }}
        >
          Verify Email Address
        </Button>
      </Section>

      <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '24px 0 16px' }}>
        Once verified, you&apos;ll be able to:
      </Text>
      <ul style={{ paddingLeft: '20px', margin: '8px 0 24px', color: '#374151' }}>
        <li style={{ marginBottom: '8px' }}>Complete your trade profile</li>
        <li style={{ marginBottom: '8px' }}>Access AI-powered matching</li>
        <li style={{ marginBottom: '8px' }}>Connect with verified exporters and importers</li>
        <li style={{ marginBottom: '8px' }}>Launch outreach campaigns</li>
      </ul>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '0 0 24px' }}>
        The verification link expires soon, so please verify now.
      </Text>

      <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '24px 0 8px' }}>
        Didn&apos;t receive the original email?
      </Text>
      <ul style={{ paddingLeft: '20px', margin: '8px 0 24px', color: '#374151' }}>
        <li style={{ marginBottom: '8px' }}>Check your spam/junk folder</li>
        <li style={{ marginBottom: '8px' }}>Add <a href="mailto:noreply@businessmarket.network" style={{ color: '#2563eb' }}>noreply@businessmarket.network</a> to your contacts</li>
        <li style={{ marginBottom: '8px' }}>Reply to this email for a new verification link</li>
      </ul>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151' }}>
        We&apos;re here to help: <a href="mailto:support@businessmarket.network" style={{ color: '#2563eb' }}>support@businessmarket.network</a>
      </Text>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '24px 0 0' }}>
        Best regards,
        <br />
        The BMN Team
      </Text>
    </EmailLayout>
  );
};

export default VerificationReminderEmail;
