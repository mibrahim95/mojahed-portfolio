import { test, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

// skills.js uses import.meta.glob, so load it through Vite.
const server = await createServer({ server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
const m = await server.ssrLoadModule("/src/skills.js");
after(() => server.close());

test("python finds the Heartbeat Frame", () => {
  const s = m.resolveSkill("python");
  assert.equal(s.name, "Python");
  assert.ok(s.items.some((i) => i.title === "Heartbeat Frame"));
});

test("java does not match JavaScript work", () => {
  const s = m.resolveSkill("Java");
  assert.equal(s.name, "Java");
  assert.ok(!s.items.some((i) => i.title === "Cousin's Supermarket inventory"));
});

test("aliases and typos resolve", () => {
  assert.equal(m.resolveSkill("springboot").name, "Spring Boot");
  assert.equal(m.resolveSkill("dockr").name, "Docker");
  assert.equal(m.resolveSkill("pyhton").name, "Python");
  assert.equal(m.resolveSkill("js").name, "JavaScript");
});

test("unknown skills get real suggestions", () => {
  assert.equal(m.resolveSkill("kubernetes"), null);
  const names = new Set(m.SKILLS.map((s) => s.name));
  const sug = m.suggestFor("typescript");
  assert.equal(sug[0], "JavaScript");
  assert.ok(sug.every((n) => names.has(n)));
});

test("SQL easter egg", () => {
  assert.equal(m.parseSql("SELECT * FROM work WHERE skill = 'php';"), "php");
  assert.equal(m.parseSql("php"), null);
});
