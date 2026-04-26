# Deployment-Guide — Satoshi PWA

Dieses Dokument ist die **autoritative Anleitung** zum Deploy der App auf einen Linux-Server mit nginx. Alternative Varianten (Apache, statische Hoster) am Ende.

## Repo-Struktur (Stand v3.3.0)

```
BITS-SATOSHI-APP/
├── public/                        # Document-Root für Webserver
│   ├── index.html                 # Haupt-App (~20'000 Zeilen)
│   ├── sw.js                      # Service Worker
│   ├── rabbit-hole.js             # Rabbit-Hole-Modul
│   ├── manifest.json              # PWA-Manifest
│   ├── sitemap.xml                # 45 URLs für SEO
│   ├── robots.txt                 # Crawler-Steuerung
│   ├── .htaccess                  # Apache-Hoster-Fallback
│   └── icons/
│       ├── icon.svg               # App-Icon (PWA)
│       └── donation-qr.svg        # QR-Code Spendenadresse (SHA-256-verifiziert)
├── server/                        # nginx-Konfig (kopieren auf Server)
│   ├── nginx.conf
│   └── nginx-security-headers.conf
├── scripts/                       # Lokale Dev-Tools
│   ├── check.js                   # Build-Validation (HTML, Hashes, …)
│   └── dev-server.js              # Lokaler HTTP-Server mit SPA-Fallback
├── docs/
│   ├── DEPLOYMENT.md              # diese Datei
│   ├── DEPLOY-NGINX.md            # nginx-Spezifika (alt, ergänzend)
│   ├── DOKUMENTATION.md           # Inhalts-/UX-Doku
│   └── TECHNISCHE-DOKUMENTATION.md
├── package.json                   # npm-Skripte (optional)
├── README.md, LICENSE, CONTRIBUTING.md, .gitignore
```

**Was wird deployt?** Nur `public/`. Alles andere ist Source/Doku/Tools.

---

## Voraussetzungen

| Komponente | Version | Anmerkung |
|---|---|---|
| Server | Linux (Ubuntu/Debian) | nginx-Pakete verfügbar |
| nginx | ≥ 1.18 | für `try_files`, HTTP/2 |
| Domain | btc-klar.ch (Beispiel) | A-Record auf Server-IP |
| TLS | Let's Encrypt (Certbot) | für HTTPS-Redirect & HSTS |
| Node.js (lokal) | ≥ 18 | nur für `check.js` und `dev-server.js` |

---

## Pre-Deploy-Check (lokal)

Vor jedem Deploy auf dem Entwickler-Rechner:

```bash
# Im Repo-Root
node scripts/check.js
```

Erwartete Ausgabe: `✓ Alle Checks grün`. Falls Fehler:
- **donationHash MISMATCH** → Adresse oder Hash in `public/index.html` (`SITE_CONFIG.donationAddr` / `donationHash`) korrigieren
- **donationQrHash MISMATCH** → QR neu generieren (siehe unten)
- **MODULES ↔ Screens** → Modul-Eintrag oder Screen fehlt
- **navigateTo()-Targets** → toter Link in HTML

### QR-Code neu generieren (falls Adresse geändert)

```bash
# Ersetze BC1Q… durch deine neue Adresse
npx --yes qrcode -t svg -o public/icons/donation-qr.svg "bitcoin:bc1qvhqvaf3kppfntq0e949ktfkepkgt6sxm33adwh"

# Neuen Hash berechnen und in public/index.html SITE_CONFIG.donationQrHash eintragen
node -e "console.log(require('crypto').createHash('sha256').update(require('fs').readFileSync('public/icons/donation-qr.svg')).digest('hex'))"

# Anschliessend re-check
node scripts/check.js
```

---

## Deploy-Schritte (nginx)

### 1. Server vorbereiten (einmalig)

```bash
# Auf dem Server
sudo apt update && sudo apt install nginx certbot python3-certbot-nginx -y

# Web-Root anlegen
sudo mkdir -p /var/www/btc-klar.ch
sudo chown -R www-data:www-data /var/www/btc-klar.ch

# Snippets-Verzeichnis
sudo mkdir -p /etc/nginx/snippets
```

