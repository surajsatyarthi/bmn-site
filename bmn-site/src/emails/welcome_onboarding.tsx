
import { Text, Button, Section } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import React from 'react';

interface WelcomeEmailProps {
  firstName?: string;
}

export const WelcomeEmail = ({ firstName = 'Trader' }: WelcomeEmailProps) => {
  return (
    <EmailLayout preview="Welcome to Business Market Network – Let's Find Your Buyers">
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151' }}>
        Hi {firstName},
      </Text>
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '16px 0' }}>
        Your email is verified! Welcome to Business Market Network – the AI-powered platform that finds qualified export-import partners for you.
      </Text>
      
      <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '24px 0 16px' }}>
        🎯 What happens next?
      </Text>
      
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '0' }}>
        Complete your 6-step trade profile (takes ~5 minutes):
      </Text>
      <ul style={{ paddingLeft: '20px', margin: '8px 0 24px', color: '#374151' }}>
        <li style={{ marginBottom: '8px' }}>Your products and HS Codes → Enables AI matching</li>
        <li style={{ marginBottom: '8px' }}>Target markets → We find the right buyers/suppliers</li>
        <li style={{ marginBottom: '8px' }}>Certifications → Builds trust with partners</li>
        <li style={{ marginBottom: '8px' }}>Business details → Unlocks verified opportunities</li>
      </ul>

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
          Complete Your Trade Profile
        </Button>
      </Section>

      <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '24px 0 8px' }}>
        How we're different:
      </Text>
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '0 0 16px' }}>
        Unlike traditional directories where you wait for leads, our AI actively discovers and qualifies trade opportunities based on real customs data and shipping records.
      </Text>
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '0 0 24px' }}>
        Once your profile is complete, our matching engine starts working 24/7 to find your ideal partners.
      </Text>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151' }}>
        Need help? Our team is here: <a href="mailto:support@businessmarket.network" style={{ color: '#2563eb' }}>support@businessmarket.network</a>
      </Text>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '24px 0 0' }}>
        Best regards,
        <br />
        The BMN Team
      </Text>

      <Text style={{ fontSize: '14px', color: '#6b7280', margin: '24px 0 0', fontStyle: 'italic' }}>
        P.S. Companies with complete profiles receive 3x more qualified matches.
      </Text>
    </EmailLayout>
  );
};

export default WelcomeEmail;
