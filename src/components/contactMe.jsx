import { useState } from "react";
import SectionHeader from "./sectionHeader";
import { ArrowUpRight, GitHub, LinkedIn, Send } from "./icons";
import { SOCIAL } from "../sections";

const API_HOST = import.meta.env.REACT_APP_API_HOST;

// WARNING: every REACT_APP_* / VITE_* variable is compiled into the public
// JavaScript bundle, so this value is readable by anyone who visits the site.
// It is only kept so the existing API keeps working; the API should not rely
// on it for protection (use rate limiting / CAPTCHA / origin checks there).
const API_BASIC_AUTH = import.meta.env.REACT_APP_JAVA_API_USERNAME_AND_PASS;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM = { fullName: "", email: "", msg: "", website: "" };

function validate({ fullName, email, msg }) {
  const errors = {};
  if (!fullName.trim()) errors.fullName = "Please enter your name.";
  if (!EMAIL_PATTERN.test(email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!msg.trim()) errors.msg = "Please enter a message.";
  return errors;
}

function Field({ id, label, error, children }) {
  return (
    <div className={`field${id === "contact-message" ? " full" : ""}`} data-invalid={!!error}>
      <label htmlFor={id}>
        {label} <span className="req" aria-hidden="true">*</span>
      </label>
      {children}
      {error && (
        <span className="field-error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}

function ContactMe() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = { fullName: "contact-name", email: "contact-email", msg: "contact-message" };
      document.getElementById(first[Object.keys(found)[0]])?.focus();
      return;
    }

    const name = form.fullName.trim();
    const success = {
      success: true,
      header: `Thanks for reaching out, ${name}!`,
      message: "Your message is on its way. I'll get back to you as soon as possible.",
    };

    // Honeypot: real visitors never see the "website" field.
    if (form.website) {
      setResponse(success);
      return;
    }

    setLoading(true);
    setResponse(null);
    try {
      const headers = { "Content-Type": "application/json" };
      if (API_BASIC_AUTH) headers.Authorization = `Basic ${btoa(API_BASIC_AUTH)}`;

      const res = await fetch(API_HOST, {
        method: "POST",
        headers,
        body: JSON.stringify({
          fullName: name,
          email: form.email.trim(),
          msg: form.msg.trim(),
        }),
      });

      if (res.ok) {
        setResponse(success);
        setForm(EMPTY_FORM);
      } else if (res.status >= 400 && res.status < 500) {
        setResponse({
          success: false,
          header: "Please check your details",
          message: "Make sure all fields are filled in and your email address is valid.",
        });
      } else {
        throw new Error(`Server responded with ${res.status}`);
      }
    } catch {
      setResponse({
        success: false,
        header: "Sorry, your message could not be sent",
        message: "Something went wrong on my end. Please try again in a moment, or reach me on LinkedIn.",
      });
    } finally {
      setLoading(false);
    }
  };

  const describedBy = (key, id) => (errors[key] ? `${id}-error` : undefined);

  return (
    <section id="contactMe" className="section contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHeader index="04" title="Contact" id="contact-title" />

        <div className="contact-grid">
          <div className="contact-aside" data-reveal>
            <p className="contact-title">
              Have a role or a project in mind? <em>Let&rsquo;s talk.</em>
            </p>
            <p className="contact-copy">
              Messages from this form are validated and delivered straight to my
              phone through my own Java Spring Boot API.{" "}
              <a className="text-link" href="https://github.com/mibrahim95/telegramApi" target="_blank" rel="noopener noreferrer">
                See how it works <ArrowUpRight />
              </a>
            </p>
            <div className="socials">
              <a className="icon-link" href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedIn />
              </a>
              <a className="icon-link" href={SOCIAL.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GitHub />
              </a>
            </div>
          </div>

          <div data-reveal style={{ "--reveal-delay": "100ms" }} aria-live="polite">
            {response?.success ? (
              <div className="sent" role="status">
                <span className="eyebrow">Message sent</span>
                <h3>{response.header}</h3>
                <p>{response.message}</p>
              </div>
            ) : (
              <form className="form" onSubmit={handleSubmit} noValidate aria-busy={loading}>
                {response && (
                  <div className="notice" role="alert">
                    <div>
                      <strong>{response.header}</strong>
                      <p>{response.message}</p>
                    </div>
                  </div>
                )}

                <Field id="contact-name" label="Full name" error={errors.fullName}>
                  <input
                    id="contact-name"
                    name="fullName"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={describedBy("fullName", "contact-name")}
                  />
                </Field>
                <Field id="contact-email" label="Email" error={errors.email}>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="jane@company.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={describedBy("email", "contact-email")}
                  />
                </Field>
                <Field id="contact-message" label="Message" error={errors.msg}>
                  <textarea
                    id="contact-message"
                    name="msg"
                    rows={6}
                    placeholder="What are you working on?"
                    required
                    value={form.msg}
                    onChange={handleChange}
                    aria-invalid={!!errors.msg}
                    aria-describedby={describedBy("msg", "contact-message")}
                  />
                </Field>

                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-footer">
                  <p className="form-note">All fields are required.</p>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Sending…" : "Send message"} <Send />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactMe;
