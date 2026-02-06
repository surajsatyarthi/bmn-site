'use client';

import { useState } from 'react';
import { Lock, Unlock, Crown } from 'lucide-react';

interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string | null;
}

interface RevealGateProps {
  matchId: string;
  revealed: boolean;
  contact: ContactInfo | null;
  onReveal?: (contact: ContactInfo) => void;
}

export default function RevealGate({ matchId, revealed, contact, onReveal }: RevealGateProps) {
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedContact, setRevealedContact] = useState<ContactInfo | null>(contact);
  const [reveals, setReveals] = useState<{ used: number; remaining: number | string; total: number | string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReveal = async () => {
    if (isRevealing) return;
    
    setIsRevealing(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/matches/${matchId}/reveal`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError(data.message || 'Reveal limit reached');
          setReveals(data.reveals);
        } else {
          setError(data.error || 'Failed to reveal');
        }
        return;
      }

      setRevealedContact(data.match.counterpartyContact);
      setReveals(data.reveals);
      
      if (onReveal && data.match.counterpartyContact) {
        onReveal(data.match.counterpartyContact);
      }
    } catch (err) {
      setError('Failed to reveal. Please try again.');
      console.error('Reveal error:', err);
    } finally {
      setIsRevealing(false);
    }
  };

  // If revealed, show contact info
  if (revealed || revealedContact) {
    const displayContact = revealedContact || contact;
    
    return (
      <div className="bg-white rounded-xl border border-bmn-border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Unlock className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-text-primary">Business Details</h3>
        </div>
        
        {displayContact ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-text-secondary">Contact</p>
              <p className="font-medium text-text-primary">{displayContact.name}</p>
              <p className="text-sm text-text-secondary">{displayContact.title}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Email</p>
              <a 
                href={`mailto:${displayContact.email}`}
                className="font-medium text-bmn-blue hover:underline"
              >
                {displayContact.email}
              </a>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Phone</p>
              <a 
                href={`tel:${displayContact.phone}`}
                className="font-medium text-bmn-blue hover:underline"
              >
                {displayContact.phone}
              </a>
            </div>
            {displayContact.website && (
              <div>
                <p className="text-sm text-text-secondary">Website</p>
                <a 
                  href={displayContact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-bmn-blue hover:underline"
                >
                  {displayContact.website}
                </a>
              </div>
            )}
          </div>
        ) : (
          <p className="text-text-secondary">Contact information not available.</p>
        )}
      </div>
    );
  }

  // Locked state - show reveal gate
  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl border border-bmn-border p-6 shadow-sm overflow-hidden">
      {/* Blurred placeholder */}
      <div className="filter blur-sm select-none pointer-events-none mb-6">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-400">Contact</p>
            <p className="font-medium text-gray-400">██████ ████████</p>
            <p className="text-sm text-gray-400">████████ ███████</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-gray-400">█████@███████.com</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Phone</p>
            <p className="text-gray-400">+██ ███ ███████</p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px]">
        <div className="text-center px-4">
          <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Unlock Business Details
          </h3>
          
          {error ? (
            <div className="mb-4">
              <p className="text-sm text-red-600 mb-2">{error}</p>
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed mx-auto"
              >
                <Crown className="h-4 w-4" />
                Upgrade to Pro for unlimited reveals
              </button>
            </div>
          ) : (
            <>
              {reveals && (
                <p className="text-sm text-text-secondary mb-3">
                  {reveals.remaining} of {reveals.total} free reveals remaining this month
                </p>
              )}
              {!reveals && (
                <p className="text-sm text-text-secondary mb-3">
                  Use 1 of your free monthly reveals
                </p>
              )}
              <button
                onClick={handleReveal}
                disabled={isRevealing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-bmn-blue rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mx-auto"
              >
                <Unlock className="h-4 w-4" />
                {isRevealing ? 'Unlocking...' : 'Unlock Now'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
