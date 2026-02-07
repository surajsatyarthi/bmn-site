'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Check, ThumbsUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: {
    id: string;
    counterpartyName: string;
    counterpartyCountry: string;
    counterpartyCity: string | null;
    matchedProducts: { hsCode: string; name: string }[];
    matchTier: 'best' | 'great' | 'good';
    matchReasons: string[];
    status: 'new' | 'viewed' | 'interested' | 'dismissed';
  };
  onStatusChange?: (id: string, status: 'interested' | 'dismissed') => void;
}

const tierStyles = {
  best: 'bg-blue-100 text-bmn-blue',
  great: 'bg-teal-100 text-teal-700',
  good: 'bg-gray-100 text-gray-600',
};

const tierLabels = {
  best: 'Best Match',
  great: 'Great Match',
  good: 'Good Match',
};

const statusColors = {
  new: 'bg-blue-500',
  viewed: 'bg-gray-400',
  interested: 'bg-green-500',
  dismissed: 'bg-gray-300',
};

export default function MatchCard({ match, onStatusChange }: MatchCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: 'interested' | 'dismissed') => {
    if (isUpdating || match.status === newStatus) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/matches/${match.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok && onStatusChange) {
        onStatusChange(match.id, newStatus);
      }
    } catch (error) {
      console.error('Failed to update match status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const location = match.counterpartyCity 
    ? `${match.counterpartyCity}, ${match.counterpartyCountry}`
    : match.counterpartyCountry;

  const products = match.matchedProducts.map(p => p.name).join(', ');

  return (
    <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {/* Tier Badge */}
            <span className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-full',
              tierStyles[match.matchTier]
            )}>
              {tierLabels[match.matchTier]}
            </span>
            {/* Status Dot */}
            <span 
              className={cn('w-2 h-2 rounded-full', statusColors[match.status])}
              title={`Status: ${match.status}`}
            />
          </div>
          {/* Company Name */}
          <h3 className="text-lg font-bold text-text-primary">
            {match.counterpartyName}
          </h3>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
        <MapPin className="h-4 w-4" />
        <span>{location}</span>
      </div>

      {/* Matched Products */}
      <p className="text-sm text-text-secondary mb-4">
        <span className="font-medium text-text-primary">Products:</span> {products}
      </p>

      {/* Match Reasons (first 2) */}
      <div className="space-y-2 mb-4">
        {match.matchReasons.slice(0, 2).map((reason, index) => (
          <div key={index} className="flex items-start gap-2 text-sm text-text-secondary">
            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            <span>{reason}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-bmn-border">
        <Link
          href={`/matches/${match.id}`}
          className="px-4 py-2 text-sm font-medium text-white bg-bmn-blue rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
        
        {match.status !== 'interested' && match.status !== 'dismissed' && (
          <>
            <button
              onClick={() => handleStatusChange('interested')}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
            >
              <ThumbsUp className="h-4 w-4" />
              Interested
            </button>
            <button
              onClick={() => handleStatusChange('dismissed')}
              disabled={isUpdating}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Dismiss
            </button>
          </>
        )}
      </div>
    </div>
  );
}
