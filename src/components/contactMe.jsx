import { useState } from "react";
import { Grid, Form, Segment, Header } from "semantic-ui-react";
import ContactResponse from "./contactResponse";

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
  if (!fullName.trim()) errors.fullName = "Please enter your name";
  if (!EMAIL_PATTERN.test(email.trim()))
    errors.email = "Please enter a valid email address";
  if (!msg.trim()) errors.msg = "Please enter a message";
  return errors;
}

function ContactMe() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleChange = (e, { name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const name = form.fullName.trim();

    // Honeypot: real visitors never see the "website" field.
    if (form.website) {
      setResponse({
        success: true,
        header: `Thank you for reaching out, ${name}!`,
        message: "I will get back to you as soon as possible.",
      });
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
        setResponse({
          success: true,
          header: `Thank you for reaching out, ${name}!`,
          message: "I will get back to you as soon as possible.",
        });
        setForm(EMPTY_FORM);
      } else if (res.status >= 400 && res.status < 500) {
        setResponse({
          success: false,
          header: "Please check your details",
          message:
            "Make sure all fields are filled in and your email address is valid.",
        });
      } else {
        throw new Error(`Server responded with ${res.status}`);
      }
    } catch {
      setResponse({
        success: false,
        header: "Sorry, your message could not be sent",
        message:
          "Something went wrong on my end. Please try again in a moment, or reach me on LinkedIn.",
      });
    } finally {
      setLoading(false);
    }
  };

  const sent = response?.success;

  return (
    <section id="contactMe" className="section">
      <Header as="h2" size="huge" dividing>
        Contact Me
        <Header.Subheader>
          Messages are validated and delivered to Telegram by my own Java Spring
          Boot API (
          <a
            href="https://github.com/mibrahim95/telegramApi"
            target="_blank"
            rel="noopener noreferrer"
          >
            view the source on GitHub
          </a>
          ).
        </Header.Subheader>
      </Header>

      <div aria-live="polite">
        {response && <ContactResponse {...response} />}
      </div>

      {!sent && (
        <Segment raised>
          <Form size="large" onSubmit={handleSubmit} loading={loading} noValidate>
            <Grid stackable>
              <Grid.Column width={7}>
                <Form.Input
                  id="contact-name"
                  label="Full Name"
                  placeholder="Full name"
                  name="fullName"
                  autoComplete="name"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                />
                <Form.Input
                  id="contact-email"
                  label="Email"
                  placeholder="you@example.com"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <div className="hp-field" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) =>
                      handleChange(e, { name: "website", value: e.target.value })
                    }
                  />
                </div>
              </Grid.Column>
              <Grid.Column width={9}>
                <Form.TextArea
                  id="contact-message"
                  rows={6}
                  label="Message"
                  placeholder="Please let me know your thoughts"
                  name="msg"
                  required
                  value={form.msg}
                  onChange={handleChange}
                  error={errors.msg}
                />
                <Form.Button
                  type="submit"
                  color="black"
                  size="large"
                  floated="right"
                  disabled={loading}
                  content="Send"
                  icon="paper plane"
                  labelPosition="right"
                />
              </Grid.Column>
            </Grid>
          </Form>
        </Segment>
      )}
    </section>
  );
}

export default ContactMe;
