import { prisma } from '@/lib/prisma';
import type { Plan } from '@/types/features';
import { getMonthlyLimit } from '@/lib/features';

/** Retourne le mois courant au format "YYYY-MM". */
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * Récupère ou crée le compteur du mois en cours pour un client.
 * Si le mois stocké est différent du mois actuel, remet count à 0.
 * Retourne null en cas d'erreur (fail open).
 */
export async function getOrCreateCounter(clientId: string) {
  try {
    const currentMonth = getCurrentMonth();
    const existing = await prisma.usageCounter.findUnique({ where: { clientId } });

    if (!existing) {
      return await prisma.usageCounter.create({
        data: { clientId, month: currentMonth, count: 0 },
      });
    }

    if (existing.month !== currentMonth) {
      return await prisma.usageCounter.update({
        where: { clientId },
        data:  { month: currentMonth, count: 0 },
      });
    }

    return existing;
  } catch (error) {
    console.error('[usage] getOrCreateCounter:', error);
    return null;
  }
}

/**
 * Incrémente le compteur de 1.
 * Gère la remise à zéro si le mois a changé.
 * Ne lève jamais d'exception.
 */
export async function incrementCounter(clientId: string): Promise<void> {
  try {
    const currentMonth = getCurrentMonth();
    const existing = await prisma.usageCounter.findUnique({ where: { clientId } });

    if (existing && existing.month !== currentMonth) {
      await prisma.usageCounter.update({
        where: { clientId },
        data:  { month: currentMonth, count: 1 },
      });
    } else {
      await prisma.usageCounter.upsert({
        where:  { clientId },
        update: { count: { increment: 1 } },
        create: { clientId, month: currentMonth, count: 1 },
      });
    }
  } catch (error) {
    console.error('[usage] incrementCounter:', error);
  }
}

/**
 * Retourne true si la limite mensuelle est atteinte.
 * En cas d'erreur, retourne false (fail open — ne bloque pas l'utilisateur).
 */
export async function isLimitReached(clientId: string, plan: Plan): Promise<boolean> {
  try {
    const counter = await getOrCreateCounter(clientId);
    if (!counter) return false;
    const limit = getMonthlyLimit(plan);
    return counter.count >= limit;
  } catch {
    return false;
  }
}

/**
 * Retourne true si l'usage dépasse 80% de la limite.
 * En cas d'erreur, retourne false.
 */
export async function isNearLimit(clientId: string, plan: Plan): Promise<boolean> {
  try {
    const counter = await getOrCreateCounter(clientId);
    if (!counter) return false;
    const limit = getMonthlyLimit(plan);
    if (!isFinite(limit)) return false;
    return counter.count >= limit * 0.8;
  } catch {
    return false;
  }
}