### 2. nginx-Konfig deployen

```bash
# Vom lokalen Rechner aus, im Repo-Root
scp server/nginx.conf user@server:/tmp/btc-klar.ch.conf
scp server/nginx-security-headers.conf user@server:/tmp/

# Auf dem Server
sudo mv /tmp/btc-klar.ch.conf /etc/nginx/sites-available/btc-klar.ch
sudo mv /tmp/nginx-security-headers.conf /etc/nginx/snippets/satoshi-security-headers.conf
sudo ln -sf /etc/nginx/sites-available/btc-klar.ch /etc/nginx/sites-enabled/btc-klar.ch
```

### 3. TLS-Zertifikat beziehen

```bash
sudo certbot --nginx -d btc-klar.ch -d www.btc-klar.ch
# Folgt den Prompts (E-Mail, ToS akzeptieren)
# Certbot trägt SSL-Pfade automatisch in nginx ein
```

### 4. Pre-Compression + App-Files deployen

```bash
# Erst .br/.gz-Varianten erzeugen (Brotli/Gzip-Fallback,
# falls Hostpoint mod_deflate/mod_brotli nicht zur Laufzeit anwendet —
# spart auf btc-klar.ch ~80% HTML-Übertragung)
node scripts/compress.js

# Dann sync — die .br/.gz-Files werden mitkopiert und via .htaccess
# automatisch ausgeliefert (siehe public/.htaccess Rewrite-Regeln)
rsync -avz --delete public/ user@server:/var/www/btc-klar.ch/
```

Wichtig: `--delete` entfernt veraltete Files auf dem Server. Den Trailing-Slash hinter `public/` nicht vergessen — sonst landet ein `public/`-Subordner unter dem Webroot. Wer den Compress-Schritt vergisst, verliert die ~80% HTML-Brotli-Einsparung — die Site funktioniert aber trotzdem.

### 5. nginx-Konfig validieren + reloaden

```bash
# Auf dem Server
sudo nginx -t                    # syntax-check
sudo systemctl reload nginx      # statt restart, damit kein Downtime
```

### 6. Smoke-Test

```bash
# Erreichbarkeit
curl -I https://btc-klar.ch/                           # 200
curl -I https://btc-klar.ch/blockchain                 # 200 (SPA-Fallback)
curl -I https://btc-klar.ch/sw.js                      # 200, Cache-Control: no-store
curl -I https://btc-klar.ch/icons/donation-qr.svg      # 200

# Security-Header
curl -I https://btc-klar.ch/blockchain | grep -iE "strict-transport|content-security|x-frame"
# → sollte HSTS, CSP, X-Frame-Options zeigen

# HTTP → HTTPS
curl -I http://btc-klar.ch                              # 301
curl -I https://www.btc-klar.ch                         # 301 → non-www
```

---

## Update-Deploy (laufender Betrieb)

### Bei kleinen Änderungen (Inhalt, Bugfix)

```bash
# Lokal
node scripts/check.js   # Pre-Check

# Auf den Server
rsync -avz --delete public/ user@server:/var/www/btc-klar.ch/

# nginx braucht KEINEN Reload — nur statische Files
```

### Bei Service-Worker-Update (sw.js geändert)

1. **Cache-Version bumpen** in `public/sw.js`:
   ```js
   const SHELL_CACHE = 'satoshi-vXX';   // XX hochzählen
   ```
2. **APP_VERSION bumpen** in `public/index.html`:
   ```js
   const APP_VERSION = '3.X.0';
   const APP_BUILD = 'YYYY-MM-DD';
   ```
3. **Changelog-Eintrag** im selben File (`CHANGELOG`-Array)
4. Deploy wie oben

User sehen einen Update-Banner, sobald der neue SW heruntergeladen ist. Klick → SW übernimmt → Page-Reload.

### Bei nginx-Änderungen (Security-Headers, neue Locations)

