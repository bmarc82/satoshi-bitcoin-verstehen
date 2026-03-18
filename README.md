# ₿ Satoshi — Bitcoin Verstehen

**Die interaktive Bitcoin-Bildungsplattform als Progressive Web App**

39 Module, Live-Daten, Gamification, Offline-fähig — vom Einsteiger zum Experten.
Kostenlos, werbefrei, Open Source.

> **Live:** [btc-klar.ch](https://btc-klar.ch)

---

## Was ist Satoshi?

Satoshi ist eine umfassende Bitcoin-Bildungs-App, die als Single-Page PWA komplett ohne Framework auskommt. Sie erklärt Bitcoin von der Geschichte des Geldes über Blockchain-Technologie bis hin zu On-Chain-Analyse — alles auf Deutsch (de-CH).

**Zero Dependencies.** Kein React, kein Vue, kein Build-Step. Eine HTML-Datei, eine JS-Datei, ein Service Worker. Fertig.

---

## Features

### Bildung
- **39 interaktive Module** — Geld, Inflation, Blockchain, Mining, Lightning, Wallets, Kryptographie, On-Chain, CBDCs, u.v.m.
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
git clone https://github.com/[username]/satoshi-bitcoin-verstehen.git
cd satoshi-bitcoin-verstehen

# Lokalen Server starten (eine der Optionen)
python3 -m http.server 8080        # Python
npx serve .                         # Node.js
# oder: VS Code → Live Server Extension → "Go Live"

# Browser öffnen → http://localhost:8080
```

> **Hinweis:** HTTPS ist erforderlich für PWA-Funktionalität (Service Worker, Installation). Lokal funktioniert `localhost` auch ohne HTTPS.

---

## Projektstruktur

```
satoshi-bitcoin-verstehen/
├── index.html          # Haupt-App (All-in-One: HTML + CSS + JS)
├── rabbit-hole.js      # Geführte Reise & Hidden Rabbits System
├── sw.js               # Service Worker (Offline-Caching)
├── manifest.json       # PWA Web App Manifest
├── nginx.conf          # Nginx-Konfiguration (Produktion)
├── .htaccess           # Apache-Konfiguration (Alternative)
├── robots.txt          # SEO: Crawler-Steuerung
├── sitemap.xml         # SEO: Sitemap mit allen Modulen
├── icons/
│   └── icon.svg        # App-Icon (SVG)
├── docs/
│   ├── DOKUMENTATION.md
│   └── TECHNISCHE-DOKUMENTATION.md
├── LICENSE             # MIT License
├── CONTRIBUTING.md     # Beitragsrichtlinien
└── README.md           # Diese Datei
```

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

```bash
# Dateien auf Server kopieren
rsync -avz --exclude '.git' --exclude 'node_modules' ./ user@server:/var/www/btc-klar.ch/

# SSL-Zertifikat einrichten
sudo certbot --nginx -d btc-klar.ch
```

Detaillierte Anleitungen: **[docs/TECHNISCHE-DOKUMENTATION.md](docs/TECHNISCHE-DOKUMENTATION.md)**

### Konfiguration anpassen

Nach dem Klonen solltest du folgende Werte anpassen:

1. **Analytics** — Umami `data-website-id` in `index.html` (Zeile 59) ändern oder entfernen
2. **Domain** — `btc-klar.ch` in `nginx.conf`, `sitemap.xml`, `robots.txt` und den Meta-Tags ersetzen
3. **Donation Address** — BTC-Adresse im Impressum anpassen
4. **Relai Promo-Code** — `BITSOLUTIONS` in der Relai-Sektion anpassen oder entfernen

---

## Dokumentation

- **[docs/DOKUMENTATION.md](docs/DOKUMENTATION.md)** — Architektur, Module, Design System, APIs, UX
- **[docs/TECHNISCHE-DOKUMENTATION.md](docs/TECHNISCHE-DOKUMENTATION.md)** — Setup, Deployment, Service Worker, Sicherheit

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
