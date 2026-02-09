import Link from 'next/link';

// Version is injected at build time from VERCEL_GIT_COMMIT_SHA
const DEPLOYMENT_VERSION = '58f0f89';

export function Footer() {
  
  return (
    <footer className="bg-gradient-primary mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-8 md:order-2">
            <Link href="/terms" className="text-blue-100 hover:text-white text-sm transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-blue-100 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="text-blue-100 hover:text-white text-sm transition-colors">
              Contact
            </Link>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-blue-100">
              &copy; {new Date().getFullYear()} BMN. All rights reserved.
            </p>
          </div>
        </div>
        {/* Version number - bottom center */}
        <div className="mt-6 text-center">
          <span className="text-xs text-blue-200/60">
            v.{DEPLOYMENT_VERSION}
          </span>
        </div>
      </div>
    </footer>
  );
}
