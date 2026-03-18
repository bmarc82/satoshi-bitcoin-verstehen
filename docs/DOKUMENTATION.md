# Satoshi -- Bitcoin Kompendium -- Dokumentation

> Durchgaengige Projektdokumentation | v1.0 | Maerz 2026

---

## Inhaltsverzeichnis

1. [Projektuebersicht](#1-projektuebersicht)
2. [Architektur](#2-architektur)
3. [Module im Detail](#3-module-im-detail)
4. [Design System](#4-design-system)
5. [API-Integration](#5-api-integration)
6. [Navigation & UX](#6-navigation--ux)
7. [State Management](#7-state-management)
8. [PWA-Funktionalitaet](#8-pwa-funktionalitaet)
9. [Performance-Optimierung](#9-performance-optimierung)
10. [Barrierefreiheit & SEO](#10-barrierefreiheit--seo)

---

## 1. Projektuebersicht

**Satoshi** ist ein umfassendes Bitcoin-Bildungssystem in Form einer Progressive Web App (PWA). Die App richtet sich an Bitcoin-Einsteiger und Fortgeschrittene im DACH-Raum und vermittelt Bitcoin-Wissen auf allen Ebenen: von der Geschichte des Geldes ueber Kryptographie und Blockchain-Technologie bis hin zu praktischen Anwendungsfaellen weltweit.

### Kernmerkmale

| Merkmal | Beschreibung |
|---|---|
| **17 Module** | Vollstaendige Bitcoin-Bildung in strukturierten Screens |
| **Live-Daten** | Echtzeit-Blockchain-Daten ueber 4+ oeffentliche APIs |
| **PWA** | Installierbar auf iOS, Android und Desktop ohne App Store |
| **Offline-faehig** | Service Worker cached alle statischen Inhalte und API-Responses |
| **Mobile-first** | Optimiert fuer Smartphones, responsive auf Tablet und Desktop |
| **Keine Abhaengigkeiten** | Vanilla HTML/CSS/JS -- kein Framework, kein Build-Step |
| **Sprache** | Deutsch (Primaer), Englisch (geplant) |
| **Zielgruppe** | Bitcoin-Einsteiger & Fortgeschrittene im DACH-Raum |

### Technologie-Stack

- **Markup:** HTML5 (Single-Page Application, All-in-One)
- **Styling:** CSS3 mit Custom Properties (Dark-Gold-Theme)
- **Logik:** Vanilla JavaScript (ES6+)
- **Fonts:** Google Fonts (Syne, Lora, Syne Mono)
- **PWA:** Service Worker + Web App Manifest
- **APIs:** blockchain.info, CoinGecko, mempool.space

---

## 2. Architektur

### 2.1 Single-Page Application (SPA)

Satoshi ist als Single-Page Application aufgebaut. Alle 17 Module (Screens) sind innerhalb einer einzigen `index.html`-Datei definiert. Die Navigation zwischen den Screens erfolgt ueber JavaScript-basiertes Screen-Switching -- es gibt keine separaten HTML-Seiten und keine URL-basierte Navigation.

```
Benutzer-Interaktion
    |
    v
Bottom-Navigation / Swipe-Gesten
    |
    v
JavaScript Screen-Controller
    |
    +-- Screen ein-/ausblenden (CSS display)
    +-- API-Daten laden (bei Bedarf)
    +-- localStorage aktualisieren
    |
    v
DOM-Update (innerhalb index.html)
```

### 2.2 Dateistruktur

```
/satoshi-app/
|-- index.html            <- Haupt-App (~3.700+ Zeilen, All-in-One)
|-- manifest.json         <- PWA-Manifest (Name, Icons, Theme)
|-- sw.js                 <- Service Worker (Offline-Caching)
|-- icons/
|   |-- icon-192.png      <- Android / Chrome PWA Icon
|   |-- icon-512.png      <- Splash Screen / Maskable Icon
|   |-- apple-touch-icon.png  <- iOS Safari
|   +-- favicon.ico       <- Browser Tab
|-- assets/               <- Optionale Bilder, Charts (spaetere Phasen)
+-- docs/
    |-- DOKUMENTATION.md  <- Diese Datei
    +-- TECHNISCHE-DOKUMENTATION.md
```

### 2.3 Architektur-Prinzipien

- **Zero Dependencies:** Keine externen JavaScript-Bibliotheken oder CSS-Frameworks
- **All-in-One:** HTML, CSS und JavaScript in einer einzigen Datei fuer maximale Portabilitaet
- **Progressive Enhancement:** Grundfunktionen ohne JavaScript, erweiterte Features mit JS
- **Mobile-first:** CSS-Basis fuer kleine Bildschirme, Breakpoints fuer groessere Geraete
- **Offline-first:** Service Worker cached die App Shell, API-Daten werden bei Verfuegbarkeit aktualisiert

---

## 3. Module im Detail

Die App besteht aus 17 thematischen Modulen (Screens), die ueber eine persistente Bottom-Navigation erreichbar sind.

### Modul 01 -- Home (Dashboard)

**Zweck:** Zentraler Einstiegspunkt und Uebersicht ueber die wichtigsten Bitcoin-Kennzahlen.

- **Inhalt:** Hero-Bereich mit Bitcoin-Logo und Begruessung, Live-Statistiken (Preis, Blockhoehe, Hashrate), Moduluebersicht als Karten-Grid, Quick Insights
- **API-Abhaengigkeiten:** blockchain.info (Blockhoehe, Hashrate), CoinGecko (BTC-Preis in CHF/EUR/USD)
- **Interaktive Elemente:** Modul-Karten als Navigations-Links, Live-Daten-Widgets mit automatischer Aktualisierung, Pull-to-Refresh fuer Datenaktualisierung

### Modul 02 -- Geld & Geschichte (Zeitlinie Geld)

**Zweck:** Historischer Kontext -- warum Bitcoin existiert und welches Problem es loest.

- **Inhalt:** Interaktive Zeitlinie von 9000 v. Chr. bis 2009, Meilensteine der Geldgeschichte (Muscheln, Muenzen, Goldstandard, Bretton Woods, Nixon Shock, Genesis Block), Erklaerung der Geldeigenschaften
- **API-Abhaengigkeiten:** Keine (rein statischer Inhalt)
- **Interaktive Elemente:** Scrollbare Zeitlinie mit animierten Markern, aufklappbare Detail-Karten pro historischem Ereignis

### Modul 03 -- Inflation (Kaufkraft & Fiat)

**Zweck:** Veranschaulichung der Kaufkraftverluste durch Inflation und Geldmengenausweitung.

- **Inhalt:** Animierte CHF-Kaufkraft-Grafik (Wertverlust seit 1900), historische Hyperinflationsfaelle (Venezuela, Simbabwe, Tuerkei), Vergleich Geldmengenausweitung vs. Bitcoin-Supply
- **API-Abhaengigkeiten:** Keine (statische Daten mit optionaler API-Erweiterung)
- **Interaktive Elemente:** Animierte Zahlenvisualisierung, Laender-Vergleichskarten mit Inflationsraten

### Modul 04 -- Analogien (Druckerpresse, Luther)

**Zweck:** Bitcoin durch historische Parallelen verstaendlich machen.

- **Inhalt:** 3 grosse Analogien: (1) Gutenbergs Druckerpresse -- Demokratisierung von Information, (2) Martin Luther vs. Satoshi Nakamoto -- Reformation des Systems, (3) TCP/IP -- Infrastruktur-Revolution
- **API-Abhaengigkeiten:** Keine
- **Interaktive Elemente:** Side-by-side Vergleichskarten, animierte Uebergaenge zwischen den Analogien

### Modul 05 -- Satoshi (Identitaet & Chronologie)

**Zweck:** Die Geschichte hinter dem pseudonymen Bitcoin-Schoepfer Satoshi Nakamoto.

- **Inhalt:** Identity Card (bekannte Fakten), Chronologie der Aktivitaeten (2008-2011), Identitaets-Theorien (Hal Finney, Nick Szabo, Craig Wright etc.), Erklaerung warum Anonymitaet ein Feature ist
- **API-Abhaengigkeiten:** Keine
- **Interaktive Elemente:** Identity-Card-Darstellung, aufklappbare Theorien-Karten, Timeline mit Meilensteinen

### Modul 06 -- Blockchain (Live-Ticker + Technik)

**Zweck:** Technische Erklaerung der Blockchain-Technologie mit Live-Daten.

- **Inhalt:** Live-Blockhoehe und Hashrate (API), Anatomie eines Blocks, Proof-of-Work Erklaerung, UTXO-Modell, Mining-Prozess, Difficulty Adjustment
- **API-Abhaengigkeiten:** blockchain.info (Blockhoehe, Hashrate, Difficulty, Transaktionen pro Sekunde), mempool.space (Mempool-Groesse, Gebuehren)
- **Interaktive Elemente:** Live-Daten-Widgets mit automatischem Refresh (60s), visuelle Block-Anatomie, animierte PoW-Erklaerung

### Modul 07 -- Whitepaper (9-Kapitel-Reader)

**Zweck:** Das originale Bitcoin-Whitepaper zugaenglich und verstaendlich machen.

- **Inhalt:** Alle 9 Kapitel des Whitepapers im Original (Englisch) mit deutscher Erklaerung und Zusammenfassung, Links zum PDF-Download
- **API-Abhaengigkeiten:** Keine
- **Interaktive Elemente:** Kapitel-Navigation, Toggle zwischen Original (EN) und Erklaerung (DE), aufklappbare Sektionen

### Modul 08 -- Bitcoin vs. Krypto (Vergleichstabelle)

**Zweck:** Klare Abgrenzung von Bitcoin gegenueber dem breiteren Krypto-Markt.

- **Inhalt:** Vergleichstabelle mit 8 Kriterien (Dezentralisierung, Geldpolitik, Sicherheit etc.), Uebersicht der Krypto-Landschaft, Altcoin-Warnhinweise und Risiken
- **API-Abhaengigkeiten:** Keine (optional: CoinGecko fuer Marktdaten)
- **Interaktive Elemente:** Interaktive Vergleichstabelle mit Highlighting, aufklappbare Kriterien-Erklaerungen

### Modul 09 -- Schweiz (Regulierung & Steuern)

**Zweck:** Bitcoin-spezifische Regulierung und Steuerbehandlung in der Schweiz.

- **Inhalt:** Kapitalsteuer-Regelung fuer Privatpersonen, DLT-Gesetz (Distributed Ledger Technology), Uebersicht Schweizer Bitcoin-Anbieter, regulatorische Timeline, Vergleich CH/DE/AT
- **API-Abhaengigkeiten:** Keine
- **Interaktive Elemente:** Anbieter-Karten mit Details, Timeline-Darstellung, Steuer-FAQ aufklappbar

### Modul 10 -- Kaufen & Verwahren (Anleitung Self-Custody)

**Zweck:** Praktische Schritt-fuer-Schritt-Anleitung zum Bitcoin-Kauf und zur sicheren Verwahrung.

- **Inhalt:** 5-Schritte-Anleitung (Boerse waehlen, KYC, kaufen, Wallet einrichten, transferieren), Wallet-Typen (Hot/Cold, Custodial/Non-Custodial), Seed-Phrase-Sicherung, Hardware-Wallet-Vergleich
- **API-Abhaengigkeiten:** Keine
- **Interaktive Elemente:** Schritt-fuer-Schritt-Wizard, Wallet-Vergleichstabelle, Checkliste fuer Seed-Sicherung

### Modul 11 -- Dos & Don'ts (Verhaltensregeln)

**Zweck:** Praktische Verhaltensregeln fuer Bitcoin-Einsteiger.

- **Inhalt:** 6 DOs (z.B. eigene Recherche, DCA-Strategie, Self-Custody), 7 DON'Ts (z.B. kein FOMO, keine Altcoins auf Kredit, keine Keys teilen)
- **API-Abhaengigkeiten:** Keine
- **Interaktive Elemente:** Visuell getrennte DO/DON'T-Karten mit Icons, aufklappbare Erklaerungen

### Modul 12 -- Lexikon (30+ Begriffe)

**Zweck:** Nachschlagewerk fuer alle wichtigen Bitcoin-Fachbegriffe.

- **Inhalt:** 30+ Begriffe mit Definitionen (z.B. UTXO, Mempool, Halving, Difficulty, Lightning, Seed Phrase, etc.), kategorisiert nach Themenbereich
- **API-Abhaengigkeiten:** Keine
- **Interaktive Elemente:** Suchfeld mit Live-Filterung, Kategorie-Filter-Buttons, aufklappbare Begriffskarten

### Modul 13 -- Literatur (25+ Buecher & Paper)

**Zweck:** Kuratierte Leseliste fuer vertiefendes Bitcoin-Studium.

- **Inhalt:** 25+ Buecher und Paper mit Beschreibung, Schwierigkeitsgrad (Einsteiger/Mittel/Experte), Links zu Bezugsquellen
- **API-Abhaengigkeiten:** Keine
- **Interaktive Elemente:** Filter nach Schwierigkeitsgrad und Sprache, sortierbare Liste, externe Links

### Modul 14 -- Kryptographie (Cypherpunks & Technik)

**Zweck:** Technische Grundlagen der Kryptographie hinter Bitcoin.

- **Inhalt:** Elliptic Curve Cryptography (ECC), SHA-256, historische Timeline 1976-2009 (Diffie-Hellman, RSA, PGP, Hashcash, Bitcoin), Key Figures der Cypherpunk-Bewegung
- **API-Abhaengigkeiten:** Keine
- **Interaktive Elemente:** Interaktive Timeline, aufklappbare Persoenlichkeits-Karten, vereinfachte Kryptographie-Visualisierungen

### Modul 15 -- Weltweit (Entwicklungslaender)

**Zweck:** Bitcoin als Werkzeug fuer finanzielle Inklusion weltweit.

- **Inhalt:** Remittance-Kosten und Bitcoin-Alternative, Unbanked-Statistiken (1.4 Mrd. Menschen), Laenderprofile: Nigeria, Argentinien, Philippinen, Libanon, Tuerkei
- **API-Abhaengigkeiten:** Keine (optional: CoinGecko fuer lokale Waehrungsdaten)
- **Interaktive Elemente:** Laender-Karten mit Statistiken, Vergleiche traditionell vs. Bitcoin-Remittances

### Modul 16 -- El Salvador (Erstes Bitcoin-Land)

**Zweck:** Detaillierte Analyse von El Salvadors Bitcoin-Experiment.

- **Inhalt:** Chronologie 2021-2025, Bitcoin-Gesetz, Chivo-Wallet, IWF-Deal, oekonomische Bilanz, Volcano Mining, Bitcoin Bonds
- **API-Abhaengigkeiten:** Keine
- **Interaktive Elemente:** Timeline-Darstellung, Kennzahlen-Widgets, Pro/Contra-Karten

### Modul 17 -- YouTube (Empfehlungen)

**Zweck:** Kuratierte Video-Empfehlungen fuer visuelles Lernen.

- **Inhalt:** Empfohlene YouTube-Kanaele und Videos, sortiert nach Sprache (DE/EN) und Niveau (Einsteiger/Mittel/Experte)
- **API-Abhaengigkeiten:** Keine
- **Interaktive Elemente:** Filter nach Sprache und Schwierigkeitsgrad, Karten mit Video-Links, Kanal-Beschreibungen

---

## 4. Design System

### 4.1 Farbpalette

Die App verwendet ein dunkles Farbschema mit Bitcoin-Gold als Primaerfarbe. Alle Farben sind als CSS Custom Properties definiert.

| CSS-Variable | Hex-Wert | Verwendung |
|---|---|---|
| `--bg` | `#080C10` | Haupt-Hintergrund (sehr dunkles Blau-Schwarz) |
| `--surface` | `#0F1419` | Oberflaechen: Navbars, Seitenbereiche |
| `--card` | `#161D26` | Karten-Hintergrund |
| `--gold` | `#F7B731` | Primaerfarbe: Bitcoin-Gold, CTAs, Akzente |
| `--gold2` | `#FFD166` | Gold-Variante: Highlights, Hover-States |
| `--text` | `#E8EDF2` | Primaerer Fliesstext |
| `--muted` | `#6B7A8D` | Sekundaertext, Labels, Platzhalter |
| `--green` | `#06D6A0` | Positive Werte, Erfolg, Wachstum |
| `--red` | `#EF476F` | Negative Werte, Warnungen, Verlust |
| `--blue` | `#118AB2` | Informativ, Links, Cypherpunk-Timeline |

### 4.2 Typographie

Die App nutzt drei Font-Familien fuer unterschiedliche Zwecke:

```css
--font-sans:  'Syne', sans-serif;        /* Headlines: 600-800 Weight */
--font-serif: 'Lora', Georgia, serif;    /* Body-Text: lesbar, serioes */
--font-mono:  'Syne Mono', monospace;    /* Daten: Hashes, Blockhoehen, API-Werte */
```

**Groessen-Skala:**

| Variable | Groesse | Verwendung |
|---|---|---|
| `--text-xs` | 0.6rem | Labels, Tags, Badges |
| `--text-sm` | 0.75rem | Sekundaertext, Zeitstempel |
| `--text-base` | 0.9rem | Standard Body-Text |
| `--text-lg` | 1.1rem | Karten-Titel, Sub-Headlines |
| `--text-xl` | 1.4rem | Section-Ueberschriften |
| `--text-2xl` | 2.0rem | Hero-Statistiken, grosse Zahlen |
| `--text-3xl` | 3.0rem | Hero-Titel |

### 4.3 Responsive Breakpoints

Die App folgt einem Mobile-first-Ansatz. Die Basis-Styles sind fuer kleine Bildschirme (320px-500px) ausgelegt.

| Breakpoint | Max-Width | Zielgeraet |
|---|---|---|
| Basis (kein Media Query) | 500px | Smartphones (320px-500px) |
| `min-width: 768px` | 680px | Tablets |
| `min-width: 1024px` | 820px | Desktop |
| `min-width: 1200px` | 900px | Grossbildschirme |

### 4.4 Komponenten-Stil

- **Karten:** Abgerundete Ecken (`border-radius: 12px-16px`), `--card` Hintergrund, subtiler Box-Shadow
- **Buttons:** Gold-Hintergrund (`--gold`), dunkler Text, Hover-Effekt mit `--gold2`
- **Navigation:** Fester Bottom-Bar mit `--surface` Hintergrund, horizontaler Scroll
- **Statistik-Widgets:** Monospace-Font fuer Zahlen, Gold-Akzentfarbe fuer Werte
- **Timeline-Elemente:** Vertikale Linie mit Punkt-Markern, aufklappbare Karten
- **Badges/Tags:** Kleine abgerundete Elemente mit `--text-xs`, halbtransparenter Hintergrund

---

## 5. API-Integration

### 5.1 Uebersicht der Datenquellen

Die App bezieht Echtzeit-Daten aus drei oeffentlichen APIs. Alle Anfragen erfolgen client-seitig ueber CORS-freie Endpunkte.

#### blockchain.info

| Endpunkt | Daten | Refresh-Intervall |
|---|---|---|
| `https://api.blockchain.info/stats` | Blockhoehe, Hashrate, Difficulty, TX/s, Marktpreis | 60 Sekunden |
| `https://blockchain.info/q/getblockcount` | Aktuelle Blockhoehe (einzelner Wert) | 60 Sekunden |
| `https://blockchain.info/q/hashrate` | Aktuelle Hashrate (einzelner Wert) | 60 Sekunden |
| `https://blockchain.info/q/24hrbtcsent` | Gesendete BTC in 24h | 120 Sekunden |

**Datenformat:** JSON-Objekt mit flachen Key-Value-Paaren

```json
{
  "market_price_usd": 97234.56,
  "hash_rate": 523456789.12,
  "n_blocks_total": 887654,
  "difficulty": 89012345678901,
  "n_tx": 342156
}
```

#### CoinGecko API v3

| Endpunkt | Daten | Refresh-Intervall |
|---|---|---|
| `/simple/price?ids=bitcoin&vs_currencies=chf,eur,usd&include_24hr_change=true` | BTC-Preis in CHF/EUR/USD, 24h-Aenderung | 60 Sekunden |
| `/coins/bitcoin/market_chart?vs_currency=chf&days=7` | 7-Tages-Preisverlauf (fuer Sparklines) | 300 Sekunden |

**Datenformat:**

```json
{
  "bitcoin": {
    "chf": 86543.21,
    "eur": 91234.56,
    "usd": 97234.56,
    "chf_24h_change": 2.34,
    "eur_24h_change": 2.12,
    "usd_24h_change": 1.98
  }
}
```

**Rate-Limits:** Free-Tier erlaubt 10-30 Calls/Minute. Die App ist auf maximal 1 Call/Minute pro Endpunkt konfiguriert.

#### mempool.space API v1

| Endpunkt | Daten | Refresh-Intervall |
|---|---|---|
| `https://mempool.space/api/v1/fees/recommended` | Empfohlene Gebuehren (sat/vByte) | 120 Sekunden |
| `https://mempool.space/api/mempool` | Mempool-Groesse, Anzahl unbestaetigter TX | 120 Sekunden |

**Datenformat (Fees):**

```json
{
  "fastestFee": 25,
  "halfHourFee": 18,
  "hourFee": 12,
  "economyFee": 6,
  "minimumFee": 1
}
```

### 5.2 Fehlerbehandlung

Die App implementiert eine Silent-Fallback-Strategie:

1. **Normaler Ablauf:** API-Call -> Response -> Anzeige + localStorage-Cache aktualisieren
2. **API-Fehler/Timeout:** Letzter gecachter Wert aus localStorage wird angezeigt (mit Zeitstempel)
3. **Kein Cache vorhanden:** Platzhalter-Werte (`--`) oder statische Fallback-Daten
4. **Offline:** Service Worker liefert gecachten API-Response (TTL: 5 Minuten)

```
API-Request
    |
    +-- Erfolg: Daten anzeigen + Cache aktualisieren
    |
    +-- Fehler/Timeout (8s):
        |
        +-- localStorage-Cache vorhanden: Gecachte Daten anzeigen
        |
        +-- Kein Cache: Platzhalter anzeigen
```

**Timeout:** 8 Sekunden pro Request, implementiert ueber `Promise.race()`.

### 5.3 Caching-Strategie

- **localStorage:** Jeder API-Response wird mit Zeitstempel im localStorage gespeichert
- **Service Worker API-Cache:** Separater Cache (`satoshi-api-v1`) mit TTL von 5 Minuten
- **Cache-Key-Schema:** `satoshi_api_{endpunkt}` (z.B. `satoshi_api_blockchain_stats`)

### 5.4 Rate-Limiting

Um die Free-Tier-Limits der APIs zu respektieren, sind folgende Limits implementiert:

| API | Limit (App) | Limit (Free-Tier) |
|---|---|---|
| blockchain.info | 1 Req/Min | ~10 Req/Min |
| CoinGecko | 1 Req/Min | 10-30 Req/Min |
| mempool.space | 1 Req/2 Min | Grosszuegig |

---

## 6. Navigation & UX

### 6.1 Bottom-Navigation

Die primaere Navigation ist eine persistente Bottom-Navigation-Bar am unteren Bildschirmrand. Sie ist auf allen Screens sichtbar und bietet direkten Zugriff auf alle 17 Module.

**Eigenschaften:**

- Fester Bottom-Bar (`position: fixed; bottom: 0`)
- Horizontaler Scroll fuer alle 17 Module
- Aktives Modul visuell hervorgehoben (Gold-Akzent)
- Touch-optimierte Tap-Targets (min. 48px)
- Scroll-Snap fuer praezise Navigation
- Safe-Area-Insets fuer iOS (Notch/Home-Indicator)

### 6.2 Swipe-Gesten

Zwischen benachbarten Screens kann horizontal gewischt werden:

- **Swipe links:** Naechster Screen (Modul N+1)
- **Swipe rechts:** Vorheriger Screen (Modul N-1)
- Visuelles Feedback waehrend des Swipe (Translation)
- Schwellenwert fuer Ausloesung: ~50px horizontale Bewegung

### 6.3 Screen-Transitionen

Beim Wechsel zwischen Screens werden CSS-Animationen verwendet:

- **Fade-In:** Neuer Screen blendet ein (opacity 0 -> 1)
- **Slide:** Optional horizontaler Slide-Effekt bei Swipe
- **Dauer:** 200-300ms fuer fluessige Uebergaenge
- **Scroll-Reset:** Jeder neue Screen beginnt am oberen Rand

### 6.4 Scroll-Verhalten

- Vertikaler Scroll innerhalb jedes Screens (nativer Browser-Scroll)
- Smooth Scrolling fuer interne Anker-Links
- Bottom-Navigation bleibt beim Scrollen sichtbar
- Overflow-Scroll fuer horizontale Elemente (Tabellen, Timelines)

---

## 7. State Management

### 7.1 Screen-Switching

Das Screen-Management basiert auf einfachem CSS-Display-Toggling:

```
Alle Screens: display: none (versteckt)
Aktiver Screen: display: block (sichtbar)
```

**Ablauf beim Screen-Wechsel:**

1. Aktuellen Screen ausblenden (`display: none`)
2. Neuen Screen einblenden (`display: block`)
3. CSS-Animation starten (Fade/Slide)
4. Bottom-Navigation aktualisieren (aktives Element)
5. Scroll-Position zuruecksetzen (`scrollTop = 0`)
6. API-Daten laden falls erforderlich (Modul 01, 06)

### 7.2 localStorage-Nutzung

Die App nutzt `localStorage` fuer folgende Zwecke:

| Key | Daten | Zweck |
|---|---|---|
| `satoshi_api_*` | API-Responses mit Zeitstempel | Offline-Fallback, schnellere Ladezeiten |
| `satoshi_last_screen` | Zuletzt besuchter Screen (optional) | Screen-Persistenz ueber Sessions |

**Datenformat im Cache:**

```json
{
  "data": { /* API-Response */ },
  "ts": 1710345600000
}
```

### 7.3 Kein externer State

Die App verwendet bewusst keinen externen State-Management-Layer (kein Redux, kein MobX). Der gesamte Anwendungszustand besteht aus:

- **Aktiver Screen:** Einfache Variable im JavaScript
- **API-Daten:** Temporaer im Speicher + localStorage-Cache
- **UI-State:** Direkt im DOM (aufgeklappte Karten, Filter-Zustand)

---

## 8. PWA-Funktionalitaet

### 8.1 Web App Manifest

Die Datei `manifest.json` definiert die PWA-Metadaten:

```json
{
  "name": "Satoshi -- Bitcoin Verstehen",
  "short_name": "Satoshi",
  "description": "Umfassendes Bitcoin-Bildungssystem",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#080C10",
  "theme_color": "#F7B731",
  "lang": "de-CH",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "purpose": "maskable" },
    { "src": "icons/apple-touch-icon.png", "sizes": "180x180" }
  ]
}
```

### 8.2 Service Worker

Der Service Worker (`sw.js`) implementiert zwei Caching-Strategien:

**Cache-first fuer statische Assets (App Shell):**

- `index.html`, `manifest.json`, Icons
- Vorteil: Sofortiges Laden aus dem Cache
- Update: Neuer Cache wird im Hintergrund aufgebaut

**Network-first mit TTL fuer API-Daten:**

- blockchain.info, CoinGecko, mempool.space Responses
- TTL: 5 Minuten
- Fallback auf Cache bei Netzwerk-Fehler
- Offline-Response (503 JSON) wenn Cache abgelaufen

### 8.3 Offline-Faehigkeit

Im Offline-Modus:

- **App Shell:** Vollstaendig verfuegbar (aus Cache)
- **Statische Inhalte:** Alle 17 Module lesbar (Module 02-05, 07-17)
- **API-Daten:** Letzte gecachte Werte (bis TTL-Ablauf), danach Platzhalter
- **Navigation:** Voll funktionsfaehig (kein Netzwerk erforderlich)

### 8.4 Install Prompt

Die App unterstuetzt die Installation als native App:

- **Android (Chrome):** Automatischer Install-Banner nach Kriterien erfuellt
- **iOS (Safari):** Manuell ueber "Teilen" -> "Zum Home-Bildschirm"
- **Desktop (Chrome/Edge):** Install-Icon in der Adressleiste

---

## 9. Performance-Optimierung

### 9.1 Ladeverhalten

- **Keine Build-Pipeline:** Kein Bundling, kein Minification in Phase 1
- **Inline CSS/JS:** Alles in einer Datei -- ein einziger HTTP-Request fuer die App
- **Font Preloading:** Google Fonts werden per `<link rel="preconnect">` vorgeladen
- **Kein JavaScript-Framework:** Minimaler Overhead, schnelle Ausfuehrung

### 9.2 Caching

| Ressource | Cache-Strategie | TTL |
|---|---|---|
| `index.html` | Cache-first (SW) + no-cache (HTTP) | Immer aktuell |
| `manifest.json` | Cache-first (SW) | Langzeit |
| Icons / Assets | Cache-first (SW) + immutable (HTTP) | 1 Jahr |
| `sw.js` | no-store (HTTP) | Immer aktuell |
| API-Responses | Network-first (SW) | 5 Minuten |

### 9.3 Lighthouse-Ziele

| Kategorie | Ziel |
|---|---|
| Performance | > 90 |
| Accessibility | > 90 |
| Best Practices | > 90 |
| SEO | > 90 |
| PWA | Alle Kriterien erfuellt |

### 9.4 Core Web Vitals

| Metrik | Ziel | Strategie |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | Inline CSS, kein Render-Blocking JS |
| **FID** (First Input Delay) | < 100ms | Kein schwerer JS, Event-Handler leichtgewichtig |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Feste Dimensionen fuer Bilder/Widgets, Font-Display: swap |

---

## 10. Barrierefreiheit & SEO

### 10.1 Barrierefreiheit (Accessibility)

- **Semantisches HTML:** Verwendung von `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`
- **ARIA-Labels:** Navigation, Buttons und interaktive Elemente mit `aria-label`
- **Farbkontrast:** Alle Text-Hintergrund-Kombinationen erfuellen WCAG 2.1 AA (mindestens 4.5:1)
- **Tastatur-Navigation:** Fokus-Styles fuer alle interaktiven Elemente
- **Tap-Targets:** Minimum 48x48px fuer alle klickbaren Elemente (WCAG, Google)
- **Font-Scaling:** Relative Einheiten (rem) ermoeglichen Schriftgroessen-Anpassung
- **Reduzierte Bewegung:** `prefers-reduced-motion` Media Query fuer Animationen

### 10.2 SEO

Da es sich um eine Single-Page Application handelt, ist SEO eingeschraenkt, aber grundlegend optimiert:

- **Meta-Tags:** `<title>`, `<meta name="description">`, Open Graph Tags
- **Sprachattribut:** `<html lang="de-CH">`
- **Strukturierte Daten:** Optional: JSON-LD fuer WebApplication Schema
- **Canonical URL:** `<link rel="canonical">`
- **Mobile-friendly:** Responsive Design, Viewport Meta Tag
- **HTTPS:** Pflicht -- positiver Ranking-Faktor
- **Performance:** Schnelle Ladezeiten als SEO-Signal

### 10.3 Open Graph & Social Sharing

```html
<meta property="og:title" content="Satoshi -- Bitcoin Verstehen">
<meta property="og:description" content="Umfassendes Bitcoin-Bildungssystem mit 17 Modulen">
<meta property="og:type" content="website">
<meta property="og:image" content="/icons/icon-512.png">
<meta property="og:locale" content="de_CH">
```

---

*Satoshi -- Bitcoin Kompendium -- Dokumentation v1.0 -- Maerz 2026*
