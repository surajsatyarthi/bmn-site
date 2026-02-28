'use client';

import { useState } from 'react';

/**
 * Client component for the Reveal button as per ENTRY-12.0.
 * In ENTRY-17.0 this will wire up to the backend reveal API.
 */
export function ContactRevealButton() {
  const [clicked, setClicked] = useState(false);

  const handleReveal = () => {
    setClicked(true);
    // Temporary toast alert per requirements
    alert("Contact reveal coming soon");
    setTimeout(() => setClicked(false), 2000);
  };

  return (
    <button
      onClick={handleReveal}
      disabled={clicked}
      className="inline-flex items-center justify-center rounded-lg bg-bmn-blue px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 transition-colors disabled:opacity-50"
    >
      Reveal Contact Details
    </button>
  );
}
