import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | BMN',
  description: 'Read the terms and conditions for using the Business Market Network platform and services.',
};

export default function TermsPage() {
    return (
      <div className="prose prose-lg prose-blue max-w-none text-text-secondary">
        <h1 className="text-4xl font-display font-bold text-text-primary mb-4">Terms and Conditions</h1>
        <p className="text-sm text-text-secondary mb-12">Last updated: February 2026</p>
  
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Business Market Network (BMN) platform, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">2. Description of Service</h2>
            <p>
              BMN provides a platform for connecting exporters with potential international buyers. We use data analysis to suggest matches but do not guarantee specific trade outcomes or the validity of every third-party record retrieved from public databases.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">3. User Obligations</h2>
            <p>
              You agree to provide accurate and current information about your business and products. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">4. Intellectual Property</h2>
            <p>
              The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights and trademarks. The copying, redistribution, use or publication by you of any such matters or any part of the Site is strictly prohibited.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">5. Limitation of Liability</h2>
            <p>
              Invictus International Consulting Services shall not be liable for any direct, indirect, incidental, special or consequential damages resulting from the use or the inability to use the service or for cost of procurement of substitute goods and services.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">6. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Mumbai, India.
            </p>
          </section>
        </div>
      </div>
    );
  }
  
