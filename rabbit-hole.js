/*  Satoshi PWA — Rabbit Hole: Guided Journey + Hidden Rabbits
 *  "Follow the White Rabbit" — geführte Reise durch den Bitcoin-Kaninchenbau
 *  Separate Datei, selbstinitialisierend, nutzt Globals aus index.html
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
   *  JOURNEY PATH — 39 Module in logischer Lernreihenfolge
   * ══════════════════════════════════════════════════════════════ */

  var CHAPTERS = [
    {
      id: 'down',
      title: 'Down the Rabbit Hole',
      subtitle: 'Du betrittst den Kaninchenbau. Alles beginnt mit einer einfachen Frage: Was ist Geld?',
      emoji: '🕳️',
      color: 'var(--green)',
      keys: [
        'geld', 'inflation', 'analogien', 'kaufen', 'dos',
        'relai', 'alltag', 'rechner', 'lexikon', 'literatur',
        'medien', 'kultur'
      ]
    },
    {
      id: 'looking-glass',
      title: 'Through the Looking Glass',
      subtitle: 'Die Welt sieht anders aus, wenn man versteht, wie Bitcoin wirklich funktioniert.',
      emoji: '🪞',
      color: 'var(--gold)',
      keys: [
        'oekonomie', 'psychologie', 'blockchain', 'mining', 'nodes',
        'lightning', 'satoshi', 'chronologie', 'schweiz', 'weltweit',
        'sicherheit', 'regulierung', 'institutionen', 'zyklen',
        'feargreed', 'stacking'
      ]
    },
    {
      id: 'mad-hatter',
      title: 'The Mad Hatter\'s Tea Party',
      subtitle: 'Willkommen bei den Experten. Hier wird nichts mehr einfach geglaubt — hier wird verifiziert.',
      emoji: '🎩',
      color: '#8b5cf6',
      keys: [
        'whitepaper', 'krypto', 'energie', 'netzwerk', 'layer2',
        'onchain', 'entwicklung', 'cbdc', 'vergleich', 'news', 'social'
      ]
    }
  ];

  /* Flat ordered list of all module keys */
  var JOURNEY_KEYS = [];
  CHAPTERS.forEach(function (ch) {
    ch.keys.forEach(function (k) { JOURNEY_KEYS.push(k); });
  });

  /* Reward per module completion in the journey */
  var STEP_REWARD = 1500000; // 1,500,000 sats × 39 = 58,500,000

  /* Map module key → short teaser */
  var MODULE_TEASERS = {
    geld: 'Was ist Geld — und warum verliert es an Wert?',
    inflation: 'Warum dein Geld jedes Jahr weniger wert wird',
    analogien: 'Bitcoin erklärt mit Alltagsvergleichen',
    kaufen: 'Deine ersten Satoshis — so geht\'s',
    dos: 'Die goldenen Regeln für Bitcoin-Besitzer',
    relai: 'Bitcoin kaufen in der Schweiz — einfach erklärt',
    alltag: 'Bitcoin im täglichen Leben nutzen',
    rechner: 'Was wäre wenn? Rechner & Simulationen',
    lexikon: 'Die wichtigsten Bitcoin-Begriffe auf einen Blick',
    literatur: 'Die besten Bücher, Podcasts & Filme',
    medien: 'Podcasts, Videos & Kanäle für Bitcoin-Wissen',
    kultur: 'Memes, Musik & die Bitcoin-Community',
    oekonomie: 'Österreichische Schule, hartes Geld & Spieltheorie',
    psychologie: 'Warum die meisten zu spät kaufen',
    blockchain: 'Blöcke, Hashes, Merkle Trees — die Technik',
    mining: 'Wie neue Bitcoins entstehen',
    nodes: 'Das Rückgrat des Netzwerks',
    lightning: 'Sofortige Zahlungen für Centbeträge',
    satoshi: 'Wer hat Bitcoin erfunden?',
    chronologie: 'Die Geschichte von 2008 bis heute',
    schweiz: 'Bitcoin in der Schweiz & DACH-Region',
    weltweit: 'Bitcoin rund um den Globus',
    sicherheit: 'Deine Coins richtig schützen',
    regulierung: 'Steuern, Gesetze & Vorschriften',
    institutionen: 'ETFs, MicroStrategy & Wall Street',
    zyklen: 'Halvings, Stock-to-Flow & Preismodelle',
    feargreed: 'Marktstimmung in Echtzeit',
    stacking: 'Gamification — sammle Satoshis',
    whitepaper: 'Satoshis Meisterwerk — 9 Seiten, die alles veränderten',
    krypto: 'Von Caesar bis Elliptic Curves',
    energie: 'Verbraucht Bitcoin wirklich zu viel Strom?',
    netzwerk: 'Live-Daten: Hashrate, Nodes, Mempool',
    layer2: 'Lightning, Liquid, Sidechains & mehr',
    onchain: 'UTXO-Analyse, Whale-Watching & Metriken',
    entwicklung: 'BIPs, Forks & die Zukunft von Bitcoin',
    cbdc: 'Digitaler Euro vs. Bitcoin',
    vergleich: 'Bitcoin vs. Altcoins — Fakten statt Hype',
    news: 'Die neuesten Bitcoin-Nachrichten',
    social: 'Bitcoin auf X / Twitter'
  };

  /* ══════════════════════════════════════════════════════════════
   *  HIDDEN WHITE RABBITS — 39 versteckte Kaninchen in allen Modulen
   *  500,000 sats each × 39 = 19,500,000
   * ══════════════════════════════════════════════════════════════ */

  var HIDDEN_RABBITS = [
    { id: 'rb_geld', screen: 'geld', reward: 500000 },
    { id: 'rb_inflation', screen: 'inflation', reward: 500000 },
    { id: 'rb_oekonomie', screen: 'oekonomie', reward: 500000 },
    { id: 'rb_analogien', screen: 'analogien', reward: 500000 },
    { id: 'rb_satoshi', screen: 'satoshi', reward: 500000 },
    { id: 'rb_blockchain', screen: 'blockchain', reward: 500000 },
    { id: 'rb_whitepaper', screen: 'whitepaper', reward: 500000 },
    { id: 'rb_vergleich', screen: 'vergleich', reward: 500000 },
    { id: 'rb_schweiz', screen: 'schweiz', reward: 500000 },
    { id: 'rb_kaufen', screen: 'kaufen', reward: 500000 },
    { id: 'rb_dos', screen: 'dos', reward: 500000 },
    { id: 'rb_lexikon', screen: 'lexikon', reward: 500000 },
    { id: 'rb_literatur', screen: 'literatur', reward: 500000 },
    { id: 'rb_krypto', screen: 'krypto', reward: 500000 },
    { id: 'rb_weltweit', screen: 'weltweit', reward: 500000 },
    { id: 'rb_feargreed', screen: 'feargreed', reward: 500000 },
    { id: 'rb_stacking', screen: 'stacking', reward: 500000 },
    { id: 'rb_medien', screen: 'medien', reward: 500000 },
    { id: 'rb_news', screen: 'news', reward: 500000 },
    { id: 'rb_mining', screen: 'mining', reward: 500000 },
    { id: 'rb_nodes', screen: 'nodes', reward: 500000 },
    { id: 'rb_lightning', screen: 'lightning', reward: 500000 },
    { id: 'rb_chronologie', screen: 'chronologie', reward: 500000 },
    { id: 'rb_sicherheit', screen: 'sicherheit', reward: 500000 },
    { id: 'rb_regulierung', screen: 'regulierung', reward: 500000 },
    { id: 'rb_institutionen', screen: 'institutionen', reward: 500000 },
    { id: 'rb_zyklen', screen: 'zyklen', reward: 500000 },
    { id: 'rb_alltag', screen: 'alltag', reward: 500000 },
    { id: 'rb_relai', screen: 'relai', reward: 500000 },
    { id: 'rb_rechner', screen: 'rechner', reward: 500000 },
    { id: 'rb_kultur', screen: 'kultur', reward: 500000 },
    { id: 'rb_psychologie', screen: 'psychologie', reward: 500000 },
    { id: 'rb_energie', screen: 'energie', reward: 500000 },
    { id: 'rb_netzwerk', screen: 'netzwerk', reward: 500000 },
    { id: 'rb_layer2', screen: 'layer2', reward: 500000 },
    { id: 'rb_onchain', screen: 'onchain', reward: 500000 },
    { id: 'rb_entwicklung', screen: 'entwicklung', reward: 500000 },
    { id: 'rb_cbdc', screen: 'cbdc', reward: 500000 },
    { id: 'rb_social', screen: 'social', reward: 500000 }
  ];

  /* ══════════════════════════════════════════════════════════════
   *  STATE MANAGEMENT — localStorage
   * ══════════════════════════════════════════════════════════════ */

  var STATE_KEY = 'rabbitHole';
  var RABBITS_KEY = 'foundRabbits';
  var state;
  var foundRabbits = [];

  function loadState() {
    try {
      state = JSON.parse(localStorage.getItem(STATE_KEY) || 'null');
      if (state && typeof state === 'object' && Array.isArray(state.completedSteps)) {
        // valid
      } else {
        state = null;
      }
    } catch (e) { state = null; }
    try {
      foundRabbits = JSON.parse(localStorage.getItem(RABBITS_KEY) || '[]');
      if (!Array.isArray(foundRabbits)) foundRabbits = [];
    } catch (e) { foundRabbits = []; }
  }

  function defaultState() {
    return {
      active: true,
      currentStep: 0,
      completedSteps: [],
      rewardedSteps: [],
      startedAt: Date.now(),
      lastVisitedAt: Date.now()
    };
  }

  function saveState() {
    if (!state) return;
    state.lastVisitedAt = Date.now();
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  function saveRabbits() {
    localStorage.setItem(RABBITS_KEY, JSON.stringify(foundRabbits));
  }

  function isActive() { return state && state.active; }

  /* ══════════════════════════════════════════════════════════════
   *  HELPERS
   * ══════════════════════════════════════════════════════════════ */

  function getModuleByKey(key) {
    if (typeof MODULES === 'undefined') return null;
    return MODULES.find(function (m) { return m.key === key; }) || null;
  }

  function getChapterForStep(stepIndex) {
    var count = 0;
    for (var i = 0; i < CHAPTERS.length; i++) {
      count += CHAPTERS[i].keys.length;
      if (stepIndex < count) return { chapter: CHAPTERS[i], index: i };
    }
    return { chapter: CHAPTERS[CHAPTERS.length - 1], index: CHAPTERS.length - 1 };
  }

  function getStepGlobalIndex(key) {
    return JOURNEY_KEYS.indexOf(key);
  }

  function isStepCompleted(stepIndex) {
    return state && state.completedSteps.indexOf(stepIndex) !== -1;
  }

  function getProgress() {
    if (!state) return { done: 0, total: JOURNEY_KEYS.length, pct: 0 };
    var done = state.completedSteps.length;
    var total = JOURNEY_KEYS.length;
    return { done: done, total: total, pct: Math.round((done / total) * 100) };
  }

  function getRabbitProgress() {
    return { done: foundRabbits.length, total: HIDDEN_RABBITS.length, pct: Math.round((foundRabbits.length / HIDDEN_RABBITS.length) * 100) };
  }

  function escHtml(s) {
    return typeof escapeHtml === 'function' ? escapeHtml(s) : s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function fmtNum(n) {
    return typeof formatNumber === 'function' ? formatNumber(n) : n.toLocaleString('de-CH');
  }

  /* ══════════════════════════════════════════════════════════════
   *  CSS INJECTION
   * ══════════════════════════════════════════════════════════════ */

  function injectCSS() {
    var style = document.createElement('style');
    style.textContent = [
      /* Floating Rabbit Button */
      '.rabbit-fab{position:fixed;bottom:calc(var(--nav-height,56px) + env(safe-area-inset-bottom,0px) + 72px);right:16px;z-index:998;width:48px;height:48px;border-radius:50%;background:var(--surface);border:2px solid var(--gold);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.4);transition:transform 0.2s,box-shadow 0.2s;-webkit-tap-highlight-color:transparent}',
      '.rabbit-fab:hover,.rabbit-fab:active{transform:scale(1.08);box-shadow:0 6px 24px rgba(247,183,49,0.3)}',
      '.rabbit-fab .rabbit-emoji{font-size:1.5rem;line-height:1}',
      '.rabbit-fab-ring{position:absolute;top:-3px;left:-3px;width:52px;height:52px}',
      '.rabbit-fab-ring circle{fill:none;stroke-width:3;stroke-linecap:round;transform:rotate(-90deg);transform-origin:50% 50%}',
      '.rabbit-fab .rabbit-step-badge{position:absolute;top:-6px;right:-10px;background:var(--gold);color:var(--bg);font-size:0.6rem;font-weight:700;min-width:20px;height:18px;padding:0 5px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);white-space:nowrap}',

      /* Pulse */
      '@keyframes rabbitPulse{0%,100%{box-shadow:0 4px 20px rgba(0,0,0,0.4)}50%{box-shadow:0 4px 24px rgba(247,183,49,0.5)}}',
      '.rabbit-fab.has-next{animation:rabbitPulse 2.5s ease-in-out infinite}',

      /* Journey Overview Screen */
      '.rabbit-hero{text-align:center;padding:32px 20px 16px}',
      '.rabbit-hero-emoji{font-size:3rem;display:block;margin-bottom:8px}',
      '.rabbit-hero h1{font-size:1.6rem;font-weight:800;color:var(--text)}',
      '.rabbit-hero h1 .gold{color:var(--gold)}',
      '.rabbit-hero-sub{color:var(--muted);font-size:var(--text-sm);margin-top:6px;line-height:1.5}',

      /* Progress bar */
      '.rabbit-progress-bar{margin:0 20px 24px;height:6px;background:var(--surface);border-radius:3px;overflow:hidden}',
      '.rabbit-progress-fill{height:100%;background:linear-gradient(90deg,var(--green),var(--gold),#8b5cf6);border-radius:3px;transition:width 0.6s ease}',
      '.rabbit-progress-label{text-align:center;font-size:var(--text-xs);color:var(--muted);margin-bottom:20px;font-family:var(--font-mono)}',

      /* Chapter blocks */
      '.rabbit-chapter{margin:0 16px 8px;padding:16px;background:var(--surface);border-radius:var(--radius);border-left:3px solid var(--muted)}',
      '.rabbit-chapter.active{border-left-color:var(--gold)}',
      '.rabbit-chapter.done{border-left-color:var(--green)}',
      '.rabbit-chapter-head{display:flex;align-items:center;gap:10px;cursor:pointer;-webkit-tap-highlight-color:transparent}',
      '.rabbit-chapter-emoji{font-size:1.4rem}',
      '.rabbit-chapter-title{font-weight:700;font-size:var(--text-sm);color:var(--text)}',
      '.rabbit-chapter-count{margin-left:auto;font-size:var(--text-xs);color:var(--muted);font-family:var(--font-mono)}',
      '.rabbit-chapter-sub{color:var(--muted);font-size:var(--text-xs);margin-top:6px;line-height:1.4;font-style:italic}',
      '.rabbit-chapter-steps{margin-top:12px}',

      /* Steps */
      '.rabbit-step{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:opacity 0.2s}',
      '.rabbit-step:last-child{border-bottom:none}',
      '.rabbit-step-icon{font-size:1.1rem;width:28px;text-align:center;flex-shrink:0}',
      '.rabbit-step-info{flex:1;min-width:0}',
      '.rabbit-step-name{font-size:var(--text-sm);font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.rabbit-step-teaser{font-size:var(--text-xs);color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}',
      '.rabbit-step-status{flex-shrink:0;width:24px;text-align:center;font-size:0.85rem}',
      '.rabbit-step.completed .rabbit-step-name{color:var(--green)}',
      '.rabbit-step.current{background:rgba(247,183,49,0.06);margin:0 -12px;padding:10px 12px;border-radius:var(--radius-sm)}',
      '.rabbit-step.current .rabbit-step-name{color:var(--gold)}',
      '.rabbit-step.future{opacity:0.5}',
      '.rabbit-step-reward{font-size:var(--text-xs);color:var(--gold);font-family:var(--font-mono)}',

      /* Buttons */
      '.rabbit-actions{padding:20px 16px 32px;text-align:center;display:flex;gap:10px;justify-content:center;flex-wrap:wrap}',
      '.rabbit-btn{display:inline-block;padding:12px 28px;border-radius:var(--radius-sm);font-size:var(--text-sm);font-weight:700;cursor:pointer;border:none;transition:all 0.2s;-webkit-tap-highlight-color:transparent}',
      '.rabbit-btn-primary{background:var(--gold);color:var(--bg)}',
      '.rabbit-btn-primary:hover{filter:brightness(1.1)}',
      '.rabbit-btn-secondary{background:var(--surface);color:var(--text);border:1px solid rgba(255,255,255,0.1)}',
      '.rabbit-btn-secondary:hover{border-color:var(--gold)}',
      '.rabbit-btn-danger{background:transparent;color:var(--muted);font-size:var(--text-xs);padding:8px 16px}',
      '.rabbit-btn-danger:hover{color:var(--red)}',

      /* Next module banner */
      '.rabbit-next-banner{position:fixed;bottom:calc(var(--nav-height,56px) + env(safe-area-inset-bottom,0px));left:0;right:0;background:linear-gradient(180deg,transparent 0%,var(--bg) 40%);padding:28px 16px 8px;z-index:997;display:none}',
      '.rabbit-next-inner{background:var(--surface);border:1px solid rgba(247,183,49,0.2);border-radius:var(--radius);padding:10px 14px;display:flex;align-items:center;gap:10px;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:border-color 0.2s}',
      '.rabbit-next-inner:hover{border-color:var(--gold)}',
      '.rabbit-next-text{flex:1;min-width:0}',
      '.rabbit-next-label{font-size:var(--text-xs);color:var(--gold);font-weight:600}',
      '.rabbit-next-module{font-size:var(--text-sm);color:var(--text);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.rabbit-next-arrow{color:var(--gold);font-size:1.2rem;flex-shrink:0}',

      /* Home card */
      '.rabbit-home-card{border:1px solid rgba(247,183,49,0.15);background:linear-gradient(135deg,rgba(247,183,49,0.04),transparent);cursor:pointer;transition:border-color 0.2s;-webkit-tap-highlight-color:transparent}',
      '.rabbit-home-card:hover{border-color:var(--gold)}',

      /* Hidden white rabbit */
      '.hidden-rabbit{display:inline-block;cursor:pointer;font-size:0.85rem;opacity:0.12;transition:all 0.4s ease;user-select:none;position:relative;vertical-align:middle;padding:8px;margin:-8px;animation:rabbitPulse2 4s ease-in-out infinite}',
      '.hidden-rabbit:hover,.hidden-rabbit:active{opacity:0.45;transform:scale(1.3)}',
      '.hidden-rabbit.found{opacity:1;animation:rabbitCaught 0.8s ease forwards;filter:drop-shadow(0 0 6px #fff);padding:0;margin:0;cursor:default;color:#fff}',
      '@keyframes rabbitPulse2{0%,100%{opacity:0.08}50%{opacity:0.18}}',
      '@keyframes rabbitCaught{0%{transform:scale(1)}30%{transform:scale(2.5) rotate(15deg)}60%{transform:scale(0.8) rotate(-5deg)}100%{transform:scale(1) rotate(0deg)}}',

      /* Rabbit counter badge on screens */
      '.rabbit-counter-mini{font-size:var(--text-xs);color:rgba(255,255,255,0.5);display:inline-flex;align-items:center;gap:4px}',

      /* Overlays */
      '.rabbit-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity 0.4s}',
      '.rabbit-overlay.visible{opacity:1}',
      '.rabbit-overlay-card{background:var(--card);border-radius:var(--radius);padding:32px 24px;text-align:center;max-width:340px;width:100%;border:2px solid var(--gold);box-shadow:0 24px 64px rgba(0,0,0,0.5)}',
      '.rabbit-overlay-card h2{font-size:1.4rem;color:var(--gold);margin:12px 0 8px}',
      '.rabbit-overlay-card p{color:var(--muted);font-size:var(--text-sm);line-height:1.6}',

      /* Complete button at module end */
      '.rabbit-complete-wrap{padding:24px 16px 32px}',
      '.rabbit-complete-card{background:var(--surface);border:1px solid rgba(247,183,49,0.2);border-radius:var(--radius);padding:20px;text-align:center}',
      '.rabbit-complete-btn{font-size:var(--text-sm) !important;padding:14px 24px !important}',

      /* Rabbit stats card on overview */
      '.rabbit-stats{margin:0 16px 16px;padding:16px;background:var(--surface);border-radius:var(--radius);display:flex;gap:16px;justify-content:center;flex-wrap:wrap}',
      '.rabbit-stat{text-align:center;min-width:70px}',
      '.rabbit-stat-val{font-size:1.2rem;font-weight:700;font-family:var(--font-mono);color:var(--gold)}',
      '.rabbit-stat-label{font-size:var(--text-xs);color:var(--muted);margin-top:2px}'
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════════════════════════
   *  DOM — FLOATING ACTION BUTTON
   * ══════════════════════════════════════════════════════════════ */

  var fabEl = null;

  function createFAB() {
    if (fabEl) return;
    fabEl = document.createElement('div');
    fabEl.className = 'rabbit-fab has-next';
    fabEl.setAttribute('role', 'button');
    fabEl.setAttribute('aria-label', 'Rabbit Hole — Deine Bitcoin-Reise');
    fabEl.innerHTML = '<svg class="rabbit-fab-ring" viewBox="0 0 52 52">' +
      '<circle r="23" cx="26" cy="26" stroke="rgba(255,255,255,0.06)" />' +
      '<circle class="rabbit-ring-progress" r="23" cx="26" cy="26" stroke="var(--gold)" stroke-dasharray="144.5" stroke-dashoffset="144.5" />' +
      '</svg>' +
      '<span class="rabbit-emoji">🐇</span>' +
      '<span class="rabbit-step-badge">0</span>';

    /* Click: jump to current step or last completed */
    fabEl.addEventListener('click', function () {
      if (!state) {
        if (typeof navigateTo === 'function') navigateTo('rabbithole');
        return;
      }
      var progress = getProgress();
      if (progress.done >= progress.total) {
        /* All done → show overview */
        if (typeof navigateTo === 'function') navigateTo('rabbithole');
        return;
      }
      /* Jump directly to current step module */
      var key = JOURNEY_KEYS[state.currentStep];
      if (key && typeof navigateTo === 'function') {
        navigateTo(key);
      }
    });

    /* Long press: go to overview */
    var longTimer = null;
    fabEl.addEventListener('pointerdown', function () {
      longTimer = setTimeout(function () {
        longTimer = null;
        if (typeof navigateTo === 'function') navigateTo('rabbithole');
      }, 600);
    });
    fabEl.addEventListener('pointerup', function () { if (longTimer) clearTimeout(longTimer); });
    fabEl.addEventListener('pointercancel', function () { if (longTimer) clearTimeout(longTimer); });

    document.body.appendChild(fabEl);
  }

  function updateFAB() {
    if (!fabEl || !state) return;
    var progress = getProgress();
    var ring = fabEl.querySelector('.rabbit-ring-progress');
    if (ring) {
      var circumference = 144.5;
      var offset = circumference - (progress.pct / 100) * circumference;
      ring.setAttribute('stroke-dashoffset', offset.toString());
    }
    var badge = fabEl.querySelector('.rabbit-step-badge');
    if (badge) badge.textContent = progress.done + '/' + progress.total;
    fabEl.classList.toggle('has-next', progress.done < progress.total);
  }

  function showFAB() {
    if (!fabEl) createFAB();
    fabEl.style.display = 'flex';
    updateFAB();
  }

  function hideFAB() {
    if (fabEl) fabEl.style.display = 'none';
  }

  /* ══════════════════════════════════════════════════════════════
   *  DOM — NEXT MODULE BANNER
   * ══════════════════════════════════════════════════════════════ */

  var nextBanner = null;

  function createNextBanner() {
    if (nextBanner) return;
    nextBanner = document.createElement('div');
    nextBanner.className = 'rabbit-next-banner';
    nextBanner.innerHTML = '<div class="rabbit-next-inner">' +
      '<span style="font-size:1.3rem">🐇</span>' +
      '<div class="rabbit-next-text">' +
      '<div class="rabbit-next-label">Nächste Station</div>' +
      '<div class="rabbit-next-module" id="rabbitNextModuleName"></div>' +
      '</div>' +
      '<span class="rabbit-next-arrow">›</span>' +
      '</div>';
    nextBanner.addEventListener('click', function () {
      goToNextStep();
    });
    document.body.appendChild(nextBanner);
  }

  function showNextBanner(nextKey) {
    if (!nextBanner) createNextBanner();
    var mod = getModuleByKey(nextKey);
    var nameEl = nextBanner.querySelector('#rabbitNextModuleName');
    if (nameEl && mod) nameEl.textContent = mod.icon + ' ' + mod.name;
    nextBanner.style.display = 'block';
  }

  function hideNextBanner() {
    if (nextBanner) nextBanner.style.display = 'none';
  }

  /* ══════════════════════════════════════════════════════════════
   *  DOM — JOURNEY OVERVIEW SCREEN
   * ══════════════════════════════════════════════════════════════ */

  function ensureScreen() {
    if (document.getElementById('screen-rabbithole')) return;
    var div = document.createElement('div');
    div.className = 'screen';
    div.id = 'screen-rabbithole';
    var firstScreen = document.querySelector('.screen');
    if (firstScreen && firstScreen.parentElement) {
      firstScreen.parentElement.appendChild(div);
    }
    /* Invalidate cached screen list in navigateTo */
    if (typeof _cachedScreens !== 'undefined') _cachedScreens = null;
  }

  function renderOverview() {
    var screen = document.getElementById('screen-rabbithole');
    if (!screen) return;

    var progress = getProgress();
    var rabbitProg = getRabbitProgress();
    var isStarted = state !== null;
    var isComplete = isStarted && progress.done >= progress.total;

    var html = '<div class="rabbit-hero">' +
      '<span class="rabbit-hero-emoji">🐇</span>' +
      '<h1>Follow the <span class="gold">White Rabbit</span></h1>' +
      '<p class="rabbit-hero-sub">' + (
        !isStarted
          ? 'Eine geführte Reise durch den Bitcoin-Kaninchenbau. 39 Module, 3 Kapitel — vom Einsteiger zum Experten.'
          : isComplete
            ? 'Du hast den gesamten Kaninchenbau erforscht. Respekt!'
            : 'Kapitel ' + (getChapterForStep(state.currentStep).index + 1) + ' von 3 — ' + progress.done + ' von ' + progress.total + ' Stationen erkundet'
      ) + '</p>' +
      '</div>';

    /* Progress bar */
    html += '<div class="rabbit-progress-bar"><div class="rabbit-progress-fill" style="width:' + progress.pct + '%"></div></div>';
    html += '<div class="rabbit-progress-label">' + progress.pct + '% erkundet · ' + progress.done + '/' + progress.total + ' Module</div>';

    /* Stats */
    var earnedJourney = state ? state.rewardedSteps.length * STEP_REWARD : 0;
    html += '<div class="rabbit-stats">' +
      '<div class="rabbit-stat"><div class="rabbit-stat-val">' + progress.done + '/' + progress.total + '</div><div class="rabbit-stat-label">Module</div></div>' +
      '<div class="rabbit-stat"><div class="rabbit-stat-val">' + fmtNum(earnedJourney) + '</div><div class="rabbit-stat-label">Sats verdient</div></div>' +
      '<div class="rabbit-stat"><div class="rabbit-stat-val">' + rabbitProg.done + '/' + rabbitProg.total + '</div><div class="rabbit-stat-label">🐇 gefunden</div></div>' +
      '</div>';

    /* Chapters */
    var globalIdx = 0;
    CHAPTERS.forEach(function (ch, ci) {
      var chapterDone = 0;
      ch.keys.forEach(function (k) {
        if (isStepCompleted(getStepGlobalIndex(k))) chapterDone++;
      });
      var chapterComplete = chapterDone >= ch.keys.length;
      var chapterActive = !chapterComplete && isStarted && ci === getChapterForStep(state.currentStep).index;

      html += '<div class="rabbit-chapter ' + (chapterComplete ? 'done' : chapterActive ? 'active' : '') + '" style="border-left-color:' + ch.color + '">';
      html += '<div class="rabbit-chapter-head" onclick="this.parentElement.querySelector(\'.rabbit-chapter-steps\').style.display=this.parentElement.querySelector(\'.rabbit-chapter-steps\').style.display===\'none\'?\'block\':\'none\'">';
      html += '<span class="rabbit-chapter-emoji">' + ch.emoji + '</span>';
      html += '<span class="rabbit-chapter-title" style="color:' + ch.color + '">' + escHtml(ch.title) + '</span>';
      html += '<span class="rabbit-chapter-count">' + chapterDone + '/' + ch.keys.length + (chapterComplete ? ' ✓' : '') + '</span>';
      html += '</div>';
      html += '<div class="rabbit-chapter-sub">' + escHtml(ch.subtitle) + '</div>';

      html += '<div class="rabbit-chapter-steps" style="display:' + (chapterActive || chapterComplete || !isStarted ? 'block' : 'none') + '">';

      ch.keys.forEach(function (key) {
        var stepIdx = globalIdx++;
        var completed = isStepCompleted(stepIdx);
        var current = isStarted && state.currentStep === stepIdx;
        var future = isStarted && !completed && !current;
        var mod = getModuleByKey(key);
        var icon = mod ? mod.icon : '📄';
        var name = mod ? mod.name : key;
        var teaser = MODULE_TEASERS[key] || '';
        var rewarded = state && state.rewardedSteps.indexOf(stepIdx) !== -1;

        html += '<div class="rabbit-step ' + (completed ? 'completed' : current ? 'current' : future ? 'future' : '') + '" onclick="RabbitHole.goToStep(' + stepIdx + ')">';
        html += '<span class="rabbit-step-icon">' + icon + '</span>';
        html += '<div class="rabbit-step-info">';
        html += '<div class="rabbit-step-name">' + escHtml(name) + '</div>';
        if (teaser) html += '<div class="rabbit-step-teaser">' + escHtml(teaser) + '</div>';
        html += '</div>';
        html += '<span class="rabbit-step-status">' + (completed ? (rewarded ? '✅' : '✅') : current ? '🐇' : '·') + '</span>';
        if (completed && rewarded) {
          html += '<span class="rabbit-step-reward">+' + fmtNum(STEP_REWARD) + '</span>';
        }
        html += '</div>';
      });

      html += '</div></div>';
    });

    /* Hidden rabbits section */
    html += '<div style="margin:20px 16px 8px"><div style="font-weight:700;font-size:var(--text-sm);color:var(--text);margin-bottom:8px">🐇 Versteckte weisse Kaninchen</div>';
    html += '<div style="color:var(--muted);font-size:var(--text-xs);line-height:1.5;margin-bottom:12px">In jedem der 39 Module versteckt sich ein weisses Kaninchen. Finde sie alle!</div>';
    html += '<div class="rabbit-progress-bar" style="margin:0 0 8px"><div class="rabbit-progress-fill" style="width:' + rabbitProg.pct + '%"></div></div>';
    html += '<div style="text-align:center;font-size:var(--text-xs);color:var(--muted);font-family:var(--font-mono)">' + rabbitProg.done + '/' + rabbitProg.total + ' Kaninchen gefunden</div>';
    html += '</div>';

    /* Actions */
    html += '<div class="rabbit-actions">';
    if (!isStarted) {
      html += '<button class="rabbit-btn rabbit-btn-primary" onclick="RabbitHole.start()">🐇 Reise starten</button>';
    } else if (isComplete) {
      html += '<button class="rabbit-btn rabbit-btn-primary" onclick="navigateTo(\'home\')">🏠 Zurück zur Startseite</button>';
      html += '<button class="rabbit-btn rabbit-btn-danger" onclick="RabbitHole.reset()">Reise zurücksetzen</button>';
    } else {
      var nextMod = getModuleByKey(JOURNEY_KEYS[state.currentStep]);
      html += '<button class="rabbit-btn rabbit-btn-primary" onclick="RabbitHole.goToStep(' + state.currentStep + ')">🐇 Weiter: ' + escHtml(nextMod ? nextMod.name : '') + '</button>';
      html += '<button class="rabbit-btn rabbit-btn-secondary" onclick="navigateTo(\'home\')">🏠 Startseite</button>';
      html += '<button class="rabbit-btn rabbit-btn-danger" onclick="RabbitHole.reset()">Reise zurücksetzen</button>';
    }
    html += '</div>';

    screen.innerHTML = html;
  }

  /* ══════════════════════════════════════════════════════════════
   *  DOM — HOME SCREEN CARD
   * ══════════════════════════════════════════════════════════════ */

  function injectHomeCard() {
    if (document.getElementById('rabbitHomeCard')) return;
    var grid = document.querySelector('#moduleGrid');
    if (!grid) return;
    var parent = grid.closest('.section');
    if (!parent) return;

    var card = document.createElement('div');
    card.id = 'rabbitHomeCard';
    card.style.cssText = 'padding:0 16px;margin-bottom:8px';
    parent.parentElement.insertBefore(card, parent);
    updateHomeCard();
  }

  function updateHomeCard() {
    var el = document.getElementById('rabbitHomeCard');
    if (!el) return;

    var isStarted = state !== null;
    var progress = getProgress();
    var rabbitProg = getRabbitProgress();

    if (!isStarted) {
      el.innerHTML = '<div class="card rabbit-home-card animate-in" onclick="navigateTo(\'rabbithole\')" style="padding:16px;text-align:center">' +
        '<div style="font-size:1.8rem;margin-bottom:6px">🐇</div>' +
        '<div style="font-weight:700;color:var(--gold);font-size:var(--text-sm)">Follow the White Rabbit</div>' +
        '<div style="color:var(--muted);font-size:var(--text-xs);margin-top:4px;line-height:1.4">Lass dich durch 39 Module führen — vom Einsteiger zum Experten</div>' +
        '</div>';
    } else if (progress.done >= progress.total) {
      el.innerHTML = '<div class="card rabbit-home-card animate-in" onclick="navigateTo(\'rabbithole\')" style="padding:14px;text-align:center">' +
        '<span style="color:var(--green);font-weight:700;font-size:var(--text-sm)">🎉 Rabbit Hole komplett!</span>' +
        '<span style="color:var(--muted);font-size:var(--text-xs);margin-left:8px">' + progress.total + '/' + progress.total + ' · 🐇 ' + rabbitProg.done + '/' + rabbitProg.total + '</span>' +
        '</div>';
    } else {
      var nextKey = JOURNEY_KEYS[state.currentStep];
      var mod = getModuleByKey(nextKey);
      var chInfo = getChapterForStep(state.currentStep);
      el.innerHTML = '<div class="card rabbit-home-card animate-in" onclick="RabbitHole.goToStep(' + state.currentStep + ')" style="padding:14px">' +
        '<div style="display:flex;align-items:center;gap:10px">' +
        '<span style="font-size:1.5rem">🐇</span>' +
        '<div style="flex:1;min-width:0">' +
        '<div style="font-size:var(--text-xs);color:var(--gold);font-weight:600">' + escHtml(chInfo.chapter.title) + ' · ' + progress.done + '/' + progress.total + '</div>' +
        '<div style="font-size:var(--text-sm);color:var(--text);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">Nächstes Ziel: ' + (mod ? mod.icon + ' ' + escHtml(mod.name) : '') + '</div>' +
        '</div>' +
        '<span style="color:var(--gold);font-size:1.1rem">›</span>' +
        '</div>' +
        '<div class="rabbit-progress-bar" style="margin:8px 0 0;height:4px"><div class="rabbit-progress-fill" style="width:' + progress.pct + '%"></div></div>' +
        '</div>';
    }
  }

  /* ══════════════════════════════════════════════════════════════
   *  HIDDEN RABBITS — Collection system
   * ══════════════════════════════════════════════════════════════ */

  function collectRabbit(el) {
    var id = el.dataset.rabbitId;
    if (!id) return;
    if (foundRabbits.indexOf(id) !== -1) return;
    var rabbit = HIDDEN_RABBITS.find(function (r) { return r.id === id; });
    if (!rabbit) return;

    foundRabbits.push(id);
    saveRabbits();
    el.classList.add('found');
    el.innerHTML = '🐇';

    /* Reward sats */
    if (typeof addSats === 'function') {
      addSats(rabbit.reward, 'Weisses Kaninchen gefunden!');
    }

    /* Check if all found */
    if (foundRabbits.length >= HIDDEN_RABBITS.length) {
      setTimeout(showAllRabbitsFound, 1200);
    }
  }

  function initRabbits() {
    document.querySelectorAll('.hidden-rabbit').forEach(function (el) {
      var id = el.dataset.rabbitId;
      if (!id) return;
      if (foundRabbits.indexOf(id) !== -1) {
        el.classList.add('found');
        el.innerHTML = '🐇';
        el.style.cursor = 'default';
      }
    });
  }

  function showAllRabbitsFound() {
    /* Unlock a secret if function exists */
    if (typeof unlockSecret === 'function') {
      unlockSecret('all_rabbits');
    }
    var overlay = document.createElement('div');
    overlay.className = 'rabbit-overlay';
    overlay.innerHTML = '<div class="rabbit-overlay-card">' +
      '<div style="font-size:3rem">🐇🐇🐇</div>' +
      '<h2>Alle Kaninchen gefunden!</h2>' +
      '<p>Du hast alle 39 versteckten weissen Kaninchen im Kaninchenbau entdeckt. Alice wäre stolz auf dich.</p>' +
      '<p style="color:var(--gold);margin-top:12px;font-weight:600;font-family:var(--font-mono)">+' + fmtNum(HIDDEN_RABBITS.length * 500000) + ' Sats</p>' +
      '<button class="rabbit-btn rabbit-btn-primary" style="margin-top:20px;width:100%">Weiter</button>' +
      '</div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('visible'); });
    overlay.querySelector('.rabbit-btn').addEventListener('click', function () {
      overlay.classList.remove('visible');
      setTimeout(function () { overlay.remove(); }, 350);
    });
  }

  /* Expose globally for onclick */
  window.collectRabbit = collectRabbit;

  /* ══════════════════════════════════════════════════════════════
   *  CHAPTER INTRO OVERLAY
   * ══════════════════════════════════════════════════════════════ */

  function showChapterIntro(chapterIndex, callback) {
    var ch = CHAPTERS[chapterIndex];
    if (!ch) { if (callback) callback(); return; }

    var overlay = document.createElement('div');
    overlay.className = 'rabbit-overlay';
    overlay.innerHTML = '<div class="rabbit-overlay-card" style="border-color:' + ch.color + '">' +
      '<div style="font-size:3rem">' + ch.emoji + '</div>' +
      '<h2 style="color:' + ch.color + '">Kapitel ' + (chapterIndex + 1) + '</h2>' +
      '<h2 style="font-size:1.1rem;color:var(--text);margin-top:2px">' + escHtml(ch.title) + '</h2>' +
      '<p>' + escHtml(ch.subtitle) + '</p>' +
      '<button class="rabbit-btn rabbit-btn-primary" style="width:100%;margin-top:16px">Weiter</button>' +
      '</div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('visible'); });

    function close() {
      overlay.classList.remove('visible');
      setTimeout(function () { overlay.remove(); if (callback) callback(); }, 350);
    }
    overlay.querySelector('.rabbit-btn').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  }

  /* ══════════════════════════════════════════════════════════════
   *  COMPLETION CELEBRATION
   * ══════════════════════════════════════════════════════════════ */

  function showCompletion() {
    var totalEarned = state ? state.rewardedSteps.length * STEP_REWARD : 0;
    var overlay = document.createElement('div');
    overlay.className = 'rabbit-overlay';
    overlay.innerHTML = '<div class="rabbit-overlay-card">' +
      '<div style="font-size:3rem">🎩🐇✨</div>' +
      '<h2>Der Kaninchenbau ist erforscht!</h2>' +
      '<p>Du hast alle 39 Module durchlaufen — von den Grundlagen bis zur Kryptographie. Du verstehst jetzt mehr über Bitcoin als 99% der Bevölkerung.</p>' +
      '<p style="color:var(--gold);margin-top:12px;font-weight:600;font-family:var(--font-mono)">Total: +' + fmtNum(totalEarned) + ' Sats</p>' +
      '<p style="color:var(--muted);margin-top:8px;font-size:var(--text-xs)">«We\'re all mad here.» — Cheshire Cat</p>' +
      '<button class="rabbit-btn rabbit-btn-primary" style="margin-top:20px;width:100%">🏠 Zur Übersicht</button>' +
      '</div>';
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.classList.add('visible'); });

    /* Unlock journey secret */
    if (typeof unlockSecret === 'function') {
      unlockSecret('rabbit_hole_complete');
    }

    overlay.querySelector('.rabbit-btn').addEventListener('click', function () {
      overlay.classList.remove('visible');
      setTimeout(function () {
        overlay.remove();
        if (typeof navigateTo === 'function') navigateTo('rabbithole');
      }, 350);
    });
  }

  /* ══════════════════════════════════════════════════════════════
   *  CORE LOGIC
   * ══════════════════════════════════════════════════════════════ */

  function start() {
    state = defaultState();

    /* Pre-populate from existing visitedModules */
    if (typeof visitedModules !== 'undefined' && Array.isArray(visitedModules)) {
      JOURNEY_KEYS.forEach(function (key, idx) {
        if (visitedModules.indexOf(key) !== -1 && state.completedSteps.indexOf(idx) === -1) {
          state.completedSteps.push(idx);
          /* Don't reward pre-existing visits */
        }
      });
      advanceCurrent();
    }

    saveState();
    showFAB();

    var chInfo = getChapterForStep(state.currentStep);
    showChapterIntro(chInfo.index, function () {
      goToStep(state.currentStep);
    });
  }

  function reset() {
    if (!confirm('Reise wirklich zurücksetzen? Dein Fortschritt geht verloren.')) return;
    state = null;
    localStorage.removeItem(STATE_KEY);
    hideFAB();
    hideNextBanner();
    updateHomeCard();
    renderOverview();
  }

  function advanceCurrent() {
    if (!state) return;
    for (var i = 0; i < JOURNEY_KEYS.length; i++) {
      if (state.completedSteps.indexOf(i) === -1) {
        state.currentStep = i;
        return;
      }
    }
    state.currentStep = JOURNEY_KEYS.length;
  }

  function markComplete(stepIndex) {
    if (!state) return;
    if (state.completedSteps.indexOf(stepIndex) !== -1) return;
    state.completedSteps.push(stepIndex);

    /* Reward sats for journey completion */
    if (!state.rewardedSteps) state.rewardedSteps = [];
    if (state.rewardedSteps.indexOf(stepIndex) === -1) {
      state.rewardedSteps.push(stepIndex);
      if (typeof addSats === 'function') {
        addSats(STEP_REWARD, '🐇 Rabbit Hole: Station ' + (stepIndex + 1) + '/39');
      }
    }

    advanceCurrent();
    saveState();
    updateFAB();
    updateHomeCard();
  }

  function goToStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= JOURNEY_KEYS.length) return;
    var key = JOURNEY_KEYS[stepIndex];

    /* Check if entering a new chapter */
    if (state) {
      var prevChapter = -1;
      /* Find highest completed step's chapter */
      if (state.completedSteps.length > 0) {
        var maxCompleted = Math.max.apply(null, state.completedSteps);
        prevChapter = getChapterForStep(maxCompleted).index;
      }
      var targetChapter = getChapterForStep(stepIndex).index;
      if (targetChapter > prevChapter && !isStepCompleted(stepIndex)) {
        showChapterIntro(targetChapter, function () {
          if (typeof navigateTo === 'function') navigateTo(key);
        });
        return;
      }
    }

    if (typeof navigateTo === 'function') navigateTo(key);
  }

  function goToNextStep() {
    if (!state) return;
    if (state.currentStep >= JOURNEY_KEYS.length) return;
    goToStep(state.currentStep);
  }

  /* ══════════════════════════════════════════════════════════════
   *  NAVIGATION HOOK
   * ══════════════════════════════════════════════════════════════ */

  function hookNavigation() {
    if (typeof navigateTo !== 'function') return;

    var _original = navigateTo;
    var _inHook = false; /* Recursion guard */

    navigateTo = function (key) {
      _original(key);

      /* Prevent re-entry (goToStep → navigateTo → hook → ...) */
      if (_inHook) return;
      _inHook = true;

      try {
        if (key === 'rabbithole') {
          renderOverview();
          hideNextBanner();
          removeCompleteButton();
          return;
        }

        /* Init rabbits on every screen change */
        setTimeout(initRabbits, 100);

        if (!isActive()) {
          removeCompleteButton();
          return;
        }

        var idx = getStepGlobalIndex(key);
        if (idx === -1) {
          hideNextBanner();
          removeCompleteButton();
          return;
        }

        /* Show complete button if not yet completed */
        if (!isStepCompleted(idx)) {
          setTimeout(function () { injectCompleteButton(key, idx); }, 150);
          hideNextBanner();
        } else {
          /* Already completed — show next banner if applicable */
          removeCompleteButton();
          showNextBannerIfNeeded(key);
        }
      } finally {
        _inHook = false;
      }
    };
  }

  /* Show "Nächste Station" banner only when current module differs from next step */
  function showNextBannerIfNeeded(currentKey) {
    if (!state || state.currentStep >= JOURNEY_KEYS.length) {
      hideNextBanner();
      return;
    }
    var nextKey = JOURNEY_KEYS[state.currentStep];
    if (nextKey !== currentKey) {
      showNextBanner(nextKey);
    } else {
      hideNextBanner();
    }
  }

  /* ══════════════════════════════════════════════════════════════
   *  DOM — COMPLETE BUTTON (injected at bottom of each module)
   * ══════════════════════════════════════════════════════════════ */

  var completeBtn = null;

  function removeCompleteButton() {
    if (completeBtn && completeBtn.parentNode) {
      completeBtn.remove();
    }
    completeBtn = null;
  }

  function injectCompleteButton(key, stepIndex) {
    removeCompleteButton();
    var screen = document.getElementById('screen-' + key);
    if (!screen) return;

    var chInfo = getChapterForStep(stepIndex);

    completeBtn = document.createElement('div');
    completeBtn.className = 'rabbit-complete-wrap';
    completeBtn.innerHTML =
      '<div class="rabbit-complete-card">' +
        '<div style="font-size:1.5rem;margin-bottom:6px">🐇</div>' +
        '<div style="font-size:var(--text-xs);color:var(--muted);margin-bottom:8px">' +
          escHtml(chInfo.chapter.title) + ' · Station ' + (stepIndex + 1) + '/' + JOURNEY_KEYS.length +
        '</div>' +
        '<button class="rabbit-btn rabbit-btn-primary rabbit-complete-btn" style="width:100%">' +
          '✅ Modul abschliessen · +' + fmtNum(STEP_REWARD) + ' Sats' +
        '</button>' +
      '</div>';

    completeBtn.querySelector('.rabbit-complete-btn').addEventListener('click', function () {
      markComplete(stepIndex);
      removeCompleteButton();
      /* Show next banner or completion */
      if (state.currentStep < JOURNEY_KEYS.length) {
        showNextBannerIfNeeded(key);
      } else {
        hideNextBanner();
        setTimeout(showCompletion, 600);
      }
    });

    screen.appendChild(completeBtn);
    /* Scroll into view after a brief delay */
    setTimeout(function () {
      completeBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  /* ══════════════════════════════════════════════════════════════
   *  INIT
   * ══════════════════════════════════════════════════════════════ */

  function init() {
    injectCSS();
    loadState();
    ensureScreen();
    hookNavigation();
    createNextBanner();

    if (isActive()) {
      showFAB();
    }

    /* Init already-visible rabbits */
    setTimeout(initRabbits, 300);

    /* Inject home card */
    setTimeout(function () {
      injectHomeCard();
    }, 500);
  }

  /* ══════════════════════════════════════════════════════════════
   *  PUBLIC API
   * ══════════════════════════════════════════════════════════════ */

  window.RabbitHole = {
    start: start,
    reset: reset,
    goToStep: goToStep,
    goToNextStep: goToNextStep,
    isActive: isActive,
    getProgress: getProgress,
    getRabbitProgress: getRabbitProgress,
    HIDDEN_RABBITS: HIDDEN_RABBITS
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
