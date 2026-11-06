// Run with: npm test   (Node's built-in test runner, no extra packages)
import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeDiscord, escapeSlack, handle, limited } from "./functions/contact.js";

const post = (body, headers = {}) =>
  new Request("http://x/.netlify/functions/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const SLACK = { CONTACT_PROVIDER: "slack", SLACK_WEBHOOK_URL: "https://hooks.slack.com/services/T/B/x" };
const DISCORD = { CONTACT_PROVIDER: "discord", DISCORD_WEBHOOK_URL: "https://discord.com/api/webhooks/123456789/abc-DEF_ghi" };
const TELEGRAM = { CONTACT_PROVIDER: "telegram", TELEGRAM_BOT_TOKEN: "123:abc-DEF", TELEGRAM_CHAT_ID: "42" };
const good = { fullName: "Jane Doe", email: "jane@company.com", msg: "Hi <there> & hello", website: "" };

function mockFetch(status = 200) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    return new Response(status === 204 ? null : "{}", { status });
  };
  return calls;
}

test("rejects bad input with 400", async () => {
  const calls = mockFetch();
  const res = await handle(post({ fullName: "Jo", email: "nope", msg: "" }), SLACK);
  assert.equal(res.status, 400);
  assert.deepEqual(Object.keys((await res.json()).errors).sort(), ["email", "fullName", "msg"]);
  assert.equal(calls.length, 0);
});

test("honeypot reports success and sends nothing", async () => {
  const calls = mockFetch();
  const res = await handle(post({ ...good, website: "spam.example" }), SLACK);
  assert.equal(res.status, 200);
  assert.equal(calls.length, 0);
});

test("none or unconfigured provider returns 503 so the browser falls back", async () => {
  mockFetch();
  assert.equal((await handle(post(good), { CONTACT_PROVIDER: "none" })).status, 503);
  assert.equal((await handle(post(good), { CONTACT_PROVIDER: "telegram" })).status, 503);
  assert.equal((await handle(post(good), {})).status, 503);
});

test("telegram sends plain text to the configured chat", async () => {
  const calls = mockFetch();
  const res = await handle(post(good), TELEGRAM);
  assert.equal(res.status, 200);
  assert.equal(calls[0].url, "https://api.telegram.org/bot123:abc-DEF/sendMessage");
  assert.equal(calls[0].body.chat_id, "42");
  assert.equal(calls[0].body.parse_mode, undefined);
  assert.equal(calls[0].body.text, "Name: Jane Doe\nEmail: jane@company.com\nMessage: Hi <there> & hello");
});

test("slack escapes control characters", async () => {
  const calls = mockFetch();
  await handle(post(good), { ...SLACK, CONTACT_PROVIDER: "Slack" });
  assert.match(calls[0].body.text, /Hi &lt;there&gt; &amp; hello$/);
  assert.equal(calls[0].body.mrkdwn, false);
});

test("discord posts escaped text to the webhook with mentions and previews off", async () => {
  const calls = mockFetch(204);
  const res = await handle(post({ ...good, msg: "@everyone **hi** [x](https://e.co) # big" }), DISCORD);
  assert.equal(res.status, 200);
  assert.equal(calls[0].url, DISCORD.DISCORD_WEBHOOK_URL);
  assert.deepEqual(calls[0].body.allowed_mentions, { parse: [] });
  assert.equal(calls[0].body.flags, 4);
  assert.equal(
    calls[0].body.content,
    "Name: Jane Doe\nEmail: jane@company.com\nMessage: @everyone \\*\\*hi\\*\\* \\[x\\](https://e.co) \\# big",
  );
});

test("escapeDiscord neutralizes markdown and keeps plain text", () => {
  assert.equal(escapeDiscord("*a* _b_ ~c~ `d` ||e|| > f # g [h]"), "\\*a\\* \\_b\\_ \\~c\\~ \\`d\\` \\|\\|e\\|\\| \\> f \\# g \\[h\\]");
  assert.equal(escapeDiscord("Hello, world: 1-2 (ok)"), "Hello, world: 1-2 (ok)");
});

