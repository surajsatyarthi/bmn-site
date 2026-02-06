export default function ContactPage() {
  return (
    <div className="prose prose-lg prose-blue max-w-none text-text-secondary">
      <h1 className="text-4xl font-display font-bold text-text-primary mb-8">Contact Us</h1>
      
      <div className="space-y-6">
        <p>
          We&apos;re here to help you succeed in international trade. If you have any questions about
          our services, pricing, or partnership opportunities, please don&apos;t hesitate to reach out.
        </p>

        <div className="bg-bmn-light-bg p-8 rounded-xl border border-bmn-border not-prose">
          <h3 className="text-xl font-bold text-text-primary mb-4">Invictus International Consulting Services</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-text-primary uppercase tracking-wide">Email</p>
              <a href="mailto:info@businessmarket.network" className="text-gradient-primary hover:underline hover:decoration-bmn-blue text-lg">
                info@businessmarket.network
              </a>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-text-primary uppercase tracking-wide">Address</p>
              <address className="not-italic text-text-secondary">
                Mumbai, India<br />
                (Full address to be updated)
              </address>
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
