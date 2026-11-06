// Run with: npm test   (Node's built-in test runner, no extra packages)
import { test } from "node:test";
import assert from "node:assert/strict";
import { handle } from "./functions/contact.js";

const post = (body) =>
  new Request("http://x/.netlify/functions/contact", { method: "POST", body: JSON.stringify(body) });
const good = { fullName: "Jane Doe", email: "jane@company.com", msg: "Hi <there> & hello", website: "" };

function mockFetch(status = 200) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    return new Response("{}", { status });
  };
  return calls;
}

test("rejects bad input with 400", async () => {
  const calls = mockFetch();
  const res = await handle(post({ fullName: "Jo", email: "nope", msg: "" }), { CONTACT_PROVIDER: "slack", SLACK_WEBHOOK_URL: "https://hook" });
  assert.equal(res.status, 400);
  assert.deepEqual(Object.keys((await res.json()).errors).sort(), ["email", "fullName", "msg"]);
  assert.equal(calls.length, 0);
});

test("honeypot reports success and sends nothing", async () => {
  const calls = mockFetch();
  const res = await handle(post({ ...good, website: "spam.example" }), { CONTACT_PROVIDER: "slack", SLACK_WEBHOOK_URL: "https://hook" });
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
  const res = await handle(post(good), { CONTACT_PROVIDER: "telegram", TELEGRAM_BOT_TOKEN: "T", TELEGRAM_CHAT_ID: "42" });
  assert.equal(res.status, 200);
  assert.equal(calls[0].url, "https://api.telegram.org/botT/sendMessage");
  assert.equal(calls[0].body.chat_id, "42");
  assert.equal(calls[0].body.text, "Name: Jane Doe\nEmail: jane@company.com\nMessage: Hi <there> & hello");
});

test("slack escapes control characters", async () => {
  const calls = mockFetch();
  await handle(post(good), { CONTACT_PROVIDER: "Slack", SLACK_WEBHOOK_URL: "https://hook" });
  assert.match(calls[0].body.text, /Hi &lt;there&gt; &amp; hello$/);
});

test("provider failure returns 502", async () => {
  mockFetch(500);
  const res = await handle(post(good), { CONTACT_PROVIDER: "slack", SLACK_WEBHOOK_URL: "https://hook" });
  assert.equal(res.status, 502);
});

test("non-POST returns 405", async () => {
  const res = await handle(new Request("http://x/", { method: "GET" }), {});
  assert.equal(res.status, 405);
});
