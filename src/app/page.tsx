import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-bmn-light-bg text-text-primary">
      {/* Navbar Placeholder - Keeping it simple for now */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-bmn-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-bmn-blue tracking-tight">BMN</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-bmn-blue transition-colors">
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="bg-bmn-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-bmn-navy text-white pt-24 pb-32">
        {/* Background Gradient Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-bmn-blue/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700 text-blue-200 text-xs font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-bmn-sky mr-2 animate-pulse"></span>
            AI-Powered Global Trade Ecosystem
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200 pb-2">
            Connect. Grow. Succeed.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            The world's first verified marketplace connecting exporters, importers, and manufacturers across 200+ countries.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-8 py-4 bg-bmn-blue hover:bg-blue-600 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1"
            >
              Start Trading Now
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white rounded-lg font-semibold text-lg transition-all"
            >
              View Marketplace
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-bmn-light-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Why Industry Leaders Choose BMN</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              We replace manual verification with AI-driven trust, enabling faster and safer global transactions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-bmn-border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                <svg className="w-6 h-6 text-bmn-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Global Reach</h3>
              <p className="text-text-secondary leading-relaxed">
                Access a network of verified businesses across 200+ countries. Break down borders with a single platform.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-bmn-border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-sky-100 transition-colors">
                <svg className="w-6 h-6 text-bmn-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Verified Partners</h3>
              <p className="text-text-secondary leading-relaxed">
                Every member is vetted using our proprietary AI verification system to ensure you only deal with legitimate entities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-bmn-border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">Fast Connections</h3>
              <p className="text-text-secondary leading-relaxed">
                Instant messaging and smart matching algorithms connect you with the right partners in seconds, not days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-24 border-t border-bmn-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-text-primary mb-6">Ready to expand your business?</h2>
          <p className="text-lg text-text-secondary mb-10">
            Join thousands of exporters and importers who are growing their business with BMN.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center px-8 py-4 bg-bmn-navy text-white rounded-lg font-semibold text-lg hover:bg-slate-800 transition-all"
          >
            Get Started for Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-bmn-light-bg py-12 border-t border-bmn-border">
        <div className="max-w-7xl mx-auto px-4 text-center text-text-secondary text-sm">
          <p>© 2026 Business Market Network. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}
