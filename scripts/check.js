#!/usr/bin/env node
/**
 * Build-Check für die Satoshi-PWA.
 *
 * Läuft ohne externe Dependencies. Prüft Konsistenz zwischen
 * index.html, manifest.json, sitemap.xml, sw.js, robots.txt und
 * den hashbasierten Integritätsmechanismen für Spendenadresse + QR.
 *
 * Erwartet die Projektstruktur:
 *   /public/    — Deploy-Artifacts (index.html, sw.js, …, icons/)
 *   /server/    — nginx-Konfig (nginx-security-headers.conf)
 *   /scripts/   — diese Datei + dev-server.js
 *
 * Aufruf:   node scripts/check.js   (vom Repo-Root)
 *      oder: node check.js          (aus /scripts/ heraus)
 * Exit:     0 = alle Checks grün, 1 = mindestens ein Fehler
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Repo-Root — unabhängig vom CWD
const REPO_ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(REPO_ROOT, 'public');
const SERVER_DIR = path.join(REPO_ROOT, 'server');
const ROOT = PUBLIC_DIR; // Backwards-kompatibler Alias für die Checks unten
const errors = [];
const warnings = [];

function err(msg)  { errors.push(msg);  console.error('  ✗ ' + msg); }
function warn(msg) { warnings.push(msg); console.warn ('  ⚠ ' + msg); }
function ok(msg)   { console.log         ('  ✓ ' + msg); }
function section(name) { console.log('\n→ ' + name); }

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}
function readBin(rel) {
  return fs.readFileSync(path.join(ROOT, rel));
}
function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

// ─── 1. index.html — Tag-Balance ──────────────────────────
section('index.html — Struktur');
const html = read('index.html');
const lines = html.split('\n').length;
const scripts = (html.match(/<script\b/gi) || []).length;
const scriptsClose = (html.match(/<\/script>/gi) || []).length;
const divs = (html.match(/<div\b/gi) || []).length;
const divsClose = (html.match(/<\/div>/gi) || []).length;
console.log('  Lines: ' + lines);
if (scripts === scriptsClose) ok('script-Tags balanciert (' + scripts + ')');
else err('script-Tags unbalanciert: ' + scripts + ' offen, ' + scriptsClose + ' geschlossen');
if (divs === divsClose) ok('div-Tags balanciert (' + divs + ')');
else err('div-Tags unbalanciert: ' + divs + ' offen, ' + divsClose + ' geschlossen');

// ─── 2. MODULES vs. Screens vs. Sitemap ───────────────────
section('Modul-Konsistenz');
const modulesMatch = html.match(/const MODULES = \[([\s\S]*?)\];/);
if (!modulesMatch) {
  err('MODULES-Array nicht gefunden in index.html');
} else {
  const moduleKeys = [];
  const re = /\{\s*key:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(modulesMatch[1])) !== null) moduleKeys.push(m[1]);
  ok('MODULES enthält ' + moduleKeys.length + ' Module');

  // Jeder MODULE-Key muss einen Screen haben
  let missingScreens = 0;
  moduleKeys.forEach(function(key) {
    if (!html.includes('id="screen-' + key + '"')) {
      err('Kein Screen für Modul-Key "' + key + '" (erwartet: id="screen-' + key + '")');
      missingScreens++;
    }
  });
  if (missingScreens === 0) ok('Alle ' + moduleKeys.length + ' Modul-Keys haben einen Screen');

  // Alle navigateTo('xxx')-Calls müssen valide Modul-Keys sein
  const navCalls = new Set();
  const navRe = /navigateTo\(['"]([a-z0-9-]+)['"]\)/gi;
  let n;
  while ((n = navRe.exec(html)) !== null) navCalls.add(n[1]);
  let unknownNav = 0;
  navCalls.forEach(function(k) {
    if (!moduleKeys.includes(k)) {
      err('navigateTo("' + k + '") referenziert kein gültiges Modul');
      unknownNav++;
    }
  });
  if (unknownNav === 0) ok(navCalls.size + ' navigateTo()-Targets alle gültig');

  // Sitemap-Konsistenz
  if (fs.existsSync(path.join(ROOT, 'sitemap.xml'))) {
    const sitemap = read('sitemap.xml');
    const sitemapKeys = [];
    const smRe = /<loc>https:\/\/[^/]+\/([^<]*)<\/loc>/g;
    let s;
    while ((s = smRe.exec(sitemap)) !== null) {
      const slug = s[1].replace(/\/$/, '');
      if (slug !== '') sitemapKeys.push(slug);
    }
    const SITEMAP_HIDDEN = ['einstellungen','anleitung','changelog','impressum','home'];
    const expectedSitemap = moduleKeys.filter(function(k) { return !SITEMAP_HIDDEN.includes(k); });
    const missing = expectedSitemap.filter(function(k) { return !sitemapKeys.includes(k); });
    const extra = sitemapKeys.filter(function(k) { return !moduleKeys.includes(k); });
    if (missing.length === 0 && extra.length === 0) {
      ok('sitemap.xml: ' + sitemapKeys.length + ' Modul-URLs, alle konsistent mit MODULES');
    } else {
      if (missing.length) err('sitemap.xml: fehlt ' + missing.join(', '));
      if (extra.length)   err('sitemap.xml: kein passendes Modul für ' + extra.join(', '));
    }
  } else {
    warn('sitemap.xml nicht gefunden');
  }
}

// ─── 3. manifest.json ─────────────────────────────────────
section('manifest.json');
try {
  const manifest = JSON.parse(read('manifest.json'));
  const requiredFields = ['name', 'short_name', 'start_url', 'display', 'background_color', 'theme_color', 'icons'];
  requiredFields.forEach(function(f) {
    if (manifest[f] == null || (Array.isArray(manifest[f]) && manifest[f].length === 0)) {
      err('manifest.json: Feld "' + f + '" fehlt oder ist leer');
    }
  });
  // Empfohlene Felder
  ['id', 'scope', 'description'].forEach(function(f) {
    if (!manifest[f]) warn('manifest.json: Feld "' + f + '" fehlt (empfohlen)');
  });
  if (errors.filter(function(e) { return e.includes('manifest.json'); }).length === 0) {
    ok('Pflichtfelder vorhanden, JSON valide');
  }
} catch (e) {
  err('manifest.json: ' + e.message);
}

// ─── 4. sw.js ─────────────────────────────────────────────
section('sw.js — Service Worker');
try {
  const sw = read('sw.js');
  const cacheVer = sw.match(/SHELL_CACHE\s*=\s*['"]([^'"]+)['"]/);
  if (cacheVer) ok('Cache-Version: ' + cacheVer[1]);
  else err('SHELL_CACHE-Konstante nicht gefunden');

  if (sw.includes('skipWaiting()') && !sw.match(/event\.data[\s\S]{0,80}SKIP_WAITING/)) {
    err('skipWaiting() wird ohne SKIP_WAITING-Message-Guard aufgerufen — Update-Banner würde umgangen');
  } else {
    ok('skipWaiting nur via SKIP_WAITING-Message');
  }

  if (sw.includes('fetch(request)') && !sw.includes('signal')) {
    warn('sw.js: fetch ohne AbortSignal — keine Timeout-Absicherung');
  }
} catch (e) {
  err('sw.js: ' + e.message);
}

// ─── 5. Donation-Adresse + QR (SHA-256) ───────────────────
section('Spenden-Integrität');
try {
  const addrMatch    = html.match(/donationAddr:\s*['"]([^'"]+)['"]/);
  const hashMatch    = html.match(/donationHash:\s*['"]([0-9a-f]{64})['"]/);
  const qrHashMatch  = html.match(/donationQrHash:\s*['"]([0-9a-f]{64})['"]/);
  if (!addrMatch || !hashMatch) {
    err('SITE_CONFIG.donationAddr / donationHash nicht gefunden');
  } else {
    const calc = sha256(addrMatch[1]);
    if (calc === hashMatch[1]) ok('donationHash matcht donationAddr');
    else err('donationHash MISMATCH: erwartet ' + calc + ', konfiguriert ' + hashMatch[1]);
  }
  if (qrHashMatch) {
    if (fs.existsSync(path.join(ROOT, 'icons/donation-qr.svg'))) {
      const qrCalc = sha256(readBin('icons/donation-qr.svg'));
      if (qrCalc === qrHashMatch[1]) ok('donationQrHash matcht icons/donation-qr.svg');
      else err('donationQrHash MISMATCH: SVG-Datei hat ' + qrCalc + ', konfiguriert ' + qrHashMatch[1]);
    } else {
      err('donationQrHash konfiguriert, aber icons/donation-qr.svg fehlt');
    }
  }
} catch (e) {
  err('Spenden-Check: ' + e.message);
}

// ─── 6. robots.txt + Pflicht-Dateien ──────────────────────
section('SEO-Pflichtdateien');
['robots.txt', 'sitemap.xml', 'manifest.json', 'sw.js', 'rabbit-hole.js', 'index.html'].forEach(function(f) {
  if (fs.existsSync(path.join(ROOT, f))) ok(f + ' vorhanden');
  else err(f + ' fehlt');
});

// ─── 7. CSP-Sanity (CSS Url-Schemes prüfen) ────────────────
section('CSP-Sanity');
const cspPath = path.join(SERVER_DIR, 'nginx-security-headers.conf');
if (fs.existsSync(cspPath)) {
  const csp = fs.readFileSync(cspPath, 'utf8');
  if (csp.includes("img-src") && csp.match(/img-src[^;]*data:/)) ok("img-src enthält 'data:' (für QR-Code nötig)");
  else warn("img-src enthält kein 'data:' — QR-Code könnte blockiert werden");
} else {
  warn('server/nginx-security-headers.conf nicht gefunden');
}

// ─── Zusammenfassung ──────────────────────────────────────
console.log('\n' + '═'.repeat(50));
console.log(errors.length === 0
  ? '✓ Alle Checks grün'
  : '✗ ' + errors.length + ' Fehler');
if (warnings.length) console.log('⚠ ' + warnings.length + ' Warnung(en)');
process.exit(errors.length === 0 ? 0 : 1);
