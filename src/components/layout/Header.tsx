import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';

export function Header() {
  return (
    <nav className="sticky top-0 z-50 glass-header">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-display font-bold text-bmn-blue">
            BMN
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/features" className="text-sm font-medium text-text-secondary hover:text-bmn-blue transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-text-secondary hover:text-bmn-blue transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-medium text-text-secondary hover:text-bmn-blue transition-colors">
            About
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
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
          <button className="md:hidden text-text-secondary">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
