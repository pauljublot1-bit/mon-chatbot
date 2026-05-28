'use client';

import type { Message } from '@/types/chat';
import company from '@/app/config/company';

/* ── Props ──────────────────────────────────────────────────── */
interface ChatBubbleProps {
  /** Le message à afficher (utilisateur ou bot) */
  message: Message;
}

/**
 * ChatBubble — Bulle de message individuelle.
 *
 * • Message utilisateur → aligné à droite, fond couleur primaire
 * • Message bot         → aligné à gauche, fond gris clair + avatar
 *
 * Le coin "plié" (rounded-tr-none / rounded-tl-none) indique
 * visuellement qui parle, comme dans WhatsApp ou iMessage.
 */
export default function ChatBubble({ message }: ChatBubbleProps) {
  const isBot = message.role === 'bot';

  /* Formatage de l'heure en HH:MM */
  const time = message.timestamp.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`flex items-end gap-2 mb-3 ${
        isBot ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* ── Avatar ───────────────────────────────────────────── */}
      {isBot ? (
        /* Avatar du bot : initiale ou logo de l'entreprise */
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm"
          style={{ backgroundColor: company.primaryColor }}
          aria-hidden="true"
          title={company.name}
        >
          {company.logoUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={company.logoUrl}
              alt={company.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            company.logoInitial ?? '🤖'
          )}
        </div>
      ) : (
        /* Espaceur symétrique côté utilisateur (pas d'avatar) */
        <div className="w-8 flex-shrink-0" aria-hidden="true" />
      )}

      {/* ── Contenu du message ───────────────────────────────── */}
      <div
        className={`flex flex-col max-w-[75%] ${
          isBot ? 'items-start' : 'items-end'
        }`}
      >
        {/* Bulle principale */}
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isBot
              ? /* Bot : fond gris, coin gauche pointu */
                'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none'
              : /* Utilisateur : fond couleur primaire, coin droit pointu */
                'text-white rounded-2xl rounded-tr-none'
          }`}
          style={
            !isBot
              ? { backgroundColor: company.primaryColor }
              : undefined
          }
        >
          {/* Texte du message — whitespace-pre-wrap conserve les sauts de ligne */}
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {/* Horodatage discret sous la bulle */}
        <span className="text-[11px] text-gray-400 mt-1 px-1 select-none">
          {time}
        </span>
      </div>
    </div>
  );
}
