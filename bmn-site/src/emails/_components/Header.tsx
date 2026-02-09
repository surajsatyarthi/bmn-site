
import { Section, Text, Hr } from '@react-email/components';
import React from 'react';

export const Header = () => {
  return (
    <Section>
      <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />
      <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', margin: '0' }}>
        BUSINESS MARKET NETWORK
      </Text>
      <Text style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0' }}>
        Connect. Grow. Succeed.
      </Text>
      <Text style={{ fontSize: '12px', color: '#3b82f6', margin: '2px 0 10px' }}>
        AI-Powered Export-Import Platform
      </Text>
      <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />
    </Section>
  );
};

export default Header;
