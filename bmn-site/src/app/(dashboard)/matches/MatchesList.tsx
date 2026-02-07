'use client';

import { useState } from 'react';
import MatchCard from '@/components/matches/MatchCard';

interface Match {
  id: string;
  counterpartyName: string;
  counterpartyCountry: string;
  counterpartyCity: string | null;
  matchedProducts: { hsCode: string; name: string }[];
  matchTier: 'best' | 'great' | 'good';
  matchReasons: string[];
  status: 'new' | 'viewed' | 'interested' | 'dismissed';
}

interface MatchesListProps {
  initialMatches: Match[];
}

export default function MatchesList({ initialMatches }: MatchesListProps) {
  const [matches, setMatches] = useState(initialMatches);

  const handleStatusChange = (id: string, newStatus: 'interested' | 'dismissed') => {
    setMatches(prev => 
      prev.map(m => m.id === id ? { ...m, status: newStatus } : m)
    );
  };

  return (
    <div className="grid gap-4">
      {matches.map(match => (
        <MatchCard 
          key={match.id} 
          match={match} 
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}
