import Link from 'next/link';

export default function CreditCounter({
  used,
  limit,
}: {
  used: number;
  limit: number | 'unlimited';
}) {
  return (
    <Link
      href="/profile"
      data-testid="credit-counter"
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full transition-colors text-sm font-medium text-gray-700"
    >
      <span>💡</span>
      <span>
        {limit === 'unlimited' ? 'Unlimited' : `${used} / ${limit} reveals`}
      </span>
    </Link>
  );
}
