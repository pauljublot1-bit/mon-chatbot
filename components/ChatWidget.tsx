'use client';

import { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import company from '@/app/config/company';

/**
 * ChatWidget — Bouton flottant + fenêtre de chat.
 *
 * Comportement selon la taille d'écran :
 *
 * 📱 Mobile  : bottom sheet qui monte du bas sur toute la largeur
 *              (comme les apps iOS/Android). Backdrop sombre derrière.
 *              Bouton caché quand le chat est ouvert.
 *
 * 🖥️ Desktop : popup compact au-dessus du bouton (scale + fade).
 *              Bouton toujours visible pour toggler.
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);

  /* Masque le badge à la première ouverture */
  useEffect(() => {
    if (isOpen) setShowBadge(false);
  }, [isOpen]);

  /* Bloque le scroll de la page en arrière-plan quand le chat est ouvert sur mobile */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* ══ BACKDROP (mobile uniquement) ══════════════════════════
          Fond sombre derrière le bottom sheet.
          Clic dessus → ferme le chat.
      ══════════════════════════════════════════════════════════ */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/40 sm:hidden
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden="true"
      />

      {/* ══ FENÊTRE DE CHAT ═══════════════════════════════════════
          Mobile  : inset-x-0 bottom-0 → toute la largeur, depuis le bas
          Desktop : bottom-24 right-6 → popup au-dessus du bouton
      ══════════════════════════════════════════════════════════ */}
      <div
        className={`
          fixed z-50 bg-white shadow-2xl overflow-hidden

          /* ── Mobile : bottom sheet ── */
          inset-x-0 bottom-0 rounded-t-3xl
          h-[90dvh]

          /* ── Desktop : popup ── */
          sm:inset-x-auto sm:left-auto
          sm:bottom-24 sm:right-6
          sm:w-96 sm:h-[560px]
          sm:rounded-2xl

          border border-gray-200/60
          transition-all duration-300 ease-out

          ${isOpen
            /* Ouvert */
            ? 'translate-y-0 opacity-100 pointer-events-auto sm:scale-100'
            /* Fermé : slide bas sur mobile, scale sur desktop */
            : 'translate-y-full sm:translate-y-4 sm:scale-95 opacity-0 pointer-events-none'
          }
        `}
        role="dialog"
        aria-modal="true"
        aria-label={`Chat ${company.name}`}
        aria-hidden={!isOpen}
      >
        {/* Poignée visuelle (mobile uniquement) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 absolute top-0 left-0 right-0 z-10">
          <div className="w-9 h-1 rounded-full bg-white/40" />
        </div>

        {/* Contenu : ChatWindow + bouton fermer */}
        <div className="relative h-full">
          <ChatWindow />

          {/* Bouton ✕ en overlay sur le header */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center text-white"
            aria-label="Fermer le chat"
            tabIndex={isOpen ? 0 : -1}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* ══ BOUTON FLOTTANT ═══════════════════════════════════════
          Mobile  : masqué quand le chat est ouvert (le panel occupe tout)
          Desktop : toujours visible (toggle ouvert/fermé)
      ══════════════════════════════════════════════════════════ */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50
          w-14 h-14 rounded-full shadow-xl
          items-center justify-center text-white
          transition-all duration-200
          hover:scale-110 active:scale-95
          focus:outline-none
          /* Caché sur mobile quand le chat est ouvert */
          ${isOpen ? 'hidden sm:flex' : 'flex'}
        `}
        style={{ backgroundColor: company.primaryColor }}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le chat'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {/* Badge de notification */}
        {showBadge && !isOpen && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[11px] text-white flex items-center justify-center font-bold shadow-md animate-pulse"
            aria-label="1 nouveau message"
          >
            1
          </span>
        )}

        {/* Icône : bulle chat ↔ croix */}
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-90 scale-90' : ''}`}>
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          )}
        </span>
      </button>
    </>
  );
}
