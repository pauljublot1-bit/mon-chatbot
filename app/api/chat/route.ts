import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import OpenAI from 'openai';
import { faq } from '@/app/data/faq';
import company from '@/app/config/company';
import { buildSystemPrompt } from '@/lib/system-prompt';
import { isEnabled, getPlan } from '@/lib/features';
import { isLimitReached, isNearLimit, incrementCounter } from '@/lib/usage';
import { prisma } from '@/lib/prisma';
import type {
  ChatRequestBody,
  ChatApiResponse,
  Product,
  ClientConfig,
} from '@/types/chat';

// ── Client OpenAI ────────────────────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Chargement catalogue + config client ─────────────────────────────
function loadClientData(clientId: string): { products: Product[]; config: ClientConfig } {
  const base = join(process.cwd(), 'data', 'clients', clientId);

  let products: Product[] = [];
  try {
    products = JSON.parse(readFileSync(join(base, 'products.json'), 'utf-8')) as Product[];
  } catch {
    console.warn(`[API /chat] Catalogue introuvable pour "${clientId}".`);
  }

  let config: ClientConfig = {
    storeName:      company.name,
    botName:        `Assistant ${company.name}`,
    primaryColor:   company.primaryColor,
    welcomeMessage: company.welcomeMessage,
    language:       'fr',
  };
  try {
    config = JSON.parse(readFileSync(join(base, 'config.json'), 'utf-8')) as ClientConfig;
  } catch {
    console.warn(`[API /chat] Config introuvable pour "${clientId}".`);
  }

  return { products, config };
}

// ── Sauvegarde en base (ne bloque jamais la réponse) ─────────────────
async function saveToDatabase(
  sessionId: string,
  clientId: string,
  userMessage: string,
  botReply: string,
): Promise<void> {
  try {
    // Récupère ou crée la conversation pour cette session
    const conversation = await prisma.conversation.upsert({
      where:  { sessionId },
      update: { updatedAt: new Date() },
      create: { sessionId, clientId },
    });

    // Sauvegarde les deux messages en parallèle
    await Promise.all([
      prisma.message.create({
        data: {
          conversationId: conversation.id,
          role:    'user',
          content: userMessage,
        },
      }),
      prisma.message.create({
        data: {
          conversationId: conversation.id,
          role:    'assistant',
          content: botReply,
        },
      }),
    ]);
  } catch (err) {
    console.error('[API /chat] Erreur sauvegarde DB :', err);
  }
}

// ── Handler principal ─────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse<ChatApiResponse>> {
  // Validation
  let body: ChatRequestBody;
  try {
    body = await req.json() as ChatRequestBody;
  } catch {
    return NextResponse.json({ reply: 'Requête invalide.', matched: false }, { status: 400 });
  }

  if (!body.message || typeof body.message !== 'string') {
    return NextResponse.json({ reply: 'Message invalide.', matched: false }, { status: 400 });
  }

  const userMessage = body.message.trim();
  if (!userMessage) {
    return NextResponse.json({ reply: 'Message vide.', matched: false }, { status: 400 });
  }

  // SessionId : fourni par le client ou généré ici
  const sessionId = body.sessionId ?? crypto.randomUUID();
  const clientId  = body.clientId  ?? 'galerie44';
  const plan      = getPlan(clientId);

  // ── 0. Vérification limite mensuelle (fail open) ────────────────
  const limitReached = await isLimitReached(clientId, plan).catch(() => false);
  if (limitReached) {
    return NextResponse.json({
      reply: 'Je suis temporairement indisponible. Contactez-nous pour continuer à bénéficier du service.',
      matched: false,
    });
  }

  // ── 1. Feature flags ────────────────────────────────────────────
  // Réservations désactivées → réponse immédiate si la question y fait référence
  const RESERVATION_KEYWORDS = ['réservation', 'reservation', 'réserver', 'reserver', 'rendez-vous', 'rdv', 'calendly', 'booking', 'appointment'];
  if (!isEnabled(clientId, 'reservations') && RESERVATION_KEYWORDS.some((k) => userMessage.toLowerCase().includes(k))) {
    const msg = `Je ne gère pas encore les réservations en ligne. Contactez-nous directement au ${company.phone} pour fixer un rendez-vous.`;
    saveToDatabase(sessionId, clientId, userMessage, msg).catch(() => null);
    return NextResponse.json({ reply: msg, matched: false });
  }

  // ── 2. FAQ en priorité ──────────────────────────────────────────
  const faqResult = findAnswerInFaq(userMessage.toLowerCase());
  if (faqResult) {
    saveToDatabase(sessionId, clientId, userMessage, faqResult.answer).catch(() => null);
    incrementCounter(clientId).catch(() => null);
    return NextResponse.json({ reply: faqResult.answer, matched: true });
  }

  // ── 3. Fallback si pas de clé OpenAI ───────────────────────────
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-...')) {
    const fallback = `Je n'ai pas trouvé de réponse précise. Appelez-nous au ${company.phone}.`;
    saveToDatabase(sessionId, clientId, userMessage, fallback).catch(() => null);
    return NextResponse.json({ reply: fallback, matched: false });
  }

  // ── 4. GPT-4o-mini ──────────────────────────────────────────────
  const { products: allProducts, config } = loadClientData(clientId);
  // Catalogue désactivé → on n'injecte pas les produits dans le prompt
  const products = isEnabled(clientId, 'catalogue') ? allProducts : [];
  const systemPrompt = buildSystemPrompt(products, config);
  const history = (body.history ?? []).slice(-20);

  try {
    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',
      max_tokens:  500,
      temperature: 0.4,
      messages: [
        { role: 'system', content: systemPrompt },
        ...history,
        { role: 'user', content: userMessage },
      ],
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ??
      `Je n'ai pas de réponse. Appelez-nous au ${company.phone}.`;

    // Sauvegarde + comptage async
    saveToDatabase(sessionId, clientId, userMessage, reply).catch(() => null);
    incrementCounter(clientId).catch(() => null);

    const nearLimit = await isNearLimit(clientId, plan).catch(() => false);
    const res = NextResponse.json({ reply, matched: false });
    if (nearLimit) res.headers.set('X-Usage-Warning', 'true');
    return res;

  } catch (error: unknown) {
    // Gestion des erreurs OpenAI
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        const msg = `Notre assistant IA est momentanément indisponible. Appelez-nous au ${company.phone}.`;
        saveToDatabase(sessionId, clientId, userMessage, msg).catch(() => null);
        return NextResponse.json({ reply: msg, matched: false });
      }
      if (error.status === 408 || error.status === 503) {
        const msg = `La réponse prend trop de temps. Réessayez ou appelez le ${company.phone}.`;
        saveToDatabase(sessionId, clientId, userMessage, msg).catch(() => null);
        return NextResponse.json({ reply: msg, matched: false });
      }
    }
    console.error('[API /chat] Erreur inattendue :', error);
    return NextResponse.json(
      { reply: `Une erreur est survenue. Appelez-nous au ${company.phone}.`, matched: false },
      { status: 500 },
    );
  }
}

// ── Recherche FAQ ────────────────────────────────────────────────────
function findAnswerInFaq(message: string): { answer: string; id: string } | null {
  for (const item of faq) {
    for (const keyword of item.keywords) {
      if (message.includes(keyword)) {
        return { answer: item.answer, id: item.id };
      }
    }
  }
  return null;
}
