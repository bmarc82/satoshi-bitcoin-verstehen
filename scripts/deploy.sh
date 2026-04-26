#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
#  scripts/deploy.sh — Hostpoint-Deploy ohne rsync
#
#  Funktioniert mit purem OpenSSH (kein rsync nötig — perfekt für
#  Git Bash unter Windows). Bevorzugte Wahl: rsync, falls verfügbar
#  — wir wechseln automatisch.
#
#  Workflow:
#    1) check.js              — Konsistenz-Validation
#    2) compress.js           — Brotli + Gzip Pre-Compression
#    3) tar | ssh -> entpack  — atomarer Upload via SSH-Pipe
#                               (oder rsync, wenn vorhanden)
#    4) Smoke-Test            — Brotli-Antwort verifiziert
#
#  Voraussetzungen:
#    - ~/.ssh/config Alias "hostpoint" mit IdentityFile
#    - Variable HOSTPOINT_DOCROOT (siehe unten)
# ──────────────────────────────────────────────────────────────

set -euo pipefail

# Hostpoint-Webroot (relativ zu /home/wiwomubo/) — überschreibbar via Env.
#   Hostpoint Shared-Hosting: ~/www/<DOMAIN>/  (NICHT htdocs/)
#   Architektur: nginx-Edge (TLS+Compression) → Apache (App + .htaccess)
HOSTPOINT_DOCROOT="${HOSTPOINT_DOCROOT:-www/btc-klar.ch}"
SSH_HOST="${SSH_HOST:-hostpoint}"
LOCAL_PUBLIC="public"

cd "$(dirname "$0")/.."

echo "→ 1/4 Build-Validation"
node scripts/check.js

echo
echo "→ 2/4 Pre-Compression (Brotli + Gzip)"
node scripts/compress.js

echo
echo "→ 3/4 Upload nach $SSH_HOST:$HOSTPOINT_DOCROOT"

if command -v rsync >/dev/null 2>&1; then
  # Bevorzugter Pfad: rsync mit Delta + --delete
  rsync -avz --delete \
    --exclude='.DS_Store' \
    --exclude='Thumbs.db' \
    "$LOCAL_PUBLIC/" "$SSH_HOST:$HOSTPOINT_DOCROOT/"
else
  # Fallback: tar | ssh — atomar, kein rsync nötig
  # Variante A: Komplett-Tausch via Staging-Verzeichnis
  STAMP="$(date +%Y%m%d-%H%M%S)"
  STAGING="$HOSTPOINT_DOCROOT.staging-$STAMP"
  PREVIOUS="$HOSTPOINT_DOCROOT.previous"

  echo "  rsync nicht gefunden — nutze tar | ssh (atomarer Tausch)"
  echo "  Staging: $STAGING"

  # Tarball pipen, auf Server entpacken
  tar -C "$LOCAL_PUBLIC" -cf - . \
    | ssh "$SSH_HOST" "mkdir -p '$STAGING' && tar -C '$STAGING' -xf -"

  # Atomarer Tausch:
  #   docroot      → previous
  #   staging      → docroot
  #   altes previous löschen
  ssh "$SSH_HOST" "
    set -e
    if [ -d '$HOSTPOINT_DOCROOT' ]; then
      rm -rf '$PREVIOUS' || true
      mv '$HOSTPOINT_DOCROOT' '$PREVIOUS'
    fi
    mv '$STAGING' '$HOSTPOINT_DOCROOT'
    echo 'Backup unter: $PREVIOUS'
  "
fi

echo
echo "→ 4/4 Smoke-Test"

echo "  GET https://btc-klar.ch/ ..."
HTTP_STATUS="$(curl -s -o /dev/null -w '%{http_code}' https://btc-klar.ch/)"
if [ "$HTTP_STATUS" != "200" ]; then
  echo "  ✗ HTTP $HTTP_STATUS — Site antwortet nicht mit 200"
  exit 1
fi
echo "  ✓ HTTP 200"

echo "  Brotli-Decode-Test ..."
# tmp-File im Repo-Root, weil Node unter Windows /tmp nicht mit POSIX-Path
# auflöst (interpretiert es als C:\tmp\...). Lokal arbeiten ist portabel.
TMPFILE=".tmp-smoke-$$.bin"
trap 'rm -f "$TMPFILE"' EXIT
curl -s -H 'Accept-Encoding: br' https://btc-klar.ch/ -o "$TMPFILE"
BR_BYTES="$(node -e "console.log(require('fs').readFileSync('$TMPFILE').slice(0,3).toString('hex'))")"
if [ "$BR_BYTES" = "1f8b08" ]; then
  echo "  ✗ Server sendet Content-Encoding: br aber Body ist gzip — Doppel-Encoding-Bug!"
  echo "    Lösung: bei Hostpoint die .br-Files entfernen oder Edge-Compression neu konfigurieren."
  exit 1
fi
node -e "
  try { require('zlib').brotliDecompressSync(require('fs').readFileSync('$TMPFILE')); console.log('  ✓ Brotli antwortet korrekt');\
    } catch (e) { console.error('  ✗ Brotli-Decode failed:', e.message); process.exit(1); }
"

echo
echo "✓ Deploy abgeschlossen."
