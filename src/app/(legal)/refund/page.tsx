export default function RefundPage() {
    return (
      <div className="prose prose-lg prose-blue max-w-none text-text-secondary">
        <h1 className="text-4xl font-display font-bold text-text-primary mb-4">Refund Policy</h1>
        <p className="text-sm text-text-secondary mb-12">Last updated: February 2026</p>
  
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Free Tier</h2>
            <p>
              Our basic service is currently provided free of charge. As no payment is required, no refunds are applicable for the use of the free tier features.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Pro Plan (Coming Soon)</h2>
            <p>
              Refund terms for our upcoming Pro Plan will be published here upon its launch. We are committed to fair and transparent billing practices.
            </p>
          </section>
  
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Contact Us</h2>
            <p>
              If you believe you have been charged in error or have questions about our billing policies, please contact our support team at info@businessmarket.network.
            </p>
          </section>
        </div>
      </div>
    );
  }
  
