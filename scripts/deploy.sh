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

# Brotli-Files (.br) auf Hostpoint NICHT hochladen.
# Grund: Hostpoint-Edge-nginx hat einen Bug, bei dem .br-Files mit
# Chrome-typischen Multi-Encoding-Headern (`Accept-Encoding: gzip, br`)
# den Header `Content-Encoding: br` erhalten, der Body aber zusätzlich
# durch gzip läuft → ERR_CONTENT_DECODING_FAILED. Dokumentiert
# 2026-04-26. Falls Hostpoint den Bug fixt: HOSTPOINT_BROTLI=on setzen.
HOSTPOINT_BROTLI="${HOSTPOINT_BROTLI:-off}"
EXCLUDES=(--exclude='.DS_Store' --exclude='Thumbs.db')
TAR_EXCLUDES=(--exclude=.DS_Store --exclude=Thumbs.db)
if [ "$HOSTPOINT_BROTLI" != "on" ]; then
  EXCLUDES+=(--exclude='*.br')
  TAR_EXCLUDES+=(--exclude=*.br)
  echo "  ℹ Brotli-Skip aktiv (Hostpoint-Edge-Bug). gzip-Static reicht."
fi

if command -v rsync >/dev/null 2>&1; then
  # Bevorzugter Pfad: rsync mit Delta + --delete
  rsync -avz --delete "${EXCLUDES[@]}" \
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
  tar -C "$LOCAL_PUBLIC" "${TAR_EXCLUDES[@]}" -cf - . \
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

echo "  Encoding-Decode-Test (mit Chrome-Headern) ..."
# tmp-File im Repo-Root, weil Node unter Windows /tmp nicht mit POSIX-Path
# auflöst (interpretiert es als C:\tmp\...). Lokal arbeiten ist portabel.
TMPFILE=".tmp-smoke-$$.bin"
TMPHDRS=".tmp-smoke-$$.hdrs"
trap 'rm -f "$TMPFILE" "$TMPHDRS"' EXIT
curl -s \
  -H 'Accept-Encoding: gzip, deflate, br, zstd' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0' \
  -D "$TMPHDRS" -o "$TMPFILE" https://btc-klar.ch/
ENC="$(grep -i '^content-encoding:' "$TMPHDRS" | tr -d '\r' | awk '{print tolower($2)}')"
node -e "
const fs = require('fs'), zlib = require('zlib');
const buf = fs.readFileSync('$TMPFILE');
const enc = '$ENC';
const tryDecode = enc === 'br'   ? () => zlib.brotliDecompressSync(buf) :
                  enc === 'gzip' ? () => zlib.gunzipSync(buf) :
                                   () => buf;
try {
  const decoded = tryDecode();
  if (!decoded.toString('utf8', 0, 1000).includes('<!DOCTYPE html>')) {
    console.error('  ✗ Decoded body sieht nicht nach HTML aus — Encoding-Bug?'); process.exit(1);
  }
  console.log('  ✓ Encoding=' + (enc || 'identity') + ', Decode OK,', decoded.length, 'bytes');
} catch(e) {
  console.error('  ✗ Decode failed (Encoding=' + enc + '): ' + e.message);
  console.error('    Body-Magic-Bytes:', buf.slice(0,3).toString('hex'));
  console.error('    Doppel-Encoding-Bug? Wenn Server Content-Encoding: br sagt aber Body 1f8b08 (gzip)');
  console.error('    hat ist es der Hostpoint-Edge-Bug — .br-Files vom Server entfernen.');
  process.exit(1);
}"

echo
echo "✓ Deploy abgeschlossen."
