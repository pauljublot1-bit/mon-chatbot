import type { CompanyConfig } from '@/types/chat';

/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║              CONFIGURATION — GALERIE 44                 ║
 * ╚══════════════════════════════════════════════════════════╝
 */
const company: CompanyConfig = {
  // ── Identité ───────────────────────────────────────────────
  name: 'Galerie 44',
  slogan: 'Le spécialiste du mobilier vintage du 20ème siècle',
  logoInitial: 'G',

  // ── Message d'accueil ──────────────────────────────────────
  welcomeMessage:
    'Bienvenue chez Galerie 44 ! Je suis votre assistant dédié. ' +
    'Je peux vous renseigner sur notre collection, nos livraisons, ' +
    'nos visites sur rendez-vous ou tout autre sujet. Comment puis-je vous aider ?',

  // ── Coordonnées ────────────────────────────────────────────
  phone: '+33 (0)7 49 90 92 65',
  address: 'Entrepôt de 200m² — visite sur rendez-vous uniquement',
  hours: 'Sur rendez-vous · Lun–Sam · Contactez-nous',

  // ── Branding couleurs ──────────────────────────────────────
  // Noir chaud élégant, caractéristique des galeries d'art haut de gamme
  primaryColor: '#1c1c1c',
  primaryColorLight: '#f5f3ef',
};

export default company;
