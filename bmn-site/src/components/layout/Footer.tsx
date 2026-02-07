import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-white border-t border-bmn-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 md:flex md:items-center md:justify-between">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="/terms" className="text-gray-400 hover:text-gray-500 text-sm">
            Terms
          </Link>
          <Link href="/privacy" className="text-gray-400 hover:text-gray-500 text-sm">
            Privacy
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-gray-500 text-sm">
            Contact
          </Link>
        </div>
        <div className="mt-4 md:mt-0 md:order-1">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} BMN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
