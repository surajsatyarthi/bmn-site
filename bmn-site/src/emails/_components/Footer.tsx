
import { Section, Text, Link, Hr } from '@react-email/components';
import React from 'react';

export const Footer = () => {
  return (
    <Section style={{ marginTop: '32px' }}>
      <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />
      <Text style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
        Business Market Network
        <br />
        AI-Powered Export-Import Platform
      </Text>
      <Text style={{ fontSize: '12px', fontWeight: 'bold', color: '#111827', margin: '12px 0 4px' }}>
        By Invictus International Consulting Services
      </Text>
      <Text style={{ fontSize: '12px', color: '#6b7280', margin: '12px 0' }}>
        <Link href="mailto:support@businessmarket.network" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
          support@businessmarket.network
        </Link>
        {' • '}
        <Link href="https://businessmarket.network" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
          businessmarket.network
        </Link>
      </Text>
      <Hr style={{ borderColor: '#e6ebf1', margin: '20px 0' }} />
    </Section>
  );
};

export default Footer;
