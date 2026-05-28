/**
 * Générateur de prompt système dynamique.
 *
 * Construit le contexte envoyé à GPT à partir de :
 * - La config du client (storeName, botName, langue…)
 * - Le catalogue produits JSON du client
 * - La FAQ statique
 * - Les informations de contact (company.ts)
 *
 * Il suffit de modifier config.json et products.json pour
 * adapter le bot à n'importe quelle boutique sans toucher au code.
 */
import type { Product, ClientConfig } from '@/types/chat';
import { faq } from '@/app/data/faq';
import company from '@/app/config/company';

/**
 * Formate un produit en texte lisible pour le LLM.
 */
function formatProduct(p: Product): string {
  const lines: string[] = [`• ${p.name} (${p.category})`];
  lines.push(`  Description : ${p.description}`);
  lines.push(`  Prix : ${p.price} €`);
  if (p.inStock !== undefined) {
    lines.push(`  Disponibilité : ${p.inStock ? '✓ En stock' : '⏳ Sur commande'}`);
  }
  if (p.link) {
    lines.push(`  Fiche produit : ${p.link}`);
  }
  return lines.join('\n');
}

/**
 * Construit le prompt système complet.
 *
 * @param products   Liste des produits du catalogue client
 * @param config     Configuration de la boutique (config.json)
 */
export function buildSystemPrompt(products: Product[], config: ClientConfig): string {
  // ── Section catalogue produits ──────────────────────────────────
  const productSection =
    products.length > 0
      ? products.map(formatProduct).join('\n\n')
      : 'Aucun produit défini dans le catalogue pour l\'instant.';

  // ── Section FAQ abrégée (contexte supplémentaire pour GPT) ──────
  const faqSection = faq
    .map((f) => `• ${f.keywords[0]} : ${f.answer}`)
    .join('\n');

  // ── Langue de réponse ───────────────────────────────────────────
  const langue = config.language === 'fr' ? 'français' : config.language;

  return `Tu es ${config.botName}, l'assistant virtuel de ${config.storeName}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÔLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tu aides les visiteurs à découvrir la collection, répondre à leurs questions
et les orienter vers un achat ou une prise de contact.
Tu es chaleureux, professionnel et toujours concis (3-4 phrases maximum).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFORMATIONS DE LA BOUTIQUE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Boutique  : ${config.storeName}
Téléphone : ${company.phone}
Adresse   : ${company.address}
Horaires  : ${company.hours}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATALOGUE PRODUITS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${productSection}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTIONS FRÉQUENTES (FAQ)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${faqSection}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÈGLES STRICTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Réponds UNIQUEMENT en ${langue}.
2. Réponds uniquement aux sujets liés à la boutique et ses produits.
3. N'invente JAMAIS un prix — utilise exclusivement ceux du catalogue ci-dessus.
4. Si tu n'es pas certain d'une information, invite le client à appeler le ${company.phone}.
5. Oriente naturellement vers les produits du catalogue quand c'est pertinent.
6. Ne mentionne jamais que tu es une IA, un modèle de langage ou un chatbot.
7. Pour les questions hors-sujet, redirige poliment vers le téléphone.`;
}
