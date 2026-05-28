'use client';

import { useState, useRef, useCallback } from 'react';
import company from '@/app/config/company';

/* ── Props ──────────────────────────────────────────────────── */
interface ChatInputProps {
  /** Callback appelé quand l'utilisateur envoie un message */
  onSend: (message: string) => void;
  /** Désactive la saisie pendant que le bot répond */
  disabled?: boolean;
}

/**
 * ChatInput — Zone de saisie et bouton d'envoi.
 *
 * Fonctionnalités :
 * • Textarea auto-redimensionnable (jusqu'à ~5 lignes)
 * • Envoi avec Entrée, saut de ligne avec Shift+Entrée
 * • Bouton d'envoi désactivé si le champ est vide ou bot en cours
 * • Focus automatique au montage
 * • Couleur du bouton adaptée au branding client
 */
export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ── Auto-resize du textarea ──────────────────────────────── */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);

      /* Recalcul de la hauteur : reset → scroll height */
      const ta = e.target;
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`; // max ~5 lignes
    },
    []
  );

  /* ── Envoi du message ─────────────────────────────────────── */
  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue('');

    /* Réinitialise la hauteur du textarea */
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  }, [value, disabled, onSend]);

  /* ── Gestion clavier ──────────────────────────────────────── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      /* Entrée seule → envoyer | Shift+Entrée → saut de ligne */
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3 flex-shrink-0">
      {/* ── Ligne principale : textarea + bouton ──────────────── */}
      <div className="flex items-end gap-2">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question…"
          disabled={disabled}
          rows={1}
          aria-label="Votre message"
          className={`
            flex-1 resize-none rounded-xl border text-sm text-gray-800
            placeholder-gray-400 px-4 py-2.5 leading-6
            transition-all duration-150 overflow-y-auto
            focus:outline-none focus:ring-2
            disabled:opacity-60 disabled:cursor-not-allowed
            ${disabled
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 bg-white hover:border-gray-400 focus:border-blue-400 focus:ring-blue-100'
            }
          `}
          style={{
            minHeight: '44px',
            maxHeight: '120px',
          }}
        />

        {/* Bouton envoyer */}
        <button
          onClick={handleSubmit}
          disabled={!canSend}
          aria-label="Envoyer le message"
          title="Envoyer (Entrée)"
          className="
            flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
            text-white transition-all duration-150
            hover:opacity-90 active:scale-95
            disabled:opacity-35 disabled:cursor-not-allowed disabled:active:scale-100
          "
          style={{ backgroundColor: company.primaryColor }}
        >
          {/* Icône flèche ↑ */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>

      {/* ── Aide clavier ──────────────────────────────────────── */}
      <p className="text-[11px] text-gray-400 mt-2 text-center select-none">
        <kbd className="bg-gray-100 border border-gray-200 px-1 rounded text-[10px] font-sans">
          Entrée
        </kbd>{' '}
        pour envoyer ·{' '}
        <kbd className="bg-gray-100 border border-gray-200 px-1 rounded text-[10px] font-sans">
          Shift+Entrée
        </kbd>{' '}
        pour un saut de ligne
      </p>
    </div>
  );
}
