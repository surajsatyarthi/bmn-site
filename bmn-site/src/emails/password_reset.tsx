
import { Text, Button, Section } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import React from 'react';

interface PasswordResetEmailProps {
  firstName?: string;
  resetUrl?: string;
}

export const PasswordResetEmail = ({ firstName = 'Trader', resetUrl = '{{ .ConfirmationURL }}' }: PasswordResetEmailProps) => {
  return (
    <EmailLayout preview="Reset your BMN password">
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151' }}>
        Hi {firstName},
      </Text>
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '16px 0 24px' }}>
        We received a request to reset your Business Market Network password.
      </Text>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button
          href={resetUrl}
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
          Reset Password
        </Button>
      </Section>

      <Text style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px', textAlign: 'center' }}>
        This link expires in 1 hour for security.
      </Text>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '0 0 24px' }}>
        If you didn&apos;t request this reset, please ignore this email. Your password will remain unchanged.
      </Text>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151' }}>
        For security concerns, contact: <a href="mailto:support@businessmarket.network" style={{ color: '#2563eb' }}>support@businessmarket.network</a>
      </Text>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '24px 0 0' }}>
        Best regards,
        <br />
        The BMN Team
      </Text>
    </EmailLayout>
  );
};

export default PasswordResetEmail;
