import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | BMN',
  description: 'Get in touch with BMN for any questions regarding international trade matching, pricing, or partnerships.',
};

export default function ContactPage() {
  return (
    <div className="prose prose-lg prose-blue max-w-none text-text-secondary">
      <h1 className="text-4xl font-display font-bold text-text-primary mb-8">Contact Us</h1>
      
      <div className="space-y-6">
        <p>
          We&apos;re here to help you succeed in international trade. If you have any questions about
          our services, pricing, or partnership opportunities, please don&apos;t hesitate to reach out.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
          <div className="bg-white p-6 rounded-xl border border-bmn-border shadow-sm">
            <h3 className="text-lg font-bold text-text-primary mb-4">Global Head Office</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">USA</p>
                <address className="not-italic text-text-secondary text-sm">
                  930, N 96th Street,<br />
                  Seattle, WA, 98103, USA
                </address>
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Email</p>
                <a href="mailto:info@businessmarket.network" className="text-bmn-blue hover:underline text-sm font-medium">
                  info@businessmarket.network
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-bmn-border shadow-sm">
            <h3 className="text-lg font-bold text-text-primary mb-4">Regional Offices</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Bengaluru, India</p>
                <address className="not-italic text-text-secondary text-sm">
                  2nd Floor, Building No 96, 4th Cross,<br />
                  2nd Main Road, Mahadevpura,<br />
                  Bengaluru, 560048
                </address>
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Gurugram, India</p>
                <address className="not-italic text-text-secondary text-sm">
                  C 1620, 4th Floor, Peach Tree Road,<br />
                  Sushant Lok Phase 1, Gurugram,<br />
                  Haryana - 122002
                </address>
              </div>
            </div>
          </div>
        </div>

        <p>
          For general support inquiries, please email us directly. We aim to respond to all queries
          within 24 hours during business days.
        </p>
      </div>
    </div>
  );
}
