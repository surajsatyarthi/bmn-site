
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
} from '@react-email/components';
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
}

export const EmailLayout = ({ children, preview = 'Notification from BMN' }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ config: 'bg-white font-sans', backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <Container style={{ margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' }}>
          <Header />
            <Section style={{ padding: '0' }}>
              {children}
            </Section>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
};

export default EmailLayout;
