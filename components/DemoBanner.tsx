'use client';

import { useState } from 'react';

export default function DemoBanner() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div
      className="w-full flex items-center justify-center px-4 py-2.5 text-white text-[13px] font-medium relative"
      style={{ backgroundColor: '#378ADD' }}
    >
      <span className="text-center leading-snug">
        🤖 Démonstration NexBot — Testez l&apos;assistant en bas à droite de l&apos;écran
      </span>
      <button
        onClick={() => setClosed(true)}
        aria-label="Fermer la bannière"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors text-base leading-none"
      >
        ✕
      </button>
    </div>
  );
}
