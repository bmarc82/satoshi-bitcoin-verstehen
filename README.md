# ₿ Satoshi — Bitcoin Verstehen

**Die interaktive Bitcoin-Bildungsplattform als Progressive Web App**

44 Module, Live-Daten, Gamification, Offline-fähig — vom Einsteiger zum Experten.
Kostenlos, werbefrei, Open Source.

> **Live:** [btc-klar.ch](https://btc-klar.ch)

---

## Was ist Satoshi?

Satoshi ist eine umfassende Bitcoin-Bildungs-App, die als Single-Page PWA komplett ohne Framework auskommt. Sie erklärt Bitcoin von der Geschichte des Geldes über Blockchain-Technologie bis hin zu On-Chain-Analyse — alles auf Deutsch (de-CH).

**Zero Dependencies.** Kein React, kein Vue, kein Build-Step. Eine HTML-Datei, eine JS-Datei, ein Service Worker. Fertig.

---

## Features

### Bildung
- **44 interaktive Module** — Geld, Inflation, Blockchain, Mining, Lightning, Wallets, Kryptographie, On-Chain, Privacy, CBDCs, u.v.m.
- **Schwierigkeitsgrade** — Einsteiger → Fortgeschritten → Experte
- **Bitcoin-Lexikon** — 65+ Fachbegriffe mit Live-Suche
- **Literatur & Medien** — Bücher, Podcasts, Videos, Kanäle

### Live-Daten
- **BTC-Preis** in CHF, EUR, USD (CoinGecko API)
- **Blockhöhe, Hashrate, Difficulty** (blockchain.info API)
- **Mempool & Gebühren** (mempool.space API)
- **Fear & Greed Index** (alternative.me API)
- **Bitcoin-News** via RSS-Feeds

### Gamification — Satoshi Stacking
- **53 Quiz-Fragen** in 7 Kategorien mit Sats-Belohnungen
- **11 Inline-Quizzes** direkt in den Modulen
- **21 versteckte Satoshis** (₿) auf verschiedenen Seiten
- **39 versteckte weisse Kaninchen** (🐇) in jedem Modul
- **13 Secrets & Easter Eggs** — findest du alle?
- **Wallet & Level-System** — Newbie → Bronze → Silver → Gold → Diamond → Whale
- **DCA-Simulator** mit historischen Daten

### Rabbit Hole — Geführte Reise
- **"Follow the White Rabbit"** — 39 Module in 3 Kapiteln logisch geordnet
- **Down the Rabbit Hole** → Through the Looking Glass → Mad Hatter's Tea Party
- **Manueller Abschluss** pro Modul mit Sats-Belohnung
- **Floating Action Button** mit Fortschrittsring
- **Kapitel-Intros** und Abschluss-Feier

### Technik
- **Progressive Web App** — installierbar auf iOS, Android, Desktop
- **Offline-fähig** — Service Worker mit Cache-First-Strategie
- **Mobile-first & responsive** — 320px bis 1440px+
- **Dark-Gold Design System** — professionelles Bitcoin-Theme
- **Swipe-Navigation** zwischen Modulen
- **Confetti, Animationen, Shimmer-Effekte**

---

## Quick Start

```bash
# Repository klonen
git clone https://github.com/bmarc82/satoshi-bitcoin-verstehen.git
cd satoshi-bitcoin-verstehen

# Lokalen Dev-Server starten (Node 18+) — mit SPA-Fallback wie nginx
node scripts/dev-server.js
# → http://127.0.0.1:8765

# Build-Validation (HTML, Hashes, Modul-Konsistenz)
node scripts/check.js
```

Alternativ via npm-Skripten:
```bash
npm run dev      # Dev-Server
npm run check    # Build-Check
```

> **Hinweis:** HTTPS ist erforderlich für PWA-Funktionalität (Service Worker, Installation). Lokal funktioniert `localhost` auch ohne HTTPS.

---

## Projektstruktur

```
BITS-SATOSHI-APP/
├── public/                        # ★ Deploy-Artifacts (Document-Root)
│   ├── index.html                 # Haupt-App (HTML + CSS + JS, ~20'000 Zeilen)
│   ├── sw.js                      # Service Worker
│   ├── rabbit-hole.js             # Rabbit-Hole-Modul
│   ├── manifest.json              # PWA-Manifest
│   ├── sitemap.xml                # 45 URLs für SEO
│   ├── robots.txt                 # Crawler-Steuerung
│   ├── .htaccess                  # Apache-Fallback
│   └── icons/
│       ├── icon.svg
│       └── donation-qr.svg        # SHA-256-verifiziert
├── server/                        # nginx-Konfig
│   ├── nginx.conf
│   └── nginx-security-headers.conf
├── scripts/                       # Dev-Tools (laufen via Node)
│   ├── check.js                   # Build-Validation
│   └── dev-server.js              # SPA-Dev-Server
├── docs/
│   ├── DEPLOYMENT.md              # Deploy-Guide (Schritt für Schritt)
│   ├── DEPLOY-NGINX.md            # nginx-Spezifika
│   ├── DOKUMENTATION.md
│   └── TECHNISCHE-DOKUMENTATION.md
├── package.json                   # npm-Skripte
├── README.md                      # diese Datei
├── CONTRIBUTING.md
├── LICENSE                        # MIT
└── .gitignore
```

**Was wird deployt?** Nur `public/`. Der Rest ist Doku, Tools und Source.

---

## Tech Stack

| Komponente | Technologie |
|---|---|
| Markup | HTML5 (Single-Page, All-in-One) |
| Styling | CSS3 + Custom Properties (Dark-Gold Theme) |
| Logik | Vanilla JavaScript (ES6+, kein Framework) |
| PWA | Service Worker + Web App Manifest |
| SEO | JSON-LD, Open Graph, Twitter Cards, Sitemap |
| Analytics | Umami (cookie-frei, DSGVO-konform) |

### APIs (alle kostenlos)

| API | Daten |
|---|---|
| [blockchain.info](https://www.blockchain.com/api) | Blockhöhe, Hashrate, Difficulty |
| [CoinGecko](https://www.coingecko.com/en/api) | BTC-Preis (CHF/EUR/USD), 24h-Änderung |
| [mempool.space](https://mempool.space/docs/api) | Mempool-Grösse, Transaktionsgebühren |
| [alternative.me](https://alternative.me/crypto/fear-and-greed-index/) | Fear & Greed Index |

---

## Deployment

Die App ist eine statische SPA und läuft auf jedem Webserver. HTTPS ist Pflicht für PWA.

**Quick-Deploy mit nginx:**
```bash
# Pre-Check
node scripts/check.js

# App-Files auf Server
rsync -avz --delete public/ user@server:/var/www/btc-klar.ch/

# nginx-Konfig (einmalig)
scp server/nginx-security-headers.conf user@server:/etc/nginx/snippets/satoshi-security-headers.conf
scp server/nginx.conf user@server:/etc/nginx/sites-available/btc-klar.ch
ssh user@server "sudo nginx -t && sudo systemctl reload nginx"

# SSL-Zertifikat einrichten (einmalig)
ssh user@server "sudo certbot --nginx -d btc-klar.ch -d www.btc-klar.ch"
```

**Vollständige Anleitung mit Verifikations-Schritten:** **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**

### Konfiguration anpassen

Alle persönlichen Werte sind zentral in **`SITE_CONFIG`** am Anfang des `<script>`-Blocks in `public/index.html` konfigurierbar:

```javascript
var SITE_CONFIG = {
  domain:       'deine-domain.ch',
  siteName:     'Dein App-Name',
  ownerName:    'Dein Name',
  companyName:  'Deine Firma',
  email:        'info@deine-domain.ch',
  umamiId:      '',                    // leer = kein Analytics
  umamiUrl:     'https://cloud.umami.is/script.js',
  donationAddr: 'bc1q...',             // deine BTC-Adresse
  donationHash: '...',                 // SHA-256 Hash der Adresse
  promoCode:    'DEIN_CODE'            // oder leer lassen
};
```

Zusätzlich manuell anpassen:
- **`server/nginx.conf`** — Domain, SSL-Pfade, Log-Pfade
- **`public/sitemap.xml`** / **`public/robots.txt`** — Domain ersetzen
- **Meta-Tags** im `<head>` von `public/index.html` — `canonical`, `og:url`, `og:image`, `twitter:image`
- **`<noscript>`-Block** im Donation-Widget — BTC-Adresse
- **Impressum** — Firma, LinkedIn-Link

**Donation-Hash generieren** (für Integritätsprüfung):
```bash
echo -n "bc1q..." | shasum -a 256
# oder
node -e "console.log(require('crypto').createHash('sha256').update('bc1q...').digest('hex'))"
```

**QR-Code regenerieren** (nach Adress-Änderung):
```bash
npx --yes qrcode -t svg -o public/icons/donation-qr.svg "bitcoin:bc1q..."
node -e "console.log(require('crypto').createHash('sha256').update(require('fs').readFileSync('public/icons/donation-qr.svg')).digest('hex'))"
# Hash in SITE_CONFIG.donationQrHash eintragen, dann: node scripts/check.js
```

---

## Dokumentation

- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** — Step-by-step Deploy-Anleitung mit Verifikation
- **[docs/DOKUMENTATION.md](docs/DOKUMENTATION.md)** — Architektur, Module, Design System, APIs, UX
- **[docs/TECHNISCHE-DOKUMENTATION.md](docs/TECHNISCHE-DOKUMENTATION.md)** — Setup, Service Worker, Sicherheit
- **[docs/DEPLOY-NGINX.md](docs/DEPLOY-NGINX.md)** — Ergänzende nginx-Spezifika

---

## Mitmachen

Beiträge sind willkommen! Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Details.

Möglichkeiten:
- Neue Quiz-Fragen hinzufügen
- Übersetzungen (aktuell nur de-CH)
- Neue Module erstellen
- Bugs melden oder fixen
- Design-Verbesserungen
- Accessibility verbessern

---

## Lizenz

[MIT License](LICENSE) — frei nutzbar, auch kommerziell.

---

## Danksagungen

- **Satoshi Nakamoto** — für Bitcoin
- Die Bitcoin-Community — für unermüdliche Bildungsarbeit
- [mempool.space](https://mempool.space), [CoinGecko](https://www.coingecko.com), [blockchain.info](https://blockchain.info) — für kostenlose APIs

---

*Satoshi — Bitcoin Verstehen | Open Source seit März 2026*
*Built with ❤️ and ₿ by BIT Solutions*