test("provider failure returns 502", async () => {
  mockFetch(500);
  const res = await handle(post(good), SLACK);
  assert.equal(res.status, 502);
});

test("non-POST returns 405", async () => {
  const res = await handle(new Request("http://x/", { method: "GET" }), {});
  assert.equal(res.status, 405);
});

test("escapeSlack neutralizes mentions and disguised links", () => {
  assert.equal(escapeSlack("<!channel> <@U123> <https://evil.example|bank>"), "&lt;!channel&gt; &lt;@U123&gt; &lt;https://evil.example|bank&gt;");
  assert.equal(escapeSlack("&lt;"), "&amp;lt;");
});

test("wrong content type returns 415 and sends nothing", async () => {
  const calls = mockFetch();
  const req = new Request("http://x/", { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(good) });
  assert.equal((await handle(req, SLACK)).status, 415);
  assert.equal(calls.length, 0);
});

test("oversized body returns 413", async () => {
  const calls = mockFetch();
  assert.equal((await handle(post({ ...good, pad: "x".repeat(5000) }), SLACK)).status, 413);
  assert.equal((await handle(post("{}", { "Content-Length": "999999" }), SLACK)).status, 413);
  assert.equal(calls.length, 0);
});

test("malformed or non-object JSON returns 400", async () => {
  mockFetch();
  for (const raw of ["{nope", "null", "[1]", '"text"']) assert.equal((await handle(post(raw), SLACK)).status, 400, raw);
});

test("over-length fields are rejected", async () => {
  const calls = mockFetch();
  const res = await handle(post({ fullName: "J".repeat(100), email: `${"a".repeat(250)}@b.co`, msg: "m".repeat(250) }), SLACK);
  assert.deepEqual(Object.keys((await res.json()).errors).sort(), ["email", "fullName", "msg"]);
  assert.equal(calls.length, 0);
});

test("a name with a newline can't fake extra lines", async () => {
  mockFetch();
  const res = await handle(post({ ...good, fullName: "Jane\nEmail: boss@company.com" }), SLACK);
  assert.equal(res.status, 400);
});

test("control and bidi characters are stripped from the message", async () => {
  const calls = mockFetch();
  await handle(post({ ...good, msg: "line one\nline\u202Etwo\u0007" }), TELEGRAM);
  assert.match(calls[0].body.text, /Message: line one\nlinetwo$/);
});

test("unexpected Slack, Discord or Telegram settings are treated as not configured", async () => {
  const calls = mockFetch();
  for (const url of ["http://discord.com/api/webhooks/1/x", "https://evil.example/api/webhooks/1/x", "https://discord.com.evil.example/api/webhooks/1/x", "https://discord.com/api/webhooks/1/x?wait=true"])
    assert.equal((await handle(post(good), { ...DISCORD, DISCORD_WEBHOOK_URL: url })).status, 503, url);
  assert.equal((await handle(post(good), { ...SLACK, SLACK_WEBHOOK_URL: "http://169.254.169.254/" })).status, 503);
  assert.equal((await handle(post(good), { ...TELEGRAM, TELEGRAM_BOT_TOKEN: "x/../../evil" })).status, 503);
  assert.equal(calls.length, 0);
});

test("errors never echo provider detail to the client", async () => {
  globalThis.fetch = async () => {
    throw new Error("connect failed https://hooks.slack.com/services/T/B/x");
  };
  const res = await handle(post(good), SLACK);
  assert.equal(res.status, 502);
  assert.doesNotMatch(await res.text(), /hooks|slack\.com|connect/);
});

test("rate limit: the sixth message from one IP in ten minutes gets 429", async () => {
  const calls = mockFetch();
  const ip = { "x-nf-client-connection-ip": "203.0.113.9" };
  for (let i = 0; i < 5; i++) assert.equal((await handle(post(good, ip), SLACK)).status, 200);
  assert.equal((await handle(post(good, ip), SLACK)).status, 429);
  assert.equal(calls.length, 5);
  assert.equal(limited("203.0.113.9", Date.now() + 11 * 60 * 1000), false);
});
