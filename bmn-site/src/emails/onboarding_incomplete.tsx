
import { Text, Button, Section } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import React from 'react';

interface OnboardingIncompleteEmailProps {
  firstName?: string;
  progressPercentage?: number;
}

export const OnboardingIncompleteEmail = ({ firstName = 'Trader', progressPercentage = 20 }: OnboardingIncompleteEmailProps) => {
  return (
    <EmailLayout preview="Complete your trade profile to start getting matched">
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151' }}>
        Hi {firstName},
      </Text>
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '16px 0' }}>
        You're {progressPercentage}% of the way to unlocking AI-powered trade matching!
      </Text>
      
      <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '24px 0 16px' }}>
        Your progress:
      </Text>
      <div style={{ color: '#374151', fontSize: '16px', lineHeight: '28px', marginBottom: '24px', border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', backgroundColor: '#f9fafb' }}>
        <div>✅ Step 1: Trade Role</div>
        <div style={{ fontWeight: 'bold', color: '#2563eb' }}>⏸️ Step 2: Product Selection (resume here)</div>
        <div>⬜ Step 3: Trade Interests</div>
        <div>⬜ Step 4: Business Details</div>
        <div>⬜ Step 5: Certifications</div>
        <div>⬜ Step 6: Review & Submit</div>
      </div>

      <Section style={{ textAlign: 'center', margin: '32px 0' }}>
        <Button
          href="https://businessmarket.network/onboarding"
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
          Continue Profile Setup
        </Button>
      </Section>

      <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '24px 0 8px' }}>
        Why complete your profile?
      </Text>
      <ul style={{ paddingLeft: '20px', margin: '8px 0 24px', color: '#374151' }}>
        <li style={{ marginBottom: '8px' }}>Companies with complete profiles get 3x more qualified matches</li>
        <li style={{ marginBottom: '8px' }}>Our AI can only match you based on complete data</li>
        <li style={{ marginBottom: '8px' }}>Unlock access to verified trade partners worldwide</li>
      </ul>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '0 0 24px' }}>
        The remaining steps take just 3 minutes.
      </Text>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151' }}>
        Need help? We're here: <a href="mailto:support@businessmarket.network" style={{ color: '#2563eb' }}>support@businessmarket.network</a>
      </Text>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '24px 0 0' }}>
        Best regards,
        <br />
        The BMN Team
      </Text>
    </EmailLayout>
  );
};

export default OnboardingIncompleteEmail;
