import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { createdAt: 'desc' },
      take:    20,
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('[API /admin/conversations]', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des conversations.' }, { status: 500 });
  }
}
