import { useState } from "react";
import Chat from "./chat";
import about from "../json/about.json";
import { RESUME, SOCIAL, external } from "../sections";

// Messages go to the Netlify Function first (netlify/functions/contact.js), which
// delivers them to Telegram or Slack with secrets kept server side. If it is off,
// misconfigured or down, they go to Netlify Forms (the static form in index.html).
const CONTACT_ENDPOINT = "/.netlify/functions/contact";

// Public, display-only: picks the live preview. "telegram" | "slack" | "email" (no preview).
// It must match the server's CONTACT_PROVIDER; it holds no secret.
const PREVIEW = (import.meta.env.REACT_APP_CONTACT_PROVIDER || "email").toLowerCase();
// With no chat provider the preview shows a neutral inbox notification instead.
const PREVIEW_LOOK = PREVIEW === "telegram" || PREVIEW === "slack" ? PREVIEW : "inbox";

// Same limits the contact function applies: name 3–99 characters, message
// under 250 characters, a valid email.
const NAME_MIN = 3;
const NAME_MAX = 99;
const MSG_MAX = 249;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY_FORM = { fullName: "", email: "", msg: "", website: "" };
const FIELD_IDS = { fullName: "contact-name", email: "contact-email", msg: "contact-message" };
const REJECTED = {
  state: "error",
  title: "That message was not accepted.",
  text: "Check that your name has at least 3 characters, your email is valid and the message is under 250 characters, then send it again.",
};

async function sendViaNetlify(data) {
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ "form-name": "contact", ...data }).toString(),
  });
  if (!res.ok) throw new Error(`Form service responded with ${res.status}`);
}

// Returns "sent" or "rejected". Throws only when no route could take the message.
async function sendMessage(data) {
  let res = null;
  try {
    res = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // network failure: fall through to Netlify Forms so the message is not lost
  }
  if (res?.ok) return "sent";
  if (res?.status === 400) return "rejected";
  await sendViaNetlify(data);
  return "sent";
}

function validate({ fullName, email, msg }) {
  const errors = {};
  const name = fullName.trim();
  if (!name) errors.fullName = "Please enter your name.";
  else if (name.length < NAME_MIN) errors.fullName = `Please enter at least ${NAME_MIN} characters.`;
  else if (name.length > NAME_MAX) errors.fullName = `Please keep your name under ${NAME_MAX + 1} characters.`;
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Please enter a valid email address, like jane@company.com.";
  if (!msg.trim()) errors.msg = "Please write a short message.";
  else if (msg.trim().length > MSG_MAX) errors.msg = `Please shorten your message to ${MSG_MAX} characters.`;
  return errors;
}

