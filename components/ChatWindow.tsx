'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ChatBubble from './ChatBubble';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import company from '@/app/config/company';
import clientConfig from '@/data/clients/galerie44/config.json';
import type { Message, ChatApiResponse, ConversationMessage } from '@/types/chat';
import { resolveWelcomeMessage } from '@/types/chat';

/**
 * ChatWindow — Orchestrateur principal du chatbot.
 *
 * Responsabilités :
 * • Initialise la conversation avec le message de bienvenue
 * • Gère l'historique des messages (state)
 * • Envoie les messages à l'API et récupère les réponses
 * • Affiche l'indicateur "en train d'écrire..."
 * • Scroll automatique vers le bas à chaque nouveau message
 * • Gestion des erreurs réseau avec message de fallback
 */
export default function ChatWindow() {
  /* ── État ─────────────────────────────────────────────────── */

  /** Historique complet de la conversation */
  const [messages, setMessages] = useState<Message[]>([]);

  /** Indique si le bot est en train de "rédiger" sa réponse */
  const [isTyping, setIsTyping] = useState(false);

  /** Identifiant unique de session — généré une seule fois au montage */
  const [sessionId, setSessionId] = useState<string>('');

  /** Référence à l'ancre de scroll en bas de la liste */
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ── Message de bienvenue (côté client uniquement) ────────── */
  /**
   * On initialise le message de bienvenue dans un useEffect pour éviter
   * les erreurs d'hydratation liées à `new Date()` côté serveur vs client.
   */
  useEffect(() => {
    // Génère un sessionId unique par conversation, côté client uniquement
    setSessionId(crypto.randomUUID());
    setMessages([
      {
        id: 'welcome',
        role: 'bot',
        content: resolveWelcomeMessage(
          clientConfig.welcomeMessage as string | Record<string, string>,
          clientConfig.defaultLanguage ?? 'fr',
        ),
        timestamp: new Date(),
      },
    ]);
  }, []); // S'exécute une seule fois au montage

  /* ── Scroll automatique ───────────────────────────────────── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]); // Déclenché à chaque nouveau message ou typing

  /* ── Envoi d'un message ───────────────────────────────────── */
  /**
   * Ajoute le message utilisateur, affiche l'indicateur de frappe,
   * appelle l'API, puis ajoute la réponse du bot.
   */
  const handleSend = useCallback(async (content: string) => {
    if (!content.trim() || isTyping) return;

    /* 1. Ajouter le message de l'utilisateur */
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      /* 2. Appel à l'API avec historique (format OpenAI : user/assistant) */
      const history: ConversationMessage[] = messages
        .filter((m) => m.role !== 'bot' || m.id !== 'welcome') // exclut le message d'accueil
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message:   content,
          clientId:  'galerie44',
          sessionId,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erreur HTTP ${res.status}`);
      }

      const data: ChatApiResponse = await res.json();

      /* 3. Ajouter la réponse du bot */
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

    } catch (err) {
      /* 4. Message d'erreur si la requête échoue */
      console.error('[ChatWindow] Erreur lors de l\'envoi :', err);

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'bot',
        content:
          `Désolé, une erreur s'est produite. ` +
          `Veuillez réessayer ou nous appeler directement au ${company.phone}.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

    } finally {
      /* Toujours masquer l'indicateur de frappe */
      setIsTyping(false);
    }
  }, [isTyping]);

  /* ── Rendu ────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-full bg-white">

      {/* ── En-tête ─────────────────────────────────────────── */}
      <ChatHeader />

      {/* ── Zone des messages ────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 chat-messages-scroll"
        role="log"
        aria-label="Conversation"
        aria-live="polite"
      >
        {/* Liste des messages */}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* ── Indicateur "Bot est en train d'écrire..." ──────── */}
        {isTyping && (
          <div
            className="flex items-end gap-2 mb-3"
            role="status"
            aria-label="L'assistant rédige une réponse"
          >
            {/* Avatar bot */}
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: company.primaryColor }}
              aria-hidden="true"
            >
              {company.logoInitial ?? '🤖'}
            </div>

            {/* Bulle avec points animés */}
            <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="typing-dot w-2 h-2 rounded-full bg-gray-400" />
                <span className="typing-dot w-2 h-2 rounded-full bg-gray-400" />
                <span className="typing-dot w-2 h-2 rounded-full bg-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Ancre invisible pour le scroll automatique */}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>

      {/* ── Zone de saisie ───────────────────────────────────── */}
      <ChatInput onSend={handleSend} disabled={isTyping} />

    </div>
  );
}
