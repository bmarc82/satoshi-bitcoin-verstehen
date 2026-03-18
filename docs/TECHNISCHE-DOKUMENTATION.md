# Satoshi -- Technische Dokumentation & Installationsanleitung

> Vollstaendige technische Referenz fuer Entwicklung, Deployment und Wartung | v1.0 | Maerz 2026

---

## Inhaltsverzeichnis

1. [Systemvoraussetzungen](#1-systemvoraussetzungen)
2. [Technologie-Stack](#2-technologie-stack)
3. [Projektstruktur](#3-projektstruktur)
4. [Lokale Entwicklung](#4-lokale-entwicklung)
5. [Server-Deployment](#5-server-deployment)
6. [PWA-Installation](#6-pwa-installation)
7. [API-Konfiguration](#7-api-konfiguration)
8. [Service Worker](#8-service-worker)
9. [Icon-Generierung](#9-icon-generierung)
10. [Troubleshooting](#10-troubleshooting)
11. [Sicherheit](#11-sicherheit)
12. [Performance-Checkliste](#12-performance-checkliste)

---

## 1. Systemvoraussetzungen

### 1.1 Lokale Entwicklung

| Komponente | Anforderung |
|---|---|
| **Betriebssystem** | Windows 10+, macOS 12+, Linux (beliebig) |
| **Editor** | Visual Studio Code (empfohlen) |
| **Browser** | Chrome 90+ (empfohlen), Firefox 90+, Safari 15+, Edge 90+ |
| **Node.js** | Nicht erforderlich (kein Build-Step) |
| **Git** | Optional, empfohlen fuer Versionierung |

> **Hinweis:** Da die App aus reinem HTML/CSS/JS besteht, ist keine Build-Pipeline, kein Package Manager und kein Node.js erforderlich. Ein einfacher Webserver genuegt.

### 1.2 Produktions-Server

| Komponente | Minimum | Empfohlen |
|---|---|---|
| **Betriebssystem** | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| **RAM** | 512 MB | 2 GB |
| **CPU** | 1 vCore | 2 vCores |
| **Storage** | 10 GB SSD | 20 GB SSD |
| **Webserver** | Apache 2.4+ oder Nginx 1.20+ | Nginx 1.24+ |
| **SSL/TLS** | Let's Encrypt (Certbot) | Let's Encrypt (auto-renew) |
| **Domain** | A-Record auf Server-IP | A + AAAA-Record (IPv4 + IPv6) |

**Empfohlene Hosting-Anbieter:**

- Hetzner Cloud (CX11) -- ab ~3-5 CHF/Monat
- DigitalOcean (Basic Droplet) -- ab ~4-6 USD/Monat
- Contabo VPS -- ab ~4-5 EUR/Monat
- Shared Hosting mit SSH-Zugang (als Alternative)

---

## 2. Technologie-Stack

### 2.1 Frontend

| Technologie | Version | Zweck |
|---|---|---|
| **HTML5** | -- | Markup, semantische Struktur |
| **CSS3** | -- | Styling, Custom Properties, Responsive Design |
| **JavaScript** | ES6+ (Vanilla) | Interaktivitaet, API-Calls, Screen-Switching |
| **Google Fonts** | -- | Syne (Headlines), Lora (Body), Syne Mono (Daten) |
| **Web App Manifest** | W3C Spec | PWA-Metadaten, Installierbarkeit |
| **Service Worker** | W3C Spec | Offline-Caching, App-Shell-Pattern |

### 2.2 Externe APIs (Client-seitig)

| API | Version | Zweck |
|---|---|---|
| **blockchain.info** | REST | Blockhoehe, Hashrate, Difficulty |
| **CoinGecko** | v3 | BTC-Preis (CHF/EUR/USD), Marktdaten |
| **mempool.space** | v1 | Mempool-Groesse, Transaktionsgebuehren |

### 2.3 Bewusste Nicht-Verwendung

Die folgenden Technologien werden bewusst **nicht** eingesetzt:

- **Kein React, Vue, Angular** -- Vanilla JS reicht fuer diese Anwendung
- **Kein Tailwind, Bootstrap** -- Eigenes CSS-Design-System
- **Kein Webpack, Vite, Rollup** -- Kein Build-Step noetig
- **Kein npm/yarn** -- Keine JavaScript-Abhaengigkeiten
- **Kein Backend** -- Rein statische Dateien, APIs direkt vom Client

---

## 3. Projektstruktur

```
satoshi-app/
|
|-- index.html                <- Haupt-App (All-in-One: HTML + CSS + JS)
|                                ~3.700+ Zeilen, alle 17 Module
|
|-- manifest.json             <- PWA Web App Manifest
|                                Name, Icons, Theme, Display-Modus
|
|-- sw.js                     <- Service Worker
|                                Cache-first (Shell), Network-first (API)
|
|-- icons/                    <- App-Icons fuer alle Plattformen
|   |-- icon-192.png          <- Android/Chrome: PWA-Icon (192x192)
|   |-- icon-512.png          <- Splash/Maskable: grosses Icon (512x512)
|   |-- apple-touch-icon.png  <- iOS Safari: Home-Bildschirm (180x180)
|   +-- favicon.ico           <- Browser-Tab-Icon
|
|-- assets/                   <- Optionale Mediendateien
|   +-- (Bilder, Charts -- spaetere Phasen)
|
|-- docs/                     <- Dokumentation
|   |-- DOKUMENTATION.md      <- Durchgaengige Projektdokumentation
|   +-- TECHNISCHE-DOKUMENTATION.md  <- Diese Datei
|
|-- Satoshi-Projektbeschreibung_2.md  <- Originale Projektbeschreibung
|
+-- README.md                 <- Projekt-README
```

### 3.1 index.html -- Aufbau

Die `index.html` ist das Herzstück der App und enthaelt:

```
<html>
  <head>
    <!-- Meta Tags, Favicon, Manifest-Link, Font-Preload -->
    <style>
      /* Gesamtes CSS: ~800-1200 Zeilen */
      /* Variables, Reset, Layout, Components, Responsive */
    </style>
  </head>
  <body>
    <!-- 17 Screen-Container (je ein <section> oder <div>) -->
    <section id="screen-01-home">...</section>
    <section id="screen-02-geld">...</section>
    ...
    <section id="screen-17-youtube">...</section>

    <!-- Bottom Navigation Bar -->
    <nav id="bottom-nav">...</nav>

    <script>
      /* Gesamtes JavaScript: ~600-1000 Zeilen */
      /* Screen-Switching, API-Calls, Event-Listener, Animations */
    </script>
  </body>
</html>
```

---

## 4. Lokale Entwicklung

### 4.1 Voraussetzungen installieren

**Visual Studio Code:**

1. Download von https://code.visualstudio.com/
2. Installation durchfuehren
3. Folgende Extensions installieren:

```
ritwickdey.LiveServer          <- Live Server (Pflicht)
esbenp.prettier-vscode         <- Code-Formatter
formulahendry.auto-rename-tag  <- HTML-Tag-Hilfe
naumovs.color-highlight        <- CSS-Farben visualisieren
yzhang.markdown-all-in-one     <- Markdown-Unterstuetzung
```

**Extension installieren (via Terminal):**

```bash
code --install-extension ritwickdey.LiveServer
code --install-extension esbenp.prettier-vscode
```

### 4.2 Projekt einrichten

```bash
# Repository klonen (falls Git verwendet wird)
git clone <repository-url> satoshi-app
cd satoshi-app

# Oder: Dateien manuell in einen Ordner kopieren
# Keine weiteren Setup-Schritte noetig -- keine Abhaengigkeiten!
```

### 4.3 Live Server starten

**Option A -- VS Code Live Server Extension:**

1. Projekt-Ordner in VS Code oeffnen: `code .`
2. `index.html` oeffnen
3. Rechtsklick im Editor -> "Open with Live Server"
4. Oder: Status-Bar unten rechts -> "Go Live" klicken
5. Browser oeffnet automatisch `http://127.0.0.1:5500`

**Option B -- Python HTTP Server (ohne VS Code):**

```bash
# Python 3
cd /pfad/zum/satoshi-app
python3 -m http.server 8080

# Browser oeffnen: http://localhost:8080
```

**Option C -- Node.js HTTP Server (falls installiert):**

```bash
# npx (einmalig, ohne Installation)
npx serve .

# Oder global installiert
npm install -g serve
serve .
```

### 4.4 VS Code Workspace-Einstellungen

Empfohlene `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "liveServer.settings.port": 5500,
  "liveServer.settings.root": "/",
  "liveServer.settings.CustomBrowser": "chrome",
  "files.associations": {
    "*.html": "html"
  }
}
```

### 4.5 Browser DevTools fuer PWA-Testing

**Chrome DevTools (empfohlen):**

1. `F12` oder `Ctrl+Shift+I` / `Cmd+Option+I` oeffnen
2. **Application-Tab:**
   - Manifest: PWA-Manifest pruefen
   - Service Workers: Status, Update, Unregister
   - Cache Storage: Gecachte Dateien und API-Responses einsehen
   - Storage: localStorage-Eintraege pruefen
3. **Network-Tab:**
   - Offline-Modus simulieren (Checkbox "Offline")
   - API-Calls beobachten und debuggen
   - Throttling testen (Slow 3G, Fast 3G)
4. **Lighthouse-Tab:**
   - Audit durchfuehren: Performance, Accessibility, PWA, SEO, Best Practices
   - Mobile-Simulation aktivieren

**Service Worker manuell aktualisieren:**

```
Chrome DevTools -> Application -> Service Workers -> "Update on reload" aktivieren
```

**Cache leeren:**

```
Chrome DevTools -> Application -> Storage -> "Clear site data" klicken
```

---

## 5. Server-Deployment

### 5.1 Option A: Apache

#### Schritt 1 -- Server-Grundeinrichtung

```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Apache installieren
sudo apt install -y apache2

# Notwendige Module aktivieren
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod deflate
sudo a2enmod ssl

# Apache Status pruefen
sudo systemctl status apache2
```

#### Schritt 2 -- Verzeichnis erstellen und Dateien hochladen

```bash
# Webroot erstellen
sudo mkdir -p /var/www/satoshi

# Besitzer aendern (fuer rsync/scp)
sudo chown -R $USER:www-data /var/www/satoshi

# Dateien hochladen (lokal ausfuehren)
rsync -avz --delete \
  index.html manifest.json sw.js icons/ \
  user@server-ip:/var/www/satoshi/

# Berechtigungen setzen
sudo chown -R www-data:www-data /var/www/satoshi
sudo chmod -R 755 /var/www/satoshi
```

#### Schritt 3 -- Apache Virtual Host konfigurieren

```bash
sudo nano /etc/apache2/sites-available/satoshi.conf
```

Inhalt:

```apache
<VirtualHost *:80>
    ServerName satoshi.example.com
    ServerAlias www.satoshi.example.com
    DocumentRoot /var/www/satoshi

    # Redirect to HTTPS (nach SSL-Setup)
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</VirtualHost>

<VirtualHost *:443>
    ServerName satoshi.example.com
    DocumentRoot /var/www/satoshi

    # SSL (wird von Certbot automatisch ergaenzt)
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/satoshi.example.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/satoshi.example.com/privkey.pem

    <Directory /var/www/satoshi>
        AllowOverride All
        Require all granted
    </Directory>

    # Security Headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' https://api.blockchain.info https://api.coingecko.com https://mempool.space; img-src 'self' data:;"

    # Service Worker -- nie cachen
    <FilesMatch "sw\.js$">
        Header set Cache-Control "no-store"
    </FilesMatch>

    # HTML -- kein Cache
    <FilesMatch "\.html$">
        Header set Cache-Control "no-cache, must-revalidate"
    </FilesMatch>

    # Assets -- 1 Jahr Cache
    <FilesMatch "\.(css|js|png|ico|woff2|svg|jpg|jpeg|gif|webp)$">
        Header set Cache-Control "max-age=31536000, immutable"
    </FilesMatch>

    # GZIP Kompression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html
        AddOutputFilterByType DEFLATE text/css
        AddOutputFilterByType DEFLATE application/javascript
        AddOutputFilterByType DEFLATE application/json
        AddOutputFilterByType DEFLATE image/svg+xml
    </IfModule>
</VirtualHost>
```

#### Schritt 4 -- Site aktivieren und Apache neu starten

```bash
# Default-Site deaktivieren (optional)
sudo a2dissite 000-default.conf

# Satoshi-Site aktivieren
sudo a2ensite satoshi.conf

# Konfiguration testen
sudo apache2ctl configtest
# Erwartete Ausgabe: Syntax OK

# Apache neu laden
sudo systemctl reload apache2
```

#### Schritt 5 -- SSL mit Let's Encrypt

```bash
# Certbot installieren
sudo apt install -y certbot python3-certbot-apache

# Zertifikat beantragen (interaktiv)
sudo certbot --apache -d satoshi.example.com

# Automatische Erneuerung testen
sudo certbot renew --dry-run

# Cron-Job fuer automatische Erneuerung (normalerweise automatisch eingerichtet)
# Pruefen:
sudo systemctl list-timers | grep certbot
```

### 5.2 Option B: Nginx

#### Schritt 1 -- Nginx installieren

```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Nginx installieren
sudo apt install -y nginx

# Status pruefen
sudo systemctl status nginx
```

#### Schritt 2 -- Verzeichnis und Dateien

```bash
# Webroot erstellen
sudo mkdir -p /var/www/satoshi

# Dateien hochladen (lokal ausfuehren)
rsync -avz --delete \
  index.html manifest.json sw.js icons/ \
  user@server-ip:/var/www/satoshi/

# Berechtigungen
sudo chown -R www-data:www-data /var/www/satoshi
sudo chmod -R 755 /var/www/satoshi
```

#### Schritt 3 -- Nginx Server-Block konfigurieren

```bash
sudo nano /etc/nginx/sites-available/satoshi
```

Inhalt:

```nginx
# HTTP -> HTTPS Redirect
server {
    listen 80;
    listen [::]:80;
    server_name satoshi.example.com www.satoshi.example.com;
    return 301 https://$host$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name satoshi.example.com;

    root /var/www/satoshi;
    index index.html;

    # SSL-Zertifikate (nach Certbot-Setup)
    ssl_certificate     /etc/letsencrypt/live/satoshi.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/satoshi.example.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' https://api.blockchain.info https://api.coingecko.com https://mempool.space; img-src 'self' data:;" always;

    # Service Worker -- nie cachen
    location = /sw.js {
        add_header Cache-Control "no-store" always;
        add_header X-Content-Type-Options "nosniff" always;
    }

    # Manifest -- kurzer Cache
    location = /manifest.json {
        add_header Cache-Control "no-cache, must-revalidate" always;
    }

    # HTML -- kein Cache
    location ~* \.html$ {
        add_header Cache-Control "no-cache, must-revalidate" always;
    }

    # Statische Assets -- 1 Jahr Cache
    location ~* \.(css|js|png|ico|woff2|svg|jpg|jpeg|gif|webp)$ {
        add_header Cache-Control "max-age=31536000, immutable" always;
        access_log off;
    }

    # GZIP Kompression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/html
        text/css
        application/javascript
        application/json
        image/svg+xml
        text/plain;

    # SPA-Fallback: alle Routen auf index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Kein Zugriff auf versteckte Dateien
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

#### Schritt 4 -- Site aktivieren

```bash
# Symlink erstellen
sudo ln -s /etc/nginx/sites-available/satoshi /etc/nginx/sites-enabled/

# Default-Site entfernen (optional)
sudo rm /etc/nginx/sites-enabled/default

# Konfiguration testen
sudo nginx -t
# Erwartete Ausgabe: syntax is ok / test is successful

# Nginx neu laden
sudo systemctl reload nginx
```

#### Schritt 5 -- SSL mit Let's Encrypt

```bash
# Certbot fuer Nginx installieren
sudo apt install -y certbot python3-certbot-nginx

# Zertifikat beantragen
sudo certbot --nginx -d satoshi.example.com

# Automatische Erneuerung testen
sudo certbot renew --dry-run
```

### 5.3 SSL/TLS mit Let's Encrypt -- Detailliert

```bash
# 1. Certbot installieren (falls nicht bereits geschehen)
sudo apt install -y certbot

# Fuer Apache:
sudo apt install -y python3-certbot-apache

# Fuer Nginx:
sudo apt install -y python3-certbot-nginx

# 2. Zertifikat beantragen
# Apache:
sudo certbot --apache -d satoshi.example.com -d www.satoshi.example.com

# Nginx:
sudo certbot --nginx -d satoshi.example.com -d www.satoshi.example.com

# 3. Automatische Erneuerung pruefen
sudo certbot renew --dry-run

# 4. Erneuerungs-Timer pruefen
sudo systemctl list-timers | grep certbot

# 5. Manuell erneuern (falls noetig)
sudo certbot renew

# 6. Zertifikat-Status pruefen
sudo certbot certificates
```

**Wichtig:** HTTPS ist **Pflicht** fuer Service Worker. Ohne HTTPS funktioniert die PWA-Installation nicht (Ausnahme: `localhost` fuer Entwicklung).

### 5.4 DNS-Konfiguration

Beim Domain-Registrar folgende DNS-Records einrichten:

```
Typ     Name                    Wert                TTL
A       satoshi.example.com     <SERVER-IPv4>       300
AAAA    satoshi.example.com     <SERVER-IPv6>       300
CNAME   www.satoshi.example.com satoshi.example.com  300
```

**DNS-Propagierung pruefen:**

```bash
# A-Record pruefen
dig satoshi.example.com A +short

# Von aussen pruefen
nslookup satoshi.example.com 8.8.8.8

# HTTP-Response testen
curl -I https://satoshi.example.com
```

---

## 6. PWA-Installation

### 6.1 Android (Chrome)

1. `https://satoshi.example.com` in Chrome oeffnen
2. Chrome zeigt automatisch einen Install-Banner am unteren Bildschirmrand
3. Alternativ: Drei-Punkte-Menue (oben rechts) -> "App installieren" / "Zum Startbildschirm hinzufuegen"
4. Bestaetigen -> App-Icon erscheint auf dem Homescreen
5. App oeffnet sich im Standalone-Modus (ohne Browser-UI)

**Voraussetzungen fuer automatischen Install-Banner:**

- HTTPS aktiv
- Gueltiges Web App Manifest (`manifest.json`)
- Service Worker registriert
- Benutzer hat die Seite mindestens 30 Sekunden besucht

### 6.2 iOS (Safari)

1. `https://satoshi.example.com` in **Safari** oeffnen (nur Safari unterstuetzt PWA auf iOS)
2. Teilen-Button antippen (Quadrat mit Pfeil nach oben)
3. "Zum Home-Bildschirm" waehlen
4. Name bestaetigen (Vorschlag aus `manifest.json`)
5. "Hinzufuegen" antippen
6. App-Icon erscheint auf dem Homescreen

**iOS-Besonderheiten:**

- Kein automatischer Install-Banner (Apple-Einschraenkung)
- Service Worker funktioniert, aber mit Einschraenkungen (kein Background-Sync)
- `apple-touch-icon.png` (180x180) wird fuer das Homescreen-Icon verwendet
- `<meta name="apple-mobile-web-app-capable" content="yes">` erforderlich fuer Standalone-Modus
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` fuer Status-Bar-Styling

### 6.3 Desktop (Chrome / Edge)

1. `https://satoshi.example.com` in Chrome oder Edge oeffnen
2. In der Adressleiste erscheint ein Install-Icon (Monitor mit Pfeil)
3. Klicken -> "Installieren" bestaetigen
4. App oeffnet sich in eigenem Fenster (Standalone-Modus)
5. Verfuegbar ueber Start-Menue / Launchpad / App-Drawer

**Desktop-Deinstallation:**

- Chrome: `chrome://apps` -> Rechtsklick -> "Aus Chrome entfernen"
- Edge: `edge://apps` -> Drei-Punkte-Menue -> "Deinstallieren"

---

## 7. API-Konfiguration

### 7.1 Endpunkte und Rate-Limits

#### blockchain.info

| Endpunkt | Methode | Rate-Limit | Auth |
|---|---|---|---|
| `https://api.blockchain.info/stats` | GET | ~10 Req/Min | Kein API-Key |
| `https://blockchain.info/q/getblockcount` | GET | ~10 Req/Min | Kein API-Key |
| `https://blockchain.info/q/hashrate` | GET | ~10 Req/Min | Kein API-Key |

#### CoinGecko API v3

| Endpunkt | Methode | Rate-Limit | Auth |
|---|---|---|---|
| `https://api.coingecko.com/api/v3/simple/price` | GET | 10-30 Req/Min (Free) | Kein API-Key (Free) |
| `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart` | GET | 10-30 Req/Min (Free) | Kein API-Key (Free) |

**CoinGecko Pro (optional, fuer hoehere Limits):**

- URL: `https://pro-api.coingecko.com/api/v3/...`
- Header: `x-cg-pro-api-key: YOUR_API_KEY`
- Limit: 500 Req/Min

#### mempool.space API v1

| Endpunkt | Methode | Rate-Limit | Auth |
|---|---|---|---|
| `https://mempool.space/api/v1/fees/recommended` | GET | Grosszuegig | Kein API-Key |
| `https://mempool.space/api/mempool` | GET | Grosszuegig | Kein API-Key |

### 7.2 Fallback-Strategie

Die App implementiert eine dreistufige Fallback-Kette:

```
Stufe 1: Live-API-Call (Netzwerk)
    |
    +-- Erfolg -> Daten anzeigen + localStorage + SW-Cache aktualisieren
    |
    +-- Fehler/Timeout (8s) ->
        |
        Stufe 2: localStorage-Cache
            |
            +-- Vorhanden -> Gecachte Daten anzeigen (mit Zeitstempel-Hinweis)
            |
            +-- Nicht vorhanden ->
                |
                Stufe 3: Platzhalter / Statische Fallback-Werte
                    +-- Anzeige: "--" oder vordefinierte Fallback-Werte
```

**Implementierung:**

```javascript
async function fetchWithFallback(url, cacheKey) {
  try {
    const res = await Promise.race([
      fetch(url),
      new Promise((_, rej) => setTimeout(() => rej('timeout'), 8000))
    ]);
    const data = await res.json();
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      ts: Date.now()
    }));
    return data;
  } catch {
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached).data : null;
  }
}
```

### 7.3 Optional: Proxy-Server fuer API-Keys

Falls in spaeteren Phasen kostenpflichtige APIs (z.B. CoinGecko Pro) genutzt werden, sollte ein serverseitiger Proxy die API-Keys schuetzen:

**Einfacher Node.js-Proxy (Express):**

```javascript
// proxy-server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();

const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

app.get('/api/price', async (req, res) => {
  try {
    const response = await fetch(
      'https://pro-api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=chf,eur,usd&include_24hr_change=true',
      { headers: { 'x-cg-pro-api-key': COINGECKO_API_KEY } }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'API request failed' });
  }
});

app.listen(3001, () => console.log('Proxy running on :3001'));
```

**Starten:**

```bash
COINGECKO_API_KEY=your_key_here node proxy-server.js
```

**Nginx Reverse Proxy (optional):**

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 8. Service Worker

### 8.1 Caching-Strategie

Der Service Worker (`sw.js`) implementiert zwei verschiedene Strategien:

**Cache-first (App Shell):**

```
Request -> Cache vorhanden?
    |           |
    Ja          Nein
    |           |
    Cache       Netzwerk -> Response cachen -> Antwort
    zurueck     |
                Netzwerk-Fehler -> Fallback auf /index.html
```

- Fuer: `index.html`, `manifest.json`, Icons, statische Assets
- Vorteil: Sofortiges Laden, Offline-faehig
- Cache-Name: `satoshi-v1`

**Network-first mit TTL (API-Daten):**

```
Request -> Netzwerk
    |
    +-- Erfolg -> Response + Zeitstempel cachen -> Antwort
    |
    +-- Fehler -> Cache vorhanden UND TTL nicht abgelaufen?
                    |           |
                    Ja          Nein
                    |           |
                    Cache       503 JSON Response
                    zurueck     (offline)
```

- Fuer: blockchain.info, CoinGecko, mempool.space
- TTL: 5 Minuten (`API_TTL = 5 * 60 * 1000`)
- Cache-Name: `satoshi-api-v1`

### 8.2 Cache-Versionierung

Die Cache-Version wird ueber Konstanten im Service Worker gesteuert:

```javascript
const SHELL_CACHE = 'satoshi-v1';    // App Shell
const API_CACHE   = 'satoshi-api-v1'; // API Responses
```

**Bei einem Update:**

1. Cache-Version erhoehen (z.B. `satoshi-v2`)
2. Der neue Service Worker wird beim naechsten Besuch installiert
3. Im `activate`-Event werden alte Caches geloescht:

```javascript
self.addEventListener('activate', (event) => {
  const keepCaches = new Set([SHELL_CACHE, API_CACHE]);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => !keepCaches.has(key))
            .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});
```

### 8.3 Update-Mechanismus

Der Service Worker aktualisiert sich automatisch:

1. Browser prueft bei jedem Seitenbesuch, ob `sw.js` sich geaendert hat
2. Falls ja: Neuer Service Worker wird im Hintergrund installiert (`install`-Event)
3. Neuer SW wartet, bis alle Tabs geschlossen werden (oder `skipWaiting()` aufgerufen wird)
4. Beim naechsten Oeffnen: Neuer SW uebernimmt (`activate`-Event)
5. Alte Caches werden geloescht

**Sofortige Aktivierung** (in der aktuellen Implementierung):

```javascript
self.addEventListener('install', (event) => {
  // ...
  self.skipWaiting(); // Sofort aktivieren, nicht auf Tab-Schliessung warten
});
```

**HTTP-Header fuer sw.js:**

```
Cache-Control: no-store
```

Dies stellt sicher, dass der Browser immer die neueste Version vom Server holt.

---

## 9. Icon-Generierung

### 9.1 Benoetigte Formate und Groessen

| Dateiname | Groesse | Zweck | Format |
|---|---|---|---|
| `icon-192.png` | 192x192 px | Android/Chrome PWA-Icon | PNG, 32-bit |
| `icon-512.png` | 512x512 px | Splash Screen, Maskable Icon | PNG, 32-bit |
| `apple-touch-icon.png` | 180x180 px | iOS Safari Homescreen | PNG, 32-bit |
| `favicon.ico` | 32x32 px (multi) | Browser-Tab | ICO (16+32px) |

**Optionale zusaetzliche Groessen:**

| Groesse | Zweck |
|---|---|
| 48x48 | Android Notification Icon |
| 72x72 | iPad (ohne Retina) |
| 96x96 | Android Chrome |
| 128x128 | Chrome Web Store |
| 144x144 | Windows 8/10 Tiles |
| 152x152 | iPad Retina |
| 256x256 | Allgemein |
| 384x384 | Android Splash |

### 9.2 Design-Vorgaben

- **Hintergrund:** `#080C10` (App-Hintergrund) oder transparent
- **Symbol:** Bitcoin-Logo (B mit Strichen) in `#F7B731` (Gold)
- **Safe Zone (Maskable):** Zentrales Motiv innerhalb von 80% des Icons (40% Padding auf jeder Seite fuer maskable Icons)
- **Kontrast:** Gold auf Dunkel -- hoher Kontrast fuer alle Groessen

### 9.3 Tools zur Generierung

**Aus SVG-Basis-Datei:**

1. **Erstelle eine SVG-Datei** (`icon-base.svg`) mit dem Bitcoin-Logo auf dunklem Hintergrund
2. Verwende eines der folgenden Tools:

**Online-Tools:**

- **RealFaviconGenerator** (https://realfavicongenerator.net/) -- Empfohlen
  - SVG hochladen -> alle Groessen automatisch generiert
  - Inkl. maskable, Apple Touch, favicon.ico, Manifest-Snippet
- **PWA Asset Generator** (https://progressier.com/pwa-icons-and-splash-screen-generator)
- **Maskable.app** (https://maskable.app/) -- Maskable Icon testen und erstellen

**Kommandozeilen-Tools:**

```bash
# ImageMagick (SVG zu PNG in verschiedenen Groessen)
sudo apt install -y imagemagick

# Einzelne Groessen generieren
convert icon-base.svg -resize 192x192 icons/icon-192.png
convert icon-base.svg -resize 512x512 icons/icon-512.png
convert icon-base.svg -resize 180x180 icons/apple-touch-icon.png
convert icon-base.svg -resize 32x32 icons/favicon-32.png
convert icon-base.svg -resize 16x16 icons/favicon-16.png

# Favicon.ico (Multi-Resolution)
convert icons/favicon-16.png icons/favicon-32.png icons/favicon.ico
```

```bash
# Alternativ: sharp-cli (Node.js)
npx sharp-cli -i icon-base.svg -o icons/icon-192.png resize 192 192
npx sharp-cli -i icon-base.svg -o icons/icon-512.png resize 512 512
npx sharp-cli -i icon-base.svg -o icons/apple-touch-icon.png resize 180 180
```

**Maskable Icon testen:**

1. https://maskable.app/editor oeffnen
2. `icon-512.png` hochladen
3. Verschiedene Masken-Formen testen (Kreis, Squircle, etc.)
4. Sicherstellen, dass das zentrale Motiv in der Safe Zone liegt

---

## 10. Troubleshooting

### 10.1 Haeufige Probleme und Loesungen

#### Problem: App zeigt keine Live-Daten

**Ursachen und Loesungen:**

1. **CORS-Fehler:** Browser blockiert API-Anfragen
   - Pruefen: DevTools -> Console auf CORS-Fehlermeldungen
   - Loesung: Alle verwendeten APIs (blockchain.info, CoinGecko, mempool.space) erlauben CORS. Sicherstellen, dass keine Proxy/Firewall die Anfragen blockiert.

2. **API Rate-Limit erreicht:**
   - Pruefen: DevTools -> Network -> API-Calls mit Status 429
   - Loesung: Refresh-Intervalle erhoehen, CoinGecko Pro verwenden

3. **API voruebergehend nicht erreichbar:**
   - Pruefen: API-Endpunkt direkt im Browser aufrufen
   - Loesung: Fallback-Werte aus localStorage werden automatisch angezeigt

#### Problem: PWA-Installation nicht moeglich

**Checkliste:**

- [ ] HTTPS aktiv? (Service Worker funktioniert nur ueber HTTPS oder localhost)
- [ ] `manifest.json` korrekt verlinkt? (`<link rel="manifest" href="/manifest.json">`)
- [ ] `manifest.json` valide? (Pruefen: DevTools -> Application -> Manifest)
- [ ] Service Worker registriert? (Pruefen: DevTools -> Application -> Service Workers)
- [ ] Icons vorhanden? (Mindestens 192x192 und 512x512)
- [ ] `start_url` erreichbar?
- [ ] `display: "standalone"` gesetzt?

#### Problem: App aktualisiert sich nicht

**Ursachen und Loesungen:**

1. **Service Worker gecacht:**
   - Loesung: Cache-Version im SW erhoehen (`satoshi-v2`)
   - Loesung: DevTools -> Application -> Service Workers -> "Update on reload"

2. **Browser-Cache:**
   - Loesung: Hard-Refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`)
   - Loesung: DevTools -> Application -> Storage -> "Clear site data"

3. **HTTP-Header falsch:**
   - `sw.js` muss `Cache-Control: no-store` haben
   - `index.html` muss `Cache-Control: no-cache` haben

#### Problem: Seite laed langsam

**Pruefen und Loesungen:**

1. **Google Fonts blockieren:**
   - Loesung: `<link rel="preconnect" href="https://fonts.googleapis.com">` hinzufuegen
   - Loesung: `font-display: swap` im CSS verwenden

2. **Grosse Bilder:**
   - Loesung: Bilder komprimieren (WebP, optimierte PNG)
   - Loesung: Lazy Loading fuer Bilder ausserhalb des Viewports

3. **Nicht komprimierter Transfer:**
   - Loesung: GZIP-Kompression auf dem Server aktivieren (siehe Deployment-Konfiguration)

### 10.2 Service Worker debuggen

**Chrome DevTools:**

```
Application-Tab -> Service Workers:

- Status: "activated and is running" = OK
- "Waiting to activate" = Neuer SW wartet auf Tab-Schliessung
- "Redundant" = SW wurde ersetzt

Aktionen:
- "Update": Manuelles Update erzwingen
- "Unregister": SW komplett entfernen (fuer sauberen Neustart)
- "Update on reload": Bei jedem Reload neuen SW installieren (Entwicklung)
```

**Service Worker komplett zuruecksetzen:**

```javascript
// In der Browser-Console ausfuehren:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
console.log('Service Worker und Caches geloescht. Seite neu laden.');
```

**SW-Logging aktivieren (temporaer):**

```javascript
// In sw.js temporaer hinzufuegen:
self.addEventListener('fetch', (event) => {
  console.log('[SW] Fetch:', event.request.url);
  // ... Rest des Fetch-Handlers
});
```

### 10.3 API-Probleme diagnostizieren

**API-Endpunkte manuell testen:**

```bash
# blockchain.info
curl -s https://api.blockchain.info/stats | jq .

# CoinGecko
curl -s "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=chf,eur,usd" | jq .

# mempool.space
curl -s https://mempool.space/api/v1/fees/recommended | jq .
```

**Im Browser (DevTools Console):**

```javascript
// Quick API Test
fetch('https://api.blockchain.info/stats')
  .then(r => r.json())
  .then(d => console.log('blockchain.info:', d))
  .catch(e => console.error('Fehler:', e));

fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=chf')
  .then(r => r.json())
  .then(d => console.log('CoinGecko:', d))
  .catch(e => console.error('Fehler:', e));

fetch('https://mempool.space/api/v1/fees/recommended')
  .then(r => r.json())
  .then(d => console.log('mempool.space:', d))
  .catch(e => console.error('Fehler:', e));
```

**localStorage-Cache pruefen:**

```javascript
// Alle Satoshi-Cache-Eintraege anzeigen
Object.keys(localStorage)
  .filter(k => k.startsWith('satoshi_'))
  .forEach(k => {
    const entry = JSON.parse(localStorage.getItem(k));
    console.log(k, '|', new Date(entry.ts).toLocaleString(), '|', entry.data);
  });
```

---

## 11. Sicherheit

### 11.1 Content Security Policy (CSP)

Die CSP definiert, welche Ressourcen die App laden darf:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  connect-src 'self'
    https://api.blockchain.info
    https://api.coingecko.com
    https://mempool.space;
  img-src 'self' data:;
```

**Erklaerung:**

| Direktive | Erlaubt | Zweck |
|---|---|---|
| `default-src 'self'` | Nur eigene Domain | Basis-Einschraenkung |
| `script-src 'self' 'unsafe-inline'` | Eigene Scripts + Inline | Inline-JS in index.html |
| `style-src 'self' 'unsafe-inline' fonts.googleapis.com` | Eigene Styles + Inline + Google Fonts CSS | Inline-CSS + Font-Definitionen |
| `font-src fonts.gstatic.com` | Google Fonts Dateien | Syne, Lora, Syne Mono |
| `connect-src 'self' ...` | API-Endpunkte | blockchain.info, CoinGecko, mempool.space |
| `img-src 'self' data:` | Eigene Bilder + Data-URIs | Icons, Inline-SVGs |

**Hinweis:** `'unsafe-inline'` ist noetig, da CSS und JavaScript inline in `index.html` eingebettet sind. Fuer hoehere Sicherheit koennten diese in externe Dateien ausgelagert und mit Nonces/Hashes versehen werden.

### 11.2 HTTPS

- **Pflicht:** Service Worker funktionieren nur ueber HTTPS (oder localhost)
- **Implementierung:** Let's Encrypt via Certbot (kostenlos, automatische Erneuerung)
- **HSTS:** `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- **Redirect:** HTTP -> HTTPS Redirect via Server-Konfiguration (301)

### 11.3 CORS

Alle verwendeten APIs erlauben Cross-Origin-Requests:

| API | CORS-Status |
|---|---|
| blockchain.info | CORS-Headers gesetzt (erlaubt) |
| CoinGecko | CORS-Headers gesetzt (erlaubt) |
| mempool.space | CORS-Headers gesetzt (erlaubt) |

**Kein serverseitiger Proxy noetig** in Phase 1. Falls zukuenftige APIs CORS nicht erlauben, kann ein Reverse Proxy auf dem eigenen Server eingerichtet werden.

### 11.4 Zusaetzliche Security Headers

| Header | Wert | Zweck |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Verhindert MIME-Sniffing |
| `X-Frame-Options` | `DENY` | Verhindert Einbettung in iFrames (Clickjacking) |
| `X-XSS-Protection` | `1; mode=block` | Aktiviert XSS-Filter des Browsers |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Beschraenkt Referrer-Informationen |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Erzwingt HTTPS fuer 1 Jahr |

### 11.5 Datenschutz

- **Keine Cookies:** Die App setzt keine Cookies
- **Keine Tracker:** Kein Google Analytics, kein Facebook Pixel
- **Kein Backend:** Keine Nutzerdaten werden serverseitig gespeichert
- **localStorage:** Nur fuer API-Cache, keine persoenlichen Daten
- **DSGVO / DSG CH:** Konform -- keine personenbezogenen Daten werden erhoben

---

## 12. Performance-Checkliste

### 12.1 Lighthouse Audit durchfuehren

```
1. Chrome oeffnen -> Satoshi-App laden
2. DevTools oeffnen (F12)
3. Tab "Lighthouse" waehlen
4. Einstellungen:
   - Mode: Navigation
   - Device: Mobile
   - Categories: alle (Performance, Accessibility, Best Practices, SEO, PWA)
5. "Analyze page load" klicken
6. Ergebnis: Alle Kategorien sollten > 90 sein
```

### 12.2 Core Web Vitals pruefen

**Mit Chrome DevTools:**

```
1. DevTools -> Performance-Tab
2. "Record" klicken -> Seite neu laden -> "Stop"
3. Metriken ablesen: LCP, FID, CLS
```

**Mit Web Vitals Extension:**

```
1. Chrome Extension "Web Vitals" installieren
2. Satoshi-App laden
3. Extension-Icon zeigt Live-Werte fuer LCP, FID, CLS
```

**Zielwerte:**

| Metrik | Gut | Verbesserungswuerdig | Schlecht |
|---|---|---|---|
| **LCP** | < 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** | < 100ms | 100ms - 300ms | > 300ms |
| **CLS** | < 0.1 | 0.1 - 0.25 | > 0.25 |
| **FCP** | < 1.8s | 1.8s - 3.0s | > 3.0s |
| **TTFB** | < 800ms | 800ms - 1800ms | > 1800ms |

### 12.3 Performance-Optimierungen (Checkliste)

**Server-seitig:**

- [ ] GZIP/Brotli Kompression aktiviert
- [ ] HTTP/2 aktiviert (Nginx: `listen 443 ssl http2`)
- [ ] Statische Assets: `Cache-Control: max-age=31536000, immutable`
- [ ] HTML: `Cache-Control: no-cache, must-revalidate`
- [ ] Service Worker: `Cache-Control: no-store`

**Client-seitig:**

- [ ] Google Fonts: `<link rel="preconnect">` gesetzt
- [ ] Fonts: `font-display: swap` im CSS
- [ ] Bilder: Optimierte PNG/WebP (< 100KB pro Icon)
- [ ] Kein Render-Blocking JavaScript
- [ ] Inline-CSS (kein externer Stylesheet-Request)
- [ ] Service Worker: App Shell pre-cached

**Monitoring:**

- [ ] Lighthouse Audit: Alle Kategorien > 90
- [ ] Core Web Vitals: Im gruenen Bereich
- [ ] Offline-Test: App funktioniert ohne Netzwerk
- [ ] Mobile-Test: Responsive auf 320px - 1440px
- [ ] API-Fallback-Test: Daten bei API-Ausfall aus Cache

### 12.4 Deployment-Verifikation

Nach jedem Deployment folgende Checks durchfuehren:

```bash
# 1. HTTPS-Redirect pruefen
curl -I http://satoshi.example.com
# Erwartung: 301 Redirect auf https://

# 2. Security Headers pruefen
curl -I https://satoshi.example.com
# Erwartung: X-Content-Type-Options, X-Frame-Options, CSP, HSTS

# 3. Service Worker Header pruefen
curl -I https://satoshi.example.com/sw.js
# Erwartung: Cache-Control: no-store

# 4. GZIP pruefen
curl -H "Accept-Encoding: gzip" -I https://satoshi.example.com
# Erwartung: Content-Encoding: gzip

# 5. SSL-Zertifikat pruefen
openssl s_client -connect satoshi.example.com:443 -servername satoshi.example.com < /dev/null 2>/dev/null | openssl x509 -noout -dates
# Erwartung: Gueltigkeitsdatum in der Zukunft
```

**Online-Tools fuer Verifikation:**

- **SSL Labs:** https://www.ssllabs.com/ssltest/ (SSL-Konfiguration)
- **Security Headers:** https://securityheaders.com/ (HTTP-Headers)
- **PageSpeed Insights:** https://pagespeed.web.dev/ (Performance)
- **PWA Builder:** https://www.pwabuilder.com/ (PWA-Kompatibilitaet)
- **Lighthouse CI:** Automatisierte Lighthouse-Tests in CI/CD

---

*Satoshi -- Technische Dokumentation & Installationsanleitung v1.0 -- Maerz 2026*