function ContactMe() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle" });
  const [typing, setTyping] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTyping((n) => n + 1);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const firstInvalid = Object.keys(FIELD_IDS).find((k) => found[k]);
    if (firstInvalid) {
      document.getElementById(FIELD_IDS[firstInvalid])?.focus();
      return;
    }

    const name = form.fullName.trim();
    if (form.website) {
      // Honeypot filled in: a bot. Pretend it worked and send nothing.
      setStatus({ state: "sent", name });
      return;
    }

    setStatus({ state: "sending" });
    try {
      const result = await sendMessage({ fullName: name, email: form.email.trim(), msg: form.msg.trim() });
      if (result === "sent") {
        setStatus({ state: "sent", name });
        setForm(EMPTY_FORM);
      } else {
        setStatus(REJECTED);
      }
    } catch {
      setStatus({
        state: "error",
        title: "Your message could not be sent.",
        text: "The contact service did not respond. Email me directly or message me on LinkedIn.",
        fallback: true,
      });
    }
  };

  const sending = status.state === "sending";
  const msgLength = form.msg.trim().length;
  const describe = (key, extra) => [errors[key] && `${FIELD_IDS[key]}-error`, extra].filter(Boolean).join(" ") || undefined;

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div>
          <h2 id="contact-title" data-reveal>
            Let&rsquo;s talk.
          </h2>
          <p className="contact-lede" data-reveal style={{ "--i": 1 }}>
            Hiring for a role, or have a project in mind? Send me a note here
            {PREVIEW === "telegram" && " and it lands on my phone as a Telegram message"}
            {PREVIEW === "slack" && " and it shows up in my Slack"}. I reply from{" "}
            <a className="link" href={`mailto:${about.email}`}>{about.email}</a>.
          </p>

          {status.state === "sent" ? (
            <div className="sent" role="status">
              <h3>Thanks, {status.name}. Your message is on its way to me.</h3>
              <p>I&rsquo;ll reply to the email address you gave me.</p>
            </div>
          ) : (
            <form className="form" onSubmit={handleSubmit} noValidate aria-busy={sending} data-reveal style={{ "--i": 2 }}>
              <div className="field-row">
                <div className="field" data-invalid={!!errors.fullName}>
                  <label htmlFor="contact-name">Your name</label>
                  <input
                    id="contact-name"
                    name="fullName"
                    autoComplete="name"
                    placeholder="Priya Raman"
                    value={form.fullName}
                    onChange={handleChange}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={describe("fullName")}
                    required
                  />
                  {errors.fullName && (
                    <div className="field-meta">
                      <span className="field-error" id="contact-name-error">{errors.fullName}</span>
                    </div>
                  )}
                </div>
                <div className="field" data-invalid={!!errors.email}>
                  <label htmlFor="contact-email">Your email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="priya@company.com"
                    value={form.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={describe("email")}
                    required
                  />
                  {errors.email && (
                    <div className="field-meta">
                      <span className="field-error" id="contact-email-error">{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="field" data-invalid={!!errors.msg}>
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="msg"
                  rows={6}
                  placeholder="What are you working on?"
                  value={form.msg}
                  onChange={handleChange}
                  aria-invalid={!!errors.msg}
                  aria-describedby={describe("msg", "contact-message-count")}
                  required
                />
                <div className="field-meta">
                  {errors.msg && <span className="field-error" id="contact-message-error">{errors.msg}</span>}
                  <span className={`field-count${msgLength > MSG_MAX ? " is-over" : ""}`} id="contact-message-count">
                    {msgLength} / {MSG_MAX}
                  </span>
                </div>
              </div>

              <div className="hp-field" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
              </div>

              {status.state === "error" && (
                <div className="notice" role="alert">
                  <strong>{status.title}</strong>
                  <p>{status.text}</p>
                  {status.fallback && (
                    <p>
                      <a className="link" href={`mailto:${about.email}`}>{about.email}</a>
                      {" · "}
                      <a className="link" href={SOCIAL.linkedin} {...external}>LinkedIn</a>
                    </p>
                  )}
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  {sending ? "Sending…" : "Send message"}
                </button>
                <p className="form-hint">All three fields are required.</p>
              </div>
            </form>
          )}
        </div>

        <div className="contact-side">
          <figure className="phone" data-reveal style={{ "--i": 2 }}>
            <div className="phone-screen">
              <Chat
                provider={PREVIEW_LOOK}
                name={form.fullName.trim()}
                email={form.email.trim()}
                msg={form.msg.trim()}
                typing={typing % 2 === 1}
              />
            </div>
            <figcaption>Live preview: the message as it reaches me, while you type.</figcaption>
          </figure>
          <aside className="contact-alt" data-reveal style={{ "--i": 3 }} aria-labelledby="contact-alt-title">
            <h3 id="contact-alt-title">Or reach me directly</h3>
            <ul>
              <li><span>Email</span><a className="link" href={`mailto:${about.email}`}>{about.email}</a></li>
              <li><span>LinkedIn</span><a className="link" href={SOCIAL.linkedin} {...external}>in/mojahed-ibrahim</a></li>
              <li><span>GitHub</span><a className="link" href={SOCIAL.github} {...external}>mibrahim95</a></li>
              <li><span>Résumé</span><a className="link" href={RESUME} {...external}>PDF, 2 pages</a></li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default ContactMe;
