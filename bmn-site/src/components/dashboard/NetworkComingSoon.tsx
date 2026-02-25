import Link from 'next/link';

interface NetworkComingSoonProps {
  memberCount: number;
}

export function NetworkComingSoon({ memberCount }: NetworkComingSoonProps) {
  if (process.env.NEXT_PUBLIC_NETWORK_ENABLED === 'true') {
    return null;
  }

  const percentage = Math.min(memberCount / 100, 1) * 100;
  
  if (memberCount >= 100) {
    return (
      <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm mb-6">
        <h2 className="text-xl font-bold font-display text-text-primary mb-2">🌐 The BMN Network — Coming Soon</h2>
        <p className="text-text-secondary">
          The Network is now open.{' '}
          <Link href="/dashboard" className="text-bmn-blue hover:underline font-medium">Click here to access</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm mb-6">
      <h2 className="text-xl font-bold font-display text-text-primary mb-2">🌐 The BMN Network — Coming Soon</h2>
      <p className="text-text-secondary mb-6 max-w-2xl">
        Direct messaging and partner connections unlock at 100 registered members.
      </p>
      
      <div>
        <div className="w-full bg-gray-100 h-3 rounded-full mb-2 overflow-hidden border border-gray-200">
          <div 
            className="bg-bmn-blue h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-sm font-semibold text-text-primary text-right">
          {memberCount} / 100 members
        </div>
      </div>
    </div>
  );
}
