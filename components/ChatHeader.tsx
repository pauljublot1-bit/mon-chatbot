'use client';

import company from '@/app/config/company';

/**
 * ChatHeader — En-tête de la fenêtre de chat.
 *
 * Affiche :
 * • Avatar / initiale de l'entreprise
 * • Nom et slogan de l'entreprise
 * • Indicateur de statut "En ligne" (vert animé)
 *
 * La couleur de fond est celle du client, injectée depuis company.ts.
 * Aucun CSS à modifier pour changer le branding.
 */
export default function ChatHeader() {
  return (
    <header
      className="flex items-center gap-3 px-4 py-3 text-white shadow-md flex-shrink-0"
      style={{ backgroundColor: company.primaryColor }}
    >
      {/* ── Avatar avec point vert en bas à droite (style Discord) */}
      <div className="relative flex-shrink-0">
        <div
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-base ring-2 ring-white/30"
          aria-hidden="true"
        >
          {company.logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={company.logoUrl}
              alt={company.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            company.logoInitial ?? '💬'
          )}
        </div>

        {/* Point vert positionné en bas à droite de l'avatar */}
        <span
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 ring-2 ring-white/40 animate-pulse"
          role="status"
          aria-label="En ligne"
        />
      </div>

      {/* ── Informations entreprise ───────────────────────────── */}
      <div className="flex-1 min-w-0">
        <h1 className="font-semibold text-sm leading-tight truncate">
          {company.name}
        </h1>
        <p className="text-xs text-white/75 truncate mt-0.5">
          {company.slogan}
        </p>
      </div>
    </header>
  );
}
