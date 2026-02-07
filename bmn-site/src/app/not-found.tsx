import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bmn-light-bg p-4 text-center">
      <div className="mb-8">
        <Image
          src="/branding/logo-matched.png"
          alt="BMN Logo"
          width={120}
          height={120}
          className="priority"
          priority
        />
      </div>
      <h1 className="font-display text-6xl font-bold text-gradient-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-text-primary">Page not found</h2>
      <p className="mt-2 mb-8 text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="btn-primary"
      >
        Go Home
      </Link>
    </div>
  );
}
