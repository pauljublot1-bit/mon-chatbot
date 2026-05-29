import { readFileSync } from 'fs';
import { join } from 'path';
import type { Plan, Features, FeatureKey } from '@/types/features';
import type { ClientConfig } from '@/types/chat';

// ── Fonctionnalités incluses par plan ────────────────────────────────
const PLAN_FEATURES: Record<Plan, Features> = {
  basic: {
    catalogue:    true,
    reservations: false,
    dashboard:    false,
    export_csv:   false,
    multilingual: false,
  },
  pro: {
    catalogue:    true,
    reservations: true,
    dashboard:    true,
    export_csv:   false,
    multilingual: false,
  },
  premium: {
    catalogue:    true,
    reservations: true,
    dashboard:    true,
    export_csv:   true,
    multilingual: true,
  },
  custom: {
    catalogue:    true,
    reservations: true,
    dashboard:    true,
    export_csv:   true,
    multilingual: true,
  },
};

// ── Limites mensuelles par plan ──────────────────────────────────────
const PLAN_MONTHLY_LIMITS: Record<Plan, number> = {
  basic:   1_000,
  pro:     5_000,
  premium: 15_000,
  custom:  Infinity,
};

/** Retourne le nombre maximum de conversations autorisées par mois pour ce plan. */
export function getMonthlyLimit(plan: Plan): number {
  return PLAN_MONTHLY_LIMITS[plan];
}

// ── Chargement config client ─────────────────────────────────────────
function loadConfig(clientId: string): ClientConfig {
  try {
    const raw = readFileSync(
      join(process.cwd(), 'data', 'clients', clientId, 'config.json'),
      'utf-8'
    );
    return JSON.parse(raw) as ClientConfig;
  } catch {
    // Fallback minimal si le fichier est absent
    return {
      storeName:      clientId,
      botName:        `Assistant ${clientId}`,
      primaryColor:   '#1c1c1c',
      welcomeMessage: 'Bonjour ! Comment puis-je vous aider ?',
      language:       'fr',
      plan:           'basic',
    };
  }
}

// ── API publique ──────────────────────────────────────────────────────

/**
 * Retourne le plan souscrit par le client.
 * Défaut : 'basic' si non spécifié.
 */
export function getPlan(clientId: string): Plan {
  return loadConfig(clientId).plan ?? 'basic';
}

/**
 * Retourne true si la feature est activée pour ce client.
 *
 * Priorité : config.json features > valeurs par défaut du plan.
 */
export function isEnabled(clientId: string, feature: FeatureKey): boolean {
  const config  = loadConfig(clientId);
  const plan    = config.plan ?? 'basic';
  const defaults = PLAN_FEATURES[plan];

  // Override explicite dans config.json
  if (config.features && feature in config.features) {
    return config.features[feature] ?? defaults[feature];
  }

  return defaults[feature];
}
