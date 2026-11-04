import { useState } from "react";
import Chat from "./chat";
import { SOCIAL, external } from "../sections";

const API_HOST = import.meta.env.REACT_APP_API_HOST;

// WARNING: every REACT_APP_* / VITE_* variable is compiled into the public
// JavaScript bundle, so this value is readable by anyone who visits the site.
// It is only kept so the existing API keeps working; the API should not rely
// on it for protection (use rate limiting / CAPTCHA / origin checks there).
const API_BASIC_AUTH = import.meta.env.REACT_APP_JAVA_API_USERNAME_AND_PASS;

// Same limits the Spring Boot validator applies (telegramApi Validator.java):
// name 3–99 characters, message under 250 characters, a valid email.
const NAME_MIN = 3;
const NAME_MAX = 99;
const MSG_MAX = 249;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY_FORM = { fullName: "", email: "", msg: "", website: "" };
const FIELD_IDS = { fullName: "contact-name", email: "contact-email", msg: "contact-message" };

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
      const headers = { "Content-Type": "application/json" };
      if (API_BASIC_AUTH) headers.Authorization = `Basic ${btoa(API_BASIC_AUTH)}`;
      const res = await fetch(API_HOST, {
        method: "POST",
        headers,
        body: JSON.stringify({ fullName: name, email: form.email.trim(), msg: form.msg.trim() }),
      });

      // The API answers 200 with { success: false } when its validation fails.
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.success !== false) {
        setStatus({ state: "sent", name });
        setForm(EMPTY_FORM);
      } else if (res.ok || (res.status >= 400 && res.status < 500)) {
        setStatus({
          state: "error",
          title: "That message was not accepted.",
          text: "Check that your name has at least 3 characters, your email is valid and the message is under 250 characters, then send it again.",
        });
      } else {
        throw new Error(`Server responded with ${res.status}`);
      }
    } catch {
      setStatus({
        state: "error",
        title: "Your message could not be sent.",
        text: "The contact service did not respond. Try again in a minute, or message me on LinkedIn.",
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
            Have a role or a project in mind? Send it here and it lands on my
            phone as a Telegram message, through{" "}
            <a className="link" href={SOCIAL.api} {...external}>my own Spring Boot API</a>.
          </p>

          {status.state === "sent" ? (
            <div className="sent" role="status">
              <h3>Thanks, {status.name}. Your message is on my phone.</h3>
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
                    placeholder="Jane Doe"
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
                    placeholder="jane@company.com"
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

        <figure className="phone" data-reveal style={{ "--i": 2 }}>
          <div className="phone-screen">
            <div className="phone-top">
              <span className="phone-avatar" aria-hidden="true">MI</span>
              <div>
                <p className="phone-title">Portfolio messages</p>
                <p className="phone-sub">bot</p>
              </div>
            </div>
            <Chat
              name={form.fullName.trim()}
              email={form.email.trim()}
              msg={form.msg.trim()}
              typing={typing % 2 === 1}
            />
          </div>
          <figcaption>Live preview: the exact text my API sends, as you type.</figcaption>
        </figure>
      </div>
    </section>
  );
}

export default ContactMe;
