// Contact form endpoint: POST /.netlify/functions/contact
// Validates the message, then hands it to the provider named in CONTACT_PROVIDER.
// Secrets (bot tokens, webhook URLs) live only in Netlify env vars, never in the bundle.
//
// Responses: 200 { ok: true } delivered (or honeypot hit), 400 { ok: false, errors } invalid input,
// 405 wrong method, 503 provider off or not configured, 502 provider failed.
// The browser falls back to Netlify Forms on anything except 200 and 400.

// Same limits as the form in src/components/contactMe.jsx.
const NAME_MIN = 3;
const NAME_MAX = 99;
const MSG_MAX = 249;
const EMAIL_MAX = 254;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

// One entry per delivery route. To add Discord or email later, add an entry here
// (env check + send) and document its variables in the README.
export const PROVIDERS = {
  telegram: {
    configured: (env) => Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
    // Plain text (no parse_mode), so nothing the sender types is interpreted as markup.
    send: (text, env) =>
      postJson(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: env.TELEGRAM_CHAT_ID,
        text,
        disable_web_page_preview: true,
      }),
  },
  slack: {
    configured: (env) => Boolean(env.SLACK_WEBHOOK_URL),
    // Slack reads <, > and & as control characters, so escape them.
    send: (text, env) =>
      postJson(env.SLACK_WEBHOOK_URL, {
        text: text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      }),
  },
};

export function validate(body) {
  const str = (v) => (typeof v === "string" ? v.trim() : "");
  const data = { fullName: str(body?.fullName), email: str(body?.email), msg: str(body?.msg) };
  const errors = {};
  if (data.fullName.length < NAME_MIN || data.fullName.length > NAME_MAX) errors.fullName = "length";
  if (data.email.length > EMAIL_MAX || !EMAIL_PATTERN.test(data.email)) errors.email = "format";
  if (!data.msg || data.msg.length > MSG_MAX) errors.msg = "length";
  return { data, errors };
}

const reply = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export async function handle(req, env) {
  if (req.method !== "POST") return reply(405, { ok: false, reason: "method" });

  let body;
  try {
    const raw = await req.text();
    if (raw.length > 4096) return reply(400, { ok: false, errors: { body: "size" } });
    body = JSON.parse(raw);
  } catch {
    return reply(400, { ok: false, errors: { body: "json" } });
  }

  // Honeypot filled in: a bot. Report success and send nothing.
  if (typeof body?.website === "string" && body.website !== "") return reply(200, { ok: true });

  const { data, errors } = validate(body);
  if (Object.keys(errors).length) return reply(400, { ok: false, errors });

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
