export type Plan = 'basic' | 'pro' | 'premium' | 'custom';

export type Features = {
  catalogue:    boolean; // afficher les produits dans le prompt
  reservations: boolean; // intégration Calendly / prise de RDV
  dashboard:    boolean; // accès dashboard admin
  export_csv:   boolean; // export des conversations
  multilingual: boolean; // détection langue automatique
};

export type FeatureKey = keyof Features;
