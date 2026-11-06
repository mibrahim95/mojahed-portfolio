// Contact form endpoint: POST /.netlify/functions/contact
// Validates the message, then hands it to the provider named in CONTACT_PROVIDER.
// Secrets (bot tokens, webhook URLs) live only in Netlify env vars, never in the bundle.
//
// Responses: 200 { ok: true } delivered (or honeypot hit), 400 { ok: false, errors } invalid input,
// 405 wrong method, 413 body too large, 415 not JSON, 429 too many messages from one IP,
// 503 provider off or not configured, 502 provider failed.
// The browser falls back to Netlify Forms on anything except 200, 400 and 429.
// Requiring application/json also blocks cross-site posts: browsers must preflight them,
// and this function sends no CORS headers.

// Same limits as the form in src/components/contactMe.jsx.
const NAME_MIN = 3;
const NAME_MAX = 99;
const MSG_MAX = 249;
const EMAIL_MAX = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BODY_MAX = 4096; // bytes; a full form is well under 1 KB
// Control and invisible formatting characters (bidi overrides, zero-width) let a sender fake
// extra "Email:" lines or reorder text. Names may not contain them; messages lose them, except
// newlines and tabs.
const NAME_BAD = /[\p{Cc}\p{Cf}]/u;
const MSG_STRIP = /(?![\n\t])[\p{Cc}\p{Cf}]/gu;

// shortcut: in-memory, per function instance, so it resets on cold starts and is not shared
// between instances. Fine against one noisy sender; use a store (Netlify Blobs) if abuse grows.
const RATE_MAX = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();
export function limited(ip, now = Date.now()) {
  if (!ip) return false;
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v[0] > RATE_WINDOW_MS) hits.delete(k);
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

// The text every provider receives. The live preview in src/components/chat.jsx shows the same lines.
const format = ({ fullName, email, msg }) => `Name: ${fullName}\nEmail: ${email}\nMessage: ${msg}`;

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`provider responded ${res.status}`);
}

// One entry per delivery route. To add email later, add an entry here
// (env check + send) and document its variables in the README.
export const PROVIDERS = {
  discord: {
    // Only a real Discord webhook address, so a bad setting can't point the function elsewhere.
    configured: (env) => /^https:\/\/(?:discord|discordapp)\.com\/api\/webhooks\/\d+\/[\w-]+$/.test(env.DISCORD_WEBHOOK_URL || ""),
    // Discord answers 204 No Content on success. The text stays far under the 2,000-character limit:
    // the form caps a message at 249 characters and escaping at most doubles it.
    send: (text, env) =>
      postJson(env.DISCORD_WEBHOOK_URL, {
        content: escapeDiscord(text),
        allowed_mentions: { parse: [] }, // @everyone, @here and <@id> ping nobody
        flags: 4, // SUPPRESS_EMBEDS: no link previews for pasted URLs
      }),
  },
  telegram: {
    // Plain text (no parse_mode), so nothing the sender types is interpreted as markup.
    // The token must look like a bot token, so it can only ever change the bot path.
    configured: (env) => /^\d+:[\w-]+$/.test(env.TELEGRAM_BOT_TOKEN || "") && Boolean(env.TELEGRAM_CHAT_ID),
    send: (text, env) =>
      postJson(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: env.TELEGRAM_CHAT_ID,
        text,
        link_preview_options: { is_disabled: true },
      }),
  },
  slack: {
    // Only a real Slack webhook host, so a bad setting can't point the function anywhere else.
    configured: (env) => /^https:\/\/hooks\.slack\.com\//.test(env.SLACK_WEBHOOK_URL || ""),
    send: (text, env) =>
      postJson(env.SLACK_WEBHOOK_URL, {
        text: escapeSlack(text),
        mrkdwn: false, // no *bold*, _italic_, `code` or > quotes from the sender
        parse: "none",
        unfurl_links: false,
        unfurl_media: false,
      }),
  },
};

// Slack reads <, > and & as control characters: <!channel>, <@U123>, <https://x|text>. Escaping
// them turns mentions and disguised links into plain text.
export const escapeSlack = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Discord renders markdown. A backslash before these characters shows them as plain text, so the
// sender can't bold, quote, hide spoilers, make headings or build [text](link) links.
export const escapeDiscord = (text) => text.replace(/[\\*_~`|>#[\]]/g, "\\$&");

export function validate(body) {
  const str = (v) => (typeof v === "string" ? v.trim() : "");
  const data = { fullName: str(body?.fullName), email: str(body?.email), msg: str(body?.msg).replace(MSG_STRIP, "").trim() };
  const errors = {};
  if (data.fullName.length < NAME_MIN || data.fullName.length > NAME_MAX || NAME_BAD.test(data.fullName)) errors.fullName = "length";
  if (data.email.length > EMAIL_MAX || !EMAIL_PATTERN.test(data.email)) errors.email = "format";
  if (!data.msg || data.msg.length > MSG_MAX) errors.msg = "length";
  return { data, errors };
}

const reply = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export async function handle(req, env) {
  if (req.method !== "POST") return reply(405, { ok: false, reason: "method" });

  const type = (req.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (type !== "application/json") return reply(415, { ok: false, reason: "type" });
  if (Number(req.headers.get("content-length")) > BODY_MAX) return reply(413, { ok: false, reason: "size" });

  let body;
  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw) > BODY_MAX) return reply(413, { ok: false, reason: "size" });
    body = JSON.parse(raw);
  } catch {
    return reply(400, { ok: false, errors: { body: "json" } });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return reply(400, { ok: false, errors: { body: "json" } });

  // Honeypot filled in: a bot. Report success and send nothing.
  if (typeof body?.website === "string" && body.website !== "") return reply(200, { ok: true });

  const { data, errors } = validate(body);
  if (Object.keys(errors).length) return reply(400, { ok: false, errors });

  // Netlify sets this header itself; a client cannot spoof it.
  if (limited(req.headers.get("x-nf-client-connection-ip"))) return reply(429, { ok: false, reason: "rate" });

  const name = (env.CONTACT_PROVIDER || "none").toLowerCase();
  const provider = PROVIDERS[name];
  if (!provider || !provider.configured(env)) return reply(503, { ok: false, reason: "disabled" });

  try {
    await provider.send(format(data), env);
  } catch (err) {
    console.error(`contact: ${name} delivery failed: ${err.message}`);
    return reply(502, { ok: false, reason: "provider" });
  }
  return reply(200, { ok: true });
}

export default (req) => handle(req, process.env);
