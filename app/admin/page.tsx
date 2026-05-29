'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

// ── Types ────────────────────────────────────────────────────────────

interface Stats {
  totalConversations: number;
  conversationsToday: number;
  totalMessages:      number;
  messagesThisWeek:   number;
  activity:           { date: string; count: number }[];
  topQuestions:       string[];
  usageCount:         number;
  usageLimit:         number | null;
  usagePercent:       number;
}

interface Message {
  id:        string;
  role:      string;
  content:   string;
  createdAt: string;
}

interface Conversation {
  id:        string;
  clientId:  string;
  sessionId: string;
  createdAt: string;
  messages:  Message[];
}

// ── Carte stat ───────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ── Page principale ──────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats]             = useState<Stats | null>(null);
  const [conversations, setConvs]     = useState<Conversation[]>([]);
  const [loadingStats, setLoadingS]   = useState(true);
  const [loadingConvs, setLoadingC]   = useState(true);
  const [errorStats, setErrorS]       = useState<string | null>(null);
  const [errorConvs, setErrorC]       = useState<string | null>(null);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(async (r) => {
        const data = await r.json() as Stats & { error?: string };
        if (!r.ok || data.error) throw new Error(data.error ?? 'Erreur stats');
        setStats(data);
      })
      .catch((e: Error) => setErrorS(e.message))
      .finally(() => setLoadingS(false));

    fetch('/api/admin/conversations')
      .then(async (r) => {
        const data = await r.json() as { conversations: Conversation[]; error?: string };
        if (!r.ok || data.error) throw new Error(data.error ?? 'Erreur conversations');
        setConvs(data.conversations);
      })
      .catch((e: Error) => setErrorC(e.message))
      .finally(() => setLoadingC(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── En-tête ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-sm text-gray-500 mt-0.5">Vue d&apos;ensemble de ton chatbot</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Retour au site
            </a>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* ── Cartes stats ─────────────────────────────────────────── */}
        {loadingStats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        ) : errorStats ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            ⚠ Erreur stats : {errorStats}
          </div>
        ) : stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total conversations" value={stats.totalConversations} sub="depuis le début" />
            <StatCard label="Aujourd'hui"         value={stats.conversationsToday} sub="conversations" />
            <StatCard label="Total messages"      value={stats.totalMessages}      sub="échanges" />
            <StatCard label="Cette semaine"       value={stats.messagesThisWeek}   sub="messages" />
          </div>
        )}

        {/* ── Usage mensuel ────────────────────────────────────────── */}
        {stats && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Usage ce mois</h2>
              <span className="text-sm text-gray-500">
                {stats.usageCount.toLocaleString('fr-FR')}
                {stats.usageLimit !== null
                  ? ` / ${stats.usageLimit.toLocaleString('fr-FR')} conversations`
                  : ' conversations (illimité)'}
              </span>
            </div>
            {stats.usageLimit !== null && (
              <>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{
                      width:           `${Math.min(stats.usagePercent, 100)}%`,
                      backgroundColor: stats.usagePercent > 80
                        ? '#ef4444'
                        : stats.usagePercent >= 60
                          ? '#f97316'
                          : '#22c55e',
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">{stats.usagePercent}% utilisé</p>
              </>
            )}
          </div>
        )}

        {/* ── Graphique 7 jours ────────────────────────────────────── */}
        {stats && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Activité — 7 derniers jours</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats.activity} barSize={32}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide allowDecimals={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  cursor={{ fill: '#f9fafb' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.activity.map((_, i) => (
                    <Cell key={i} fill={_ .count > 0 ? '#111827' : '#e5e7eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── Top questions ────────────────────────────────────────── */}
        {stats && stats.topQuestions.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Questions les plus courtes</h2>
            <ol className="space-y-2">
              {stats.topQuestions.map((q, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="truncate">{q}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* ── Liste des conversations ──────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Dernières conversations
          </h2>

          {loadingConvs ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-4 py-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : errorConvs ? (
            <p className="text-sm text-red-500">⚠ {errorConvs}</p>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune conversation enregistrée.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {conversations.map((conv) => {
                const firstMsg = conv.messages.find((m) => m.role === 'user')?.content ?? '—';
                const date     = new Date(conv.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                });
                return (
                  <div key={conv.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 truncate">{firstMsg}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {conv.messages.length} message{conv.messages.length > 1 ? 's' : ''} · {conv.clientId}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0">{date}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
