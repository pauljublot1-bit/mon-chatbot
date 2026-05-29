import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPlan, getMonthlyLimit } from '@/lib/features';
import { getCurrentMonth } from '@/lib/usage';

export async function GET() {
  try {
    const now   = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Compteurs principaux
    const [totalConversations, conversationsToday, totalMessages, messagesThisWeek] =
      await Promise.all([
        prisma.conversation.count(),
        prisma.conversation.count({ where: { createdAt: { gte: today } } }),
        prisma.message.count(),
        prisma.message.count({ where: { createdAt: { gte: weekAgo } } }),
      ]);

    // Activité sur 7 jours
    const activity = await Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const d    = new Date(today);
        d.setDate(d.getDate() - (6 - i));
        const next = new Date(d);
        next.setDate(d.getDate() + 1);
        return prisma.conversation
          .count({ where: { createdAt: { gte: d, lt: next } } })
          .then((count) => ({
            date:  d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
            count,
          }));
      }),
    );

    // Top 5 questions les plus courtes (proxy pour questions fréquentes)
    const userMessages = await prisma.message.findMany({
      where:  { role: 'user' },
      select: { content: true },
      take:   100,
    });
    const topQuestions = userMessages
      .sort((a, b) => a.content.length - b.content.length)
      .slice(0, 5)
      .map((m) => m.content);

    // Usage mensuel pour le client par défaut
    const clientId   = 'galerie44';
    const plan       = getPlan(clientId);
    const limit      = getMonthlyLimit(plan);
    const counter    = await prisma.usageCounter.findUnique({ where: { clientId } });
    const usageCount = counter?.month === getCurrentMonth() ? counter.count : 0;
    const usageLimit = isFinite(limit) ? limit : null;
    const usagePercent = usageLimit ? Math.round((usageCount / usageLimit) * 100) : 0;

    return NextResponse.json({
      totalConversations,
      conversationsToday,
      totalMessages,
      messagesThisWeek,
      activity,
      topQuestions,
      usageCount,
      usageLimit,
      usagePercent,
    });
  } catch (error) {
    console.error('[API /admin/stats]', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des stats.' }, { status: 500 });
  }
}
