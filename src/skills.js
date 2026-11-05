import about from "./json/about.json";
import projects from "./json/projects.json";
import experiences from "./json/expList.json";
import brands from "./assets/logos/brands.json";

// Simple Icons (CC0) copied into src/assets/logos. Each file is one <path>.
const files = import.meta.glob("./assets/logos/*.svg", { query: "?raw", import: "default", eager: true });
const PATHS = Object.fromEntries(
  Object.entries(files).map(([file, svg]) => [file.match(/([^/]+)\.svg$/)[1], svg.match(/ d="([^"]+)"/)[1]])
);

// Skill name -> Simple Icons slug. Skills without a free logo get a lettered tile.
const LOGO = {
  PHP: "php", MySQL: "mysql", JavaScript: "javascript", jQuery: "jquery", HTML: "html5", CSS: "css",
  Java: "openjdk", "Spring Boot": "springboot", React: "react", Python: "python", Linux: "linux",
  Docker: "docker", Git: "git", "Raspberry Pi": "raspberrypi", Jira: "jira", Maven: "apachemaven",
  "Concourse CI/CD": "concourse", Proxmox: "proxmox", Tailscale: "tailscale", Go: "go", Vite: "vite",
  "Netlify Functions": "netlify", Flask: "flask", NumPy: "numpy", "Telegram Bot API": "telegram",
  RetroPie: "retropie",
};

export const logoBySlug = (slug) => (PATHS[slug] ? { d: PATHS[slug], hex: brands[slug] } : null);
export const logoFor = (name) => logoBySlug(LOGO[name]);

// The skills list in about.json uses a few long labels; fold them onto the tag the items use.
const CANON = {
  "Git and GitHub": "Git",
  "Excel: PivotTables, VLOOKUP, macros": "Excel",
  "Linux containers (LXC)": "LXC",
  "Slack, Teams and email alerting": "Alerting",
  "Recurring reports": "Reporting",
  REST: "REST APIs",
};
const canon = (s) => CANON[s] || s;

const edu = about.education;
export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Every place on the page a skill can point to.
export const ITEMS = [
  ...projects.map((p) => ({
    type: "project",
    key: `p-${slug(p.header)}`,
    title: p.header,
    sub: p.kind,
    when: p.year,
    tags: p.skills.map(canon),
  })),
  ...experiences.map((j) => ({
    type: "job",
    key: `job-${j.id}`,
    title: j.title,
    sub: j.position,
    when: j.dates,
    tags: j.skills.map(canon),
  })),
  {
    type: "school",
    key: "education",
    title: edu.school,
    sub: `${edu.short} ${edu.major}`,
    when: edu.year,
    // What the MIS course he tutored covered (about.json education.teaching).
    tags: ["SQL", "PHP", "HTML", "CSS", "Teaching"],
  },
];

const GROUPS = about.skills.map((g) => ({ group: g.group, items: g.items.map(canon) }));
const inGroups = new Set(GROUPS.flatMap((g) => g.items));
const extra = [...new Set(ITEMS.flatMap((i) => i.tags))].filter((t) => !inGroups.has(t)).sort();
if (extra.length) GROUPS.push({ group: "Also in my work", items: extra, more: true });
export { GROUPS };

const aliasesOf = {};
for (const [alias, name] of Object.entries(about.skillAliases)) (aliasesOf[canon(name)] ||= []).push(alias);
aliasesOf.Excel = [...(aliasesOf.Excel || []), "excel", "pivottables", "vlookup", "macros"];
aliasesOf.LXC = [...(aliasesOf.LXC || []), "lxc", "containers"];
aliasesOf.Git = [...(aliasesOf.Git || []), "github"];
aliasesOf["Oracle PL/SQL"] = [...(aliasesOf["Oracle PL/SQL"] || []), "oracle"];

export const SKILLS = GROUPS.flatMap((g) =>
  g.items.map((name) => ({
    name,
    group: g.group,
    aliases: aliasesOf[name] || [],
    items: ITEMS.filter((i) => i.tags.includes(name)),
  }))
);
export const findSkill = (name) => SKILLS.find((s) => s.name === name);

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9+#/]+/g, " ").trim();

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

const isSubsequence = (q, s) => {
  let i = 0;
  for (const c of s) if (c === q[i]) i++;
  return i === q.length;
};

// True when a and b differ only by two neighbouring letters swapped ("pyhton" for "python").
function swapped(a, b) {
  if (a.length !== b.length) return false;
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return i < a.length - 1 && a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
}

// 0 = no match. Exact beats prefix beats word prefix beats substring beats typo beats loose letters.
function score(q, text) {
  const t = norm(text);
  if (!t) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 85 - Math.min(t.length - q.length, 15);
  if (t.split(" ").some((w) => w.startsWith(q))) return 70;
  if (q.length >= 2 && t.includes(q)) return 60;
  if (q.length >= 4) {
    if (swapped(q, t.slice(0, q.length))) return 50;
    const d = editDistance(q, t.slice(0, q.length + 1));
    if (d <= 1) return 50;
    if (d <= 2 && q.length >= 6) return 38;
  }
  if (q.length >= 3 && isSubsequence(q, t.replace(/ /g, ""))) return 25;
  return 0;
}

// Fuzzy search over every skill name and alias. Ties go to skills with more work behind them.
export function searchSkills(query) {
  const q = norm(query);
  if (!q) return [];
  return SKILLS.map((s) => ({ skill: s, score: Math.max(score(q, s.name), ...s.aliases.map((a) => score(q, a) - 2)) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.skill.items.length - a.skill.items.length)
    .map((r) => r.skill);
}

// Typed text -> the one skill to filter by: an exact name or alias, or a strong fuzzy hit.
export function resolveSkill(query) {
  const q = norm(query);
  if (!q) return null;
  const exact = SKILLS.find((s) => norm(s.name) === q || s.aliases.some((a) => norm(a) === q));
  if (exact) return exact;
  const [best] = searchSkills(query);
  return best && score(q, best.name) >= 50 ? best : null;
}

// Things people search for that are not on record, and the closest real skills.
const NEAR = {
  typescript: ["JavaScript", "React"], ts: ["JavaScript", "React"], node: ["JavaScript", "REST APIs"],
  nodejs: ["JavaScript", "REST APIs"], vue: ["React", "JavaScript"], angular: ["React", "JavaScript"],
  laravel: ["PHP", "MySQL"], symfony: ["PHP", "MySQL"], wordpress: ["PHP", "MySQL"],
  postgres: ["MySQL", "SQL"], postgresql: ["MySQL", "SQL"], mssql: ["SQL", "Oracle PL/SQL"], tsql: ["SQL", "Oracle PL/SQL"],
  kubernetes: ["Docker", "Proxmox"], k8s: ["Docker", "Proxmox"], aws: ["Linux", "Docker"], azure: ["Linux", "Docker"],
  cloud: ["Docker", "Linux"], kotlin: ["Java", "Spring Boot"], "c#": ["Java", "Spring Boot"], net: ["Java", "Spring Boot"],
  tableau: ["Excel", "Reporting"], powerbi: ["Excel", "Reporting"], "power bi": ["Excel", "Reporting"],
  etl: ["CloverDX", "Data-ingestion pipelines"], bash: ["Linux", "Git"], shell: ["Linux", "Git"],
  pandas: ["Python", "NumPy"], api: ["REST APIs", "Spring Boot"], testing: ["Unit testing", "Code review"],
};
const POPULAR = ["PHP", "SQL", "JavaScript", "Java"];

export function suggestFor(query) {
  const q = norm(query);
  const picks = NEAR[q] || NEAR[q.replace(/ /g, "")] || [];
  const loose = searchSkills(query).map((s) => s.name);
  return [...new Set([...picks, ...loose, ...POPULAR])].slice(0, 4);
}

// Small easter egg: SELECT * FROM work WHERE skill = 'php'
export function parseSql(text) {
  const m = text.match(/^\s*select\b.*\bwhere\b\s+skill\s*(?:=|like)\s*['"]?([^'";]+)['"]?\s*;?\s*$/i);
  return m ? m[1].replace(/%/g, "").trim() : null;
}

// Dates in the JSON use en dashes; the page shows a plain "to".
export const dash = (s) => s.replace(/\s*[–—]\s*/g, " to ");

export function countLine(skill) {
  const n = (t) => skill.items.filter((i) => i.type === t).length;
  const parts = [
    [n("project"), "project", "projects"],
    [n("job"), "job", "jobs"],
  ].map(([c, one, many]) => `${c} ${c === 1 ? one : many}`);
  if (n("school")) parts.push("education");
  return parts.join(", ");
}