```bash
# Konfig deployen
scp server/nginx.conf user@server:/tmp/
scp server/nginx-security-headers.conf user@server:/tmp/

# Auf dem Server
sudo mv /tmp/nginx.conf /etc/nginx/sites-available/btc-klar.ch
sudo mv /tmp/nginx-security-headers.conf /etc/nginx/snippets/satoshi-security-headers.conf
sudo nginx -t && sudo systemctl reload nginx
```

---

## Lokal entwickeln

```bash
# Repo-Root
node scripts/dev-server.js
# → http://127.0.0.1:8765
```

Der Server simuliert nginx's `try_files`-Verhalten: `/blockchain`, `/lightning` etc. liefern `index.html` zurück, statische Assets werden direkt ausgeliefert.

Build-Check vor jedem Commit:
```bash
node scripts/check.js
```

---

## Verifikation nach Deploy

| Test | URL / Befehl | Erwartung |
|------|------|-----------|
| Homepage | `https://btc-klar.ch/` | App lädt, Live-Daten erscheinen |
| Direkt-Link | `https://btc-klar.ch/lightning` | Springt direkt ins Lightning-Modul |
| PWA-Installierbar | Browser-Install-Prompt | Manifest validates |
| SW aktiv | DevTools → Application → SW | Status «activated and is running» |
| Update-Banner | `sw.js` ändern + neu deployen | Banner erscheint nach Reload |
| Security-Headers | securityheaders.com | A oder A+ |
| SSL | ssllabs.com/ssltest | A+ |
| Lighthouse | DevTools → Lighthouse → PWA | Score > 90 |

---

## Fallback: Apache-Hoster (Shared Hosting)

Falls kein nginx-Server verfügbar ist (z. B. Standard-Webhoster), liegt eine `.htaccess` in `public/` vor. Reicht aus für die meisten Apache-2.4-Konfigurationen mit `mod_rewrite` und `mod_headers`.

```bash
# Einfach nur public/ via FTP/SFTP hochladen
# Webhoster zeigt Document-Root auf das Verzeichnis
```

Caveats:
- HSTS-Preload-Eligibility erfordert HTTPS-Erstkonfiguration
- Manche Hoster überschreiben `Cache-Control` — dann SW-Updates manuell verifizieren
- Falls `/blockchain` einen 404 liefert: Hoster aktiviert `mod_rewrite` nicht. Fallback: Hash-Routing aktivieren (im Code: `keyToPath` anpassen).

---

## Rollback bei Problemen

```bash
# Letzten Backup-Stand wiederherstellen
ssh user@server
cd /var/www/btc-klar.ch
ls /var/backups/btc-klar.ch/      # falls Backup-Strategie eingerichtet
# manuell: vorherige Files aus rsync-Cache zurückkopieren
```

**Empfehlung:** Vor jedem Deploy lokales Backup:
```bash
ssh user@server "tar czf /tmp/btc-klar-$(date +%Y%m%d-%H%M).tar.gz /var/www/btc-klar.ch"
```

---

## Domain & DNS

A-Record (Wert: Server-IP):
```
btc-klar.ch.       A    192.0.2.1
www.btc-klar.ch.   A    192.0.2.1
```

Die nginx-Konfig leitet `www` automatisch auf non-www um.

---

## Sicherheits-Checkliste

- [ ] HSTS-Preload bei Google einreichen: <https://hstspreload.org>
- [ ] DNSSEC bei Domain-Registrar aktivieren (falls verfügbar)
- [ ] CAA-DNS-Record für Let's Encrypt setzen
- [ ] Server-fail2ban für SSH konfigurieren
- [ ] Regelmässig: `sudo unattended-upgrades` für Security-Patches
- [ ] Monitoring (uptimerobot.com oder ähnlich)
- [ ] `sudo certbot renew --dry-run` quartalsweise testen

---

## Bei Fragen

- README.md im Repo-Root
- docs/TECHNISCHE-DOKUMENTATION.md für interne Architektur
- docs/DEPLOY-NGINX.md für nginx-Spezifika
