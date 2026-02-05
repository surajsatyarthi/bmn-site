import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bmn-light-bg">
      <div className="max-w-4xl w-full px-4 py-12 text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center mb-8">
          <svg viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mr-4">
            <path d="M2.5 13.5L8.5 4L13.5 11.5L21.5 2" stroke="#2046f5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-5xl font-extrabold text-bmn-blue">BMN</span>
        </div>
        
        <p className="text-sm uppercase tracking-widest text-text-muted mb-8">Business Market Network</p>
        
        {/* Main Heading */}
        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase text-bmn-blue mb-6">
          AI-Powered Global Trade Platform
        </h1>
        
        <p className="text-lg text-text-muted mb-12 max-w-2xl mx-auto">
          Connect with verified exporters, importers, and manufacturers across 200+ countries. 
          Your gateway to international business opportunities.
        </p>
        
        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link 
            href="/signup"
            className="bg-bmn-blue text-white px-8 py-4 rounded-md font-bold text-sm uppercase hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            Get Started
          </Link>
          <Link 
            href="/login"
            className="bg-white border-2 border-bmn-blue text-bmn-blue px-8 py-4 rounded-md font-bold text-sm uppercase hover:bg-bmn-light-bg transition-colors w-full sm:w-auto"
          >
            Sign In
          </Link>
        </div>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white border border-bmn-border rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-bmn-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="font-bold text-sm uppercase text-text-dark mb-2">Global Reach</h3>
            <p className="text-xs text-text-muted">Access businesses in 200+ countries worldwide</p>
          </div>
          
          <div className="bg-white border border-bmn-border rounded-lg p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-bmn-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-sm uppercase text-text-dark mb-2">Verified Partners</h3>
            <p className="text-xs text-text-muted">AI-verified exporters and importers</p>
          </div>
          
          <div className="bg-white border border-bmn-border rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-bmn-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-sm uppercase text-text-dark mb-2">Fast Connections</h3>
            <p className="text-xs text-text-muted">Connect with the right partners instantly</p>
          </div>
        </div>
        
        <p className="text-xs text-text-muted mt-12">
          © 2026 Business Market Network. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}
