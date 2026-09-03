/* =============================================================================
   BUILD HELPERS — text, escaping, and file-region surgery
   -----------------------------------------------------------------------------
   The site is plain HTML with no framework. The build does not rebuild pages
   from templates; it replaces clearly-marked regions inside the real files:

       <!-- OM:name:start -->  ...generated...  <!-- OM:name:end -->

   Everything outside those markers is hand-written and stays untouched, so the
   HTML remains readable and directly editable by a developer.
   ============================================================================= */

/* The named entities the hand-written HTML uses. Content coming back from
   Sanity holds real characters (the owner types "½" and "·" in the Studio),
   so parsing has to fold these down first or the same text would be stored two
   different ways. */
const NAMED = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0",
  middot: "\u00b7", ndash: "\u2013", mdash: "\u2014", hellip: "\u2026",
  ntilde: "\u00f1", eacute: "\u00e9", deg: "\u00b0", frac12: "\u00bd"
};

export function decodeEntities(s) {
  if (s == null) return s;
  return String(s)
    .replace(/&#(\d+);/g, function (_, n) { return String.fromCodePoint(parseInt(n, 10)); })
    .replace(/&#x([0-9a-fA-F]+);/g, function (_, n) { return String.fromCodePoint(parseInt(n, 16)); })
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, function (m, name) {
      return Object.prototype.hasOwnProperty.call(NAMED, name) ? NAMED[name] : m;
    });
}

/* Escape for HTML text and attribute values. Only the five characters that can
   break out of context — everything else is emitted as literal UTF-8, which the
   pages already declare. */
export function esc(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* Escape for a JavaScript string literal inside a <script> or .js file. */
export function jsStr(s) {
  return JSON.stringify(s == null ? "" : String(s)).replace(/<\//g, "<\/");
}

export function marker(name) {
  return {
    start: "<!-- OM:" + name + ":start -->",
    end: "<!-- OM:" + name + ":end -->"
  };
}

/* Replace the text between a marker pair. Throws rather than silently doing
   nothing if the markers are missing — a build that quietly skips a region is
   worse than one that stops. */
export function replaceRegion(html, name, body) {
  const m = marker(name);
  const a = html.indexOf(m.start);
  const b = html.indexOf(m.end);
  if (a === -1 || b === -1 || b < a) {
    throw new Error('Missing or malformed markers for region "' + name + '"');
  }
  return html.slice(0, a + m.start.length) + body + html.slice(b);
}

export function readRegion(html, name) {
  const m = marker(name);
  const a = html.indexOf(m.start);
  const b = html.indexOf(m.end);
  if (a === -1 || b === -1 || b < a) return null;
  return html.slice(a + m.start.length, b);
}

/* Compare two HTML fragments ignoring entity spelling and run-of-whitespace
   differences. Used by the round-trip check: proves the generated markup says
   the same thing as the markup it replaced. */
export function normalizeForCompare(s) {
  return decodeEntities(s).replace(/\s+/g, " ").trim();
}

/* Repo root, resolved from this file's location so the scripts work no matter
   what directory they are run from. */
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
export const SITE = join(ROOT, "site");
