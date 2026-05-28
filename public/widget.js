/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                  CHATBOT WIDGET — widget.js                     ║
 * ╠══════════════════════════════════════════════════════════════════╣
 * ║  Script à coller sur n'importe quel site (WordPress, Wix...)    ║
 * ║                                                                  ║
 * ║  USAGE :                                                         ║
 * ║  <script                                                         ║
 * ║    src="https://VOTRE_URL.vercel.app/widget.js"                 ║
 * ║    data-url="https://VOTRE_URL.vercel.app"                      ║
 * ║    data-color="#1c1c1c"                                          ║
 * ║  ></script>                                                      ║
 * ║                                                                  ║
 * ║  PARAMÈTRES (attributs data-*) :                                 ║
 * ║  • data-url   → URL de déploiement Vercel (obligatoire)         ║
 * ║  • data-color → Couleur du bouton en hex (optionnel)            ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

(function (w, d) {
  'use strict';

  // ── 1. Lecture de la configuration depuis les attributs du script ──
  var script = d.currentScript || d.querySelector('script[data-url]');
  var BASE_URL     = (script && script.getAttribute('data-url'))   || 'https://VOTRE_URL.vercel.app';
  var PRIMARY_COLOR = (script && script.getAttribute('data-color')) || '#1c1c1c';
  var CHAT_URL     = BASE_URL + '/chat';

  // ── 2. Injection des styles CSS ────────────────────────────────────
  var css = '\
    /* ── Bouton flottant ── */\
    #__cb-btn {\
      position: fixed;\
      bottom: 24px;\
      right: 24px;\
      z-index: 2147483646;\
      width: 56px;\
      height: 56px;\
      border-radius: 50%;\
      background: ' + PRIMARY_COLOR + ';\
      border: none;\
      cursor: pointer;\
      box-shadow: 0 4px 24px rgba(0,0,0,0.22);\
      display: flex;\
      align-items: center;\
      justify-content: center;\
      transition: transform 0.2s ease, box-shadow 0.2s ease;\
      outline: none;\
      font-family: sans-serif;\
    }\
    #__cb-btn:hover  { transform: scale(1.1); box-shadow: 0 6px 28px rgba(0,0,0,0.28); }\
    #__cb-btn:active { transform: scale(0.94); }\
    \
    /* ── Badge rouge de notification ── */\
    #__cb-badge {\
      position: absolute;\
      top: -4px;\
      right: -4px;\
      width: 20px;\
      height: 20px;\
      background: #ef4444;\
      border-radius: 50%;\
      color: #fff;\
      font-size: 11px;\
      font-weight: 700;\
      display: flex;\
      align-items: center;\
      justify-content: center;\
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);\
      animation: __cb-pulse 2s infinite;\
    }\
    @keyframes __cb-pulse {\
      0%, 100% { opacity: 1; }\
      50%       { opacity: 0.6; }\
    }\
    \
    /* ── Backdrop (fond sombre mobile) ── */\
    #__cb-backdrop {\
      position: fixed;\
      inset: 0;\
      z-index: 2147483644;\
      background: rgba(0,0,0,0.45);\
      transition: opacity 0.3s ease;\
      opacity: 0;\
      pointer-events: none;\
    }\
    #__cb-backdrop.open {\
      opacity: 1;\
      pointer-events: auto;\
    }\
    @media (min-width: 640px) {\
      #__cb-backdrop { display: none; }\
    }\
    \
    /* ── Conteneur de la fenêtre de chat ── */\
    #__cb-wrap {\
      position: fixed;\
      z-index: 2147483645;\
      overflow: hidden;\
      background: #fff;\
      box-shadow: 0 8px 48px rgba(0,0,0,0.18);\
      transition: transform 0.3s ease, opacity 0.3s ease;\
      \
      /* Mobile : bottom sheet (plein écran depuis le bas) */\
      bottom: 0;\
      left: 0;\
      right: 0;\
      height: 90dvh;\
      height: 90vh; /* Fallback si dvh non supporté */\
      border-radius: 24px 24px 0 0;\
      transform: translateY(100%);\
      opacity: 0;\
      pointer-events: none;\
    }\
    #__cb-wrap.open {\
      transform: translateY(0);\
      opacity: 1;\
      pointer-events: auto;\
    }\
    \
    /* Desktop : popup au-dessus du bouton */\
    @media (min-width: 640px) {\
      #__cb-wrap {\
        bottom: 90px;\
        right: 24px;\
        left: auto;\
        width: 384px;\
        height: 560px;\
        border-radius: 16px;\
        transform: translateY(16px) scale(0.95);\
      }\
      #__cb-wrap.open {\
        transform: translateY(0) scale(1);\
      }\
    }\
    \
    /* ── Iframe sans bordure ── */\
    #__cb-iframe {\
      width: 100%;\
      height: 100%;\
      border: none;\
      display: block;\
    }\
    \
    /* ── Poignée (mobile uniquement, en haut du sheet) ── */\
    #__cb-handle {\
      position: absolute;\
      top: 10px;\
      left: 50%;\
      transform: translateX(-50%);\
      width: 36px;\
      height: 4px;\
      border-radius: 9999px;\
      background: rgba(0,0,0,0.15);\
      z-index: 1;\
    }\
    @media (min-width: 640px) {\
      #__cb-handle { display: none; }\
    }\
  ';

  var styleEl = d.createElement('style');
  styleEl.id  = '__cb-styles';
  styleEl.textContent = css;
  d.head.appendChild(styleEl);

  // ── 3. Création des éléments DOM ───────────────────────────────────

  /* Backdrop mobile */
  var backdrop = d.createElement('div');
  backdrop.id  = '__cb-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');

  /* Conteneur du chat */
  var wrap = d.createElement('div');
  wrap.id  = '__cb-wrap';
  wrap.setAttribute('role', 'dialog');
  wrap.setAttribute('aria-modal', 'true');
  wrap.setAttribute('aria-label', 'Assistant virtuel');

  /* Poignée visuelle (mobile) */
  var handle = d.createElement('div');
  handle.id  = '__cb-handle';
  wrap.appendChild(handle);

  /* Iframe → charge /chat depuis le serveur Vercel */
  var iframe = d.createElement('iframe');
  iframe.id    = '__cb-iframe';
  iframe.title = 'Assistant virtuel';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('allow', 'clipboard-write');
  /* L'iframe est chargée au premier clic pour ne pas ralentir le site */
  wrap.appendChild(iframe);

  /* Bouton flottant */
  var btn = d.createElement('button');
  btn.id = '__cb-btn';
  btn.setAttribute('aria-label', 'Ouvrir le chat');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', '__cb-wrap');

  /* Icône bulle de chat */
  btn.innerHTML =
    '<div id="__cb-badge">1</div>' +
    '<svg id="__cb-ico-open" width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">' +
      '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>' +
    '</svg>' +
    '<svg id="__cb-ico-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" style="display:none" aria-hidden="true">' +
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
    '</svg>';

  /* Ajout dans le DOM */
  d.body.appendChild(backdrop);
  d.body.appendChild(wrap);
  d.body.appendChild(btn);

  // ── 4. Logique d'ouverture / fermeture ─────────────────────────────
  var isOpen       = false;
  var iframeLoaded = false;
  var badgeVisible = true;

  function open() {
    isOpen = true;

    /* Charge l'iframe au premier clic seulement (lazy) */
    if (!iframeLoaded) {
      iframe.src   = CHAT_URL;
      iframeLoaded = true;
    }

    wrap.classList.add('open');
    backdrop.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Fermer le chat');
    d.getElementById('__cb-ico-open').style.display  = 'none';
    d.getElementById('__cb-ico-close').style.display = 'block';

    /* Masque le badge rouge */
    if (badgeVisible) {
      badgeVisible = false;
      var badge = d.getElementById('__cb-badge');
      if (badge) badge.style.display = 'none';
    }

    /* Bloque le scroll de la page en arrière-plan (mobile) */
    if (w.innerWidth < 640) d.body.style.overflow = 'hidden';
  }

  function close() {
    isOpen = false;

    wrap.classList.remove('open');
    backdrop.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Ouvrir le chat');
    d.getElementById('__cb-ico-open').style.display  = 'block';
    d.getElementById('__cb-ico-close').style.display = 'none';

    d.body.style.overflow = '';
  }

  function toggle() { isOpen ? close() : open(); }

  /* Événements */
  btn.addEventListener('click', toggle);
  backdrop.addEventListener('click', close);

  /* Fermeture avec la touche Échap */
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) close();
  });

  // ── 5. Exposition de l'API publique (optionnel) ────────────────────
  /**
   * Permet à d'autres scripts du site d'interagir avec le widget :
   *   window.ChatbotWidget.open()
   *   window.ChatbotWidget.close()
   *   window.ChatbotWidget.toggle()
   */
  w.ChatbotWidget = { open: open, close: close, toggle: toggle };

}(window, document));
