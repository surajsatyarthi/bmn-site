import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bmn-light-bg p-4 md:p-8">
      <div className="mb-6 text-center">
        <Link href="/" className="inline-block">
          <span className="text-4xl font-display font-bold text-gradient-primary tracking-tight">BMN</span>
        </Link>
        <p className="text-text-secondary font-medium mt-2">Connect. Grow. Succeed.</p>
      </div>
      <div className="bg-white rounded-xl border border-bmn-border p-8 shadow-sm w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
