// The CSP in netlify.toml allows index.html's inline <script> and <style> blocks by hash.
// Editing one of those blocks without updating its hash would silently break the theme
// script and the intro on the live site, so this test checks they still match.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8").replace(/\r\n?/g, "\n");
const csp = read("netlify.toml").match(/Content-Security-Policy = "([^"]+)"/)[1];
const directive = (name) => csp.split(";").map((d) => d.trim()).find((d) => d.startsWith(`${name} `));

test("every inline script and style in index.html is allowed by hash", () => {
  const html = read("index.html");
  for (const [, tag, attrs, body] of html.matchAll(/<(script|style)([^>]*)>([\s\S]*?)<\/\1>/g)) {
    if (/\bsrc=|application\/ld\+json/.test(attrs)) continue;
    const hash = `'sha256-${createHash("sha256").update(body).digest("base64")}'`;
    assert.ok(directive(`${tag}-src`).includes(hash), `inline <${tag}> changed; put ${hash} in ${tag}-src in netlify.toml`);
  }
});

test("the CSP never falls back to unsafe-inline or unsafe-eval", () => {
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
  assert.match(directive("frame-ancestors"), /'none'/);
  assert.equal(directive("connect-src"), "connect-src 'self'");
});
