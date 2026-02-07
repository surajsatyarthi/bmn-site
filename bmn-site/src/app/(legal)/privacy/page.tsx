import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | BMN',
  description: 'Understand how BMN collects, uses, and protects your business and personal information.',
};

export default function PrivacyPage() {
    return (
      <div className="prose prose-lg prose-blue max-w-none text-text-secondary">
        <h1 className="text-4xl font-display font-bold text-text-primary mb-4">Privacy Policy</h1>
        <p className="text-sm text-text-secondary mb-12">Last updated: February 2026</p>
  
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This includes business details, contact information, and trade preferences. We also collect usage data automatically when you interact with our platform.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, to match you with potential buyers or suppliers, and to communicate with you. We may use aggregated, non-identifiable data for industry analysis.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">3. Data Sharing</h2>
            <p>
              We do not sell your personal data. We may share your business profile information with potential counterparties as part of the specialized matching service. We may also share data with service providers who help us operate our business.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You may also object to processing or request data portability. To exercise these rights, please contact our support team.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">6. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at info@businessmarket.network.
            </p>
          </section>
        </div>
      </div>
    );
  }
  
