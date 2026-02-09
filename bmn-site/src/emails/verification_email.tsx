
import { Text, Button, Section } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import React from 'react';

interface VerificationEmailProps {
  firstName?: string;
  verificationUrl?: string;
}

export const VerificationEmail = ({ firstName = 'Trader', verificationUrl = '{{ .ConfirmationURL }}' }: VerificationEmailProps) => {
  return (
    <EmailLayout preview="Verify your BMN account">
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151' }}>
        Hi {firstName},
      </Text>
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '16px 0' }}>
        Welcome to Business Market Network! We're excited to help you connect with verified trade partners worldwide.
      </Text>
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '0 0 24px' }}>
        To complete your registration and access your account, please verify your email address:
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

      <Text style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px', textAlign: 'center' }}>
        For security purposes, this link expires in 24 hours. If you did not sign up for Business Market Network, please ignore this email or contact <a href="mailto:support@businessmarket.network" style={{ color: '#2563eb' }}>support@businessmarket.network</a>
      </Text>

      <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '24px 0 16px' }}>
        Why we require verification:
      </Text>
      <ul style={{ paddingLeft: '20px', margin: '8px 0 24px', color: '#374151' }}>
        <li style={{ marginBottom: '8px' }}>Ensures platform security and prevents spam</li>
        <li style={{ marginBottom: '8px' }}>Verifies you're a legitimate business</li>
        <li style={{ marginBottom: '8px' }}>Protects all our members from fraudulent accounts</li>
      </ul>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151' }}>
        Having trouble? Reply to this email or contact our support team.
      </Text>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '24px 0 0' }}>
        Best regards,
        <br />
        The BMN Team
      </Text>
    </EmailLayout>
  );
};

export default VerificationEmail;
