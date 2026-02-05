import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ArrowRight, Globe2, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-bmn-light-bg text-text-primary">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-32">
        {/* Background Elements */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-bmn-blue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-bmn-blue text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-bmn-blue"></span>
            </span>
            Live in 200+ Countries
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 animate-logo-shine text-bmn-dark-blue">
            Connect. Grow. <span className="text-bmn-blue">Succeed.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-10 font-light leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            The world's first verified marketplace connecting exporters, importers, and manufacturers with AI-driven trust.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <Link 
              href="/signup" 
              className="btn-primary text-lg px-8 py-4 shadow-xl shadow-blue-500/20 hover:-translate-y-1"
            >
              Start Trading Now <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 bg-white text-text-primary rounded-md font-bold border border-bmn-border hover:bg-gray-50 transition-all hover:-translate-y-1 shadow-sm"
            >
              View Marketplace
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-bmn-border/50 max-w-4xl mx-auto">
            <p className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-6">Trusted By Industry Leaders</p>
            <div className="flex justify-center flex-wrap gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos - usually SVGs */}
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-text-primary mb-4">Why Industry Leaders Choose BMN</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              We replace manual verification with AI-driven trust, enabling faster and safer global transactions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Globe2 className="w-8 h-8 text-bmn-blue" />}
              title="Global Reach"
              description="Access a network of verified businesses across 200+ countries. Break down borders with a single platform."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-bmn-blue" />}
              title="Verified Partners"
              description="Every member is vetted using our proprietary AI verification system to ensure you only deal with legitimate entities."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-bmn-blue" />}
              title="Fast Connections"
              description="Instant messaging and smart matching algorithms connect you with the right partners in seconds, not days."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bmn-light-bg py-12 border-t border-bmn-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl font-display font-bold text-text-primary tracking-tight">BMN</span>
          </div>
          <p className="text-text-secondary text-sm">© 2026 Business Market Network. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-xl bg-bmn-light-bg border border-bmn-border hover:border-bmn-blue/30 hover:shadow-lg transition-all hover:-translate-y-1 group">
      <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm border border-bmn-border group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3 font-display">{title}</h3>
      <p className="text-text-secondary leading-relaxed text-sm">
        {description}
      </p>
    </div>
  )
}
