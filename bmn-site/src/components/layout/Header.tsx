import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';

export function Header() {
  return (
    <nav className="relative z-50 bg-white/80 backdrop-blur-md border-b border-bmn-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-2 md:grid-cols-3 items-center">
        {/* Logo Area */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/icon.png" alt="BMN Logo" width={32} height={32} className="rounded" />
            <span className="text-xl font-display font-bold text-gradient-primary">
              BMN
            </span>
          </Link>
        </div>

        <div className="hidden md:flex justify-center items-center space-x-8">
           <a href="#stakeholder-network" className="text-sm font-medium text-text-secondary hover:text-bmn-blue transition-colors">
            Network
          </a>
           <a href="#profile-benefits" className="text-sm font-medium text-text-secondary hover:text-bmn-blue transition-colors">
            Leads
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-text-secondary hover:text-bmn-blue transition-colors">
            Process
          </a>
          <a href="#pricing" className="text-sm font-medium text-text-secondary hover:text-bmn-blue transition-colors">
            Pricing
          </a>
           <a href="#faq" className="text-sm font-medium text-text-secondary hover:text-bmn-blue transition-colors">
            FAQ
          </a>
        </div>

        {/* Auth Buttons & Mobile Menu - Right Aligned */}
        <div className="flex justify-end items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-medium text-text-secondary hover:text-bmn-blue transition-colors hidden sm:block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn-primary py-2 px-4 text-sm"
          >
            Get Started
          </Link>

          {/* Mobile Menu Trigger */}
          <button className="md:hidden text-text-secondary" aria-label="Open navigation menu">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
