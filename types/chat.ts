/**
 * Types TypeScript partagés pour le système de chatbot.
 * Ce fichier centralise toutes les interfaces utilisées
 * dans les composants, l'API et la configuration.
 */

// ─────────────────────────────────────────────
// Messages
// ─────────────────────────────────────────────

/** Auteur d'un message : l'utilisateur ou le bot */
export type MessageRole = 'user' | 'bot';

/** Représente un message dans la conversation (UI) */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

/** Format OpenAI pour l'historique de conversation */
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────

export interface FaqItem {
  id: string;
  keywords: string[];
  answer: string;
}

// ─────────────────────────────────────────────
// Catalogue produits
// ─────────────────────────────────────────────

/** Un produit dans le catalogue client */
export interface Product {
  /** Identifiant unique (ex: "chaise-eames-daw") */
  id: string;
  /** Nom complet du produit */
  name: string;
  /** Description courte */
  description: string;
  /** Prix en euros */
  price: number;
  /** Catégorie (ex: "Chaises & Fauteuils") */
  category: string;
  /** URL de la fiche produit (optionnel) */
  link?: string;
  /** Disponibilité en stock (optionnel) */
  inStock?: boolean;
}

// ─────────────────────────────────────────────
// Configuration client
// ─────────────────────────────────────────────

/** Config spécifique à chaque client (data/clients/[id]/config.json) */
export interface ClientConfig {
  storeName: string;
  botName: string;
  primaryColor: string;
  welcomeMessage: string;
  language: string;
}

// ─────────────────────────────────────────────
// Configuration entreprise (company.ts)
// ─────────────────────────────────────────────

export interface CompanyConfig {
  name: string;
  slogan: string;
  welcomeMessage: string;
  phone: string;
  address: string;
  hours: string;
  primaryColor: string;
  primaryColorLight: string;
  logoInitial?: string;
  logoUrl?: string;
}

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────

/** Corps de la requête POST /api/chat */
export interface ChatRequestBody {
  message: string;
  /** Identifiant anonyme de session (généré côté client via crypto.randomUUID) */
  sessionId?: string;
  /** Identifiant du client (ex: "galerie44") — détermine quel catalogue charger */
  clientId?: string;
  /** Historique des 10 derniers échanges au format OpenAI */
  history?: ConversationMessage[];
}

/** Réponse de l'API /api/chat */
export interface ChatApiResponse {
  reply: string;
  matched: boolean;
}
