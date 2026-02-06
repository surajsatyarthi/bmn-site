'use client';

export function GradientDefinitions() {
  return (
    <svg width="0" height="0" className="absolute block w-0 h-0 overflow-hidden" aria-hidden="true">
      <defs>
        <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
    </svg>
  );
}
