import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ArrowRight, Globe2, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-text-primary">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-6 text-bmn-dark-blue">
            Connect. Grow. <span className="text-bmn-blue">Succeed.</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            The world's first verified marketplace connecting exporters, importers, and manufacturers with AI-driven trust.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="btn-primary text-lg px-8 py-3"
            >
              Start Trading Now <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 text-text-primary rounded-lg font-semibold border border-bmn-border hover:bg-bmn-light-bg transition-colors"
            >
              View Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-bmn-light-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-bmn-dark-blue mb-4">Why Choose BMN</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              We replace manual verification with AI-driven trust, enabling faster and safer global transactions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Globe2 className="w-6 h-6 text-bmn-blue" />}
              title="Global Reach"
              description="Access a network of verified businesses across 200+ countries."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-bmn-blue" />}
              title="Verified Partners"
              description="Every member is vetted using our proprietary AI verification system."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-bmn-blue" />}
              title="Fast Connections"
              description="Instant matching algorithms connect you with the right partners instantly."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-bmn-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xl font-display font-bold text-bmn-blue">BMN</span>
          <p className="text-text-secondary text-sm mt-4">© 2026 Business Market Network. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg bg-white border border-bmn-border hover:border-bmn-blue transition-colors">
      <div className="mb-4 text-bmn-blue">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-bmn-dark-blue mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}
