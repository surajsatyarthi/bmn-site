
import { Text, Button, Section } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import React from 'react';

interface FirstStepsGuideEmailProps {
  firstName?: string;
}

export const FirstStepsGuideEmail = ({ firstName = 'Trader' }: FirstStepsGuideEmailProps) => {
  return (
    <EmailLayout preview="Quick guide: How to complete your BMN profile">
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151' }}>
        Hi {firstName},
      </Text>
      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '16px 0' }}>
        We noticed you haven&apos;t finished setting up your trade profile. Let us help!
      </Text>
      
      <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', margin: '24px 0 16px' }}>
        📚 Quick Start Guide:
      </Text>
      
      <div style={{ marginBottom: '24px' }}>
        <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px' }}>Step 2: Product Selection</Text>
        <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 2px' }}>→ Enter your HS Codes (international product codes)</Text>
        <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 2px' }}>→ Don&apos;t know your HS Code? Use our built-in search tool</Text>
        <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 16px' }}>→ <i>Why it matters: This is how we match you with the right buyers/sellers</i></Text>
        
        <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px' }}>Step 3: Trade Interests</Text>
        <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 2px' }}>→ Select target countries for export/import</Text>
        <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 2px' }}>→ Add monthly volume estimates</Text>
        <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 16px' }}>→ <i>Why it matters: We find partners in your priority markets</i></Text>

        <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px' }}>Step 4-6: Business Details & Certifications</Text>
        <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 2px' }}>→ Company information and trade licenses</Text>
        <Text style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 16px' }}>→ <i>Why it matters: Verified businesses get 5x more responses</i></Text>
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
          Complete Your Profile
        </Button>
      </Section>

      <Text style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px', fontStyle: 'italic', textAlign: 'center' }}>
        💡 Pro tip: Most users complete all steps in under 5 minutes.
      </Text>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151' }}>
        Stuck on a specific step? Reply to this email and we&apos;ll guide you through it.
      </Text>

      <Text style={{ fontSize: '16px', lineHeight: '24px', color: '#374151', margin: '24px 0 0' }}>
        Best regards,
        <br />
        The BMN Team
      </Text>
    </EmailLayout>
  );
};

export default FirstStepsGuideEmail;
