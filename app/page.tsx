import ChatWidget from '@/components/ChatWidget';
import company from '@/app/config/company';

/* ─────────────────────────────────────────────────────────────
   Icônes SVG inline — style trait fin, minimaliste
───────────────────────────────────────────────────────────── */
interface IconProps { className?: string; style?: React.CSSProperties }

function IconArmchair({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
      <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
      <path d="M5 18v2M19 18v2" />
    </svg>
  );
}

function IconLamp({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2h8l4 10H4L8 2Z" />
      <path d="M12 12v6" />
      <path d="M8 22h8" />
    </svg>
  );
}

function IconSparkles({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function IconTruck({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8Z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function IconBadge({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function IconTool({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconPhone({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconMapPin({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconCalendar({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   Données des sections
───────────────────────────────────────────────────────────── */
const COLLECTIONS = [
  {
    Icon: IconArmchair,
    titre: 'Mobilier vintage',
    desc: 'Assises, tables, rangements — une sélection rigoureuse de pièces authentiques des années 1950–1970.',
  },
  {
    Icon: IconLamp,
    titre: 'Luminaires',
    desc: 'Lampadaires, suspensions et lampes de bureau signés par les grands noms du design international.',
  },
  {
    Icon: IconSparkles,
    titre: 'Créations Galerie 44',
    desc: 'Notre collection sur-mesure, conçue dans l\'esprit du design vintage pour votre intérieur.',
  },
];

const ENGAGEMENTS = [
  { Icon: IconBadge, label: 'Authenticité certifiée', desc: 'Chaque pièce est vérifiée et garantie d\'époque' },
  { Icon: IconTool,  label: 'Restauration artisanale', desc: 'Remise en état par des artisans d\'art qualifiés' },
  { Icon: IconTruck, label: 'Livraison offerte', desc: 'Gratuite en France, expédition internationale disponible' },
];

const INFOS = [
  { Icon: IconMapPin,   label: 'Entrepôt 200m²',  valeur: 'Visite sur rendez-vous uniquement' },
  { Icon: IconCalendar, label: 'Disponibilité',    valeur: 'Lundi — Samedi, sur rendez-vous' },
  { Icon: IconPhone,    label: 'Téléphone',        valeur: company.phone },
];

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1c1c1c]">

      {/* ══ HEADER ════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-[#faf9f7]/90 backdrop-blur-sm border-b border-[#1c1c1c]/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1c1c1c] rounded flex items-center justify-center text-white font-bold text-sm tracking-widest">
              G
            </div>
            <div>
              <span className="font-bold text-sm tracking-wider uppercase">Galerie 44</span>
              <span className="hidden sm:inline text-xs text-[#1c1c1c]/50 ml-3">
                Design vintage 1950–1970
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-8 text-xs font-medium tracking-widest uppercase text-[#1c1c1c]/60">
            <a href="#" className="hover:text-[#1c1c1c] transition-colors">Collection</a>
            <a href="#" className="hover:text-[#1c1c1c] transition-colors">Designers</a>
            <a href="#" className="hover:text-[#1c1c1c] transition-colors">Blog</a>
            <a href="#" className="hover:text-[#1c1c1c] transition-colors">À propos</a>
          </nav>

          {/* CTA header */}
          <a
            href={`tel:${company.phone.replace(/\s/g, '')}`}
            className="hidden sm:flex items-center gap-2 text-xs font-medium border border-[#1c1c1c]/30 hover:border-[#1c1c1c] px-4 py-2 transition-colors"
          >
            <IconPhone className="w-3.5 h-3.5" />
            {company.phone}
          </a>
        </div>
      </header>

      {/* ══ BANDEAU PROMO ═════════════════════════════════════════ */}
      <div className="bg-[#1c1c1c] text-white text-center text-xs py-2.5 tracking-widest uppercase">
        Livraison gratuite en France métropolitaine · Authenticité garantie · Paiement sécurisé
      </div>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-2xl">

          {/* Label */}
          <p className="text-xs tracking-[0.3em] uppercase text-[#1c1c1c]/50 mb-6">
            Mobilier & Design · 1950 — 1970
          </p>

          {/* Titre */}
          <h1 className="text-5xl sm:text-6xl font-bold leading-[1.05] tracking-tight mb-8 text-[#1c1c1c]">
            L&apos;authenticité du<br />
            design au service<br />
            <span className="italic font-light">de votre intérieur.</span>
          </h1>

          {/* Description */}
          <p className="text-base text-[#1c1c1c]/60 leading-relaxed mb-10 max-w-lg">
            Depuis 2014, Galerie 44 sélectionne et restaure des pièces
            de mobilier vintage signées par les grands noms du design
            international — Charlotte Perriand, Eames, Arne Jacobsen.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button className="bg-[#1c1c1c] text-white text-sm font-medium tracking-wider px-7 py-3.5 hover:bg-[#333] active:scale-95 transition-all">
              Découvrir la collection
            </button>
            <button className="border border-[#1c1c1c]/40 text-[#1c1c1c] text-sm font-medium tracking-wider px-7 py-3.5 hover:border-[#1c1c1c] active:scale-95 transition-all">
              Prendre rendez-vous
            </button>
          </div>
        </div>
      </section>

      {/* ══ CHIFFRES CLÉS ═════════════════════════════════════════ */}
      <section className="border-t border-b border-[#1c1c1c]/10 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-[#1c1c1c]/10">
          {[
            { valeur: '+200', label: 'Pièces sélectionnées' },
            { valeur: '10 ans', label: 'D\'expertise vintage' },
            { valeur: '100%', label: 'Authenticité garantie' },
          ].map(({ valeur, label }) => (
            <div key={label} className="text-center px-4 py-2">
              <div className="text-3xl font-bold tracking-tight text-[#1c1c1c]">{valeur}</div>
              <div className="text-xs text-[#1c1c1c]/50 mt-1 tracking-wide uppercase">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ COLLECTIONS ═══════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-[#1c1c1c]/40 mb-3">Nos univers</p>
          <h2 className="text-3xl font-bold tracking-tight">Collections</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {COLLECTIONS.map(({ Icon, titre, desc }) => (
            <div
              key={titre}
              className="group border border-[#1c1c1c]/10 bg-white p-8 hover:border-[#1c1c1c]/40 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              {/* Icône */}
              <div className="w-10 h-10 flex items-center justify-center mb-6 bg-[#f5f3ef]">
                <Icon className="w-5 h-5 text-[#1c1c1c]" />
              </div>

              <h3 className="font-semibold text-sm tracking-wide mb-3">{titre}</h3>
              <p className="text-xs text-[#1c1c1c]/55 leading-relaxed">{desc}</p>

              {/* Flèche au survol */}
              <div className="mt-6 flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-[#1c1c1c]/40 group-hover:text-[#1c1c1c] transition-colors">
                Voir la collection
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ NOS ENGAGEMENTS ═══════════════════════════════════════ */}
      <section className="bg-[#1c1c1c] text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">Nos promesses</p>
            <h2 className="text-3xl font-bold tracking-tight">Nos engagements</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {ENGAGEMENTS.map(({ Icon, label, desc }) => (
              <div key={label} className="flex gap-5">
                <div className="w-10 h-10 border border-white/20 flex-shrink-0 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-white/70" />
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1.5">{label}</div>
                  <div className="text-xs text-white/50 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ INFOS PRATIQUES ═══════════════════════════════════════ */}
      <section className="bg-white border-t border-[#1c1c1c]/10">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {INFOS.map(({ Icon, label, valeur }) => (
            <div key={label} className="flex gap-4">
              <div className="w-9 h-9 border border-[#1c1c1c]/15 flex-shrink-0 flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#1c1c1c]/60" />
              </div>
              <div>
                <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1c1c1c]/40 mb-1">
                  {label}
                </div>
                <div className="text-sm text-[#1c1c1c]">{valeur}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════ */}
      <footer className="border-t border-[#1c1c1c]/10 bg-[#faf9f7]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#1c1c1c]/40 tracking-wide">
          <span>© 2026 Galerie 44 — Tous droits réservés</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#1c1c1c] transition-colors">Conditions de vente</a>
            <a href="#" className="hover:text-[#1c1c1c] transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-[#1c1c1c] transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* ══ WIDGET CHAT ═══════════════════════════════════════════ */}
      <ChatWidget />

    </div>
  );
}
