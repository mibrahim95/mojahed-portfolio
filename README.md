# Mojahed Ibrahim — Portfolio

Source for [mojahedsportfolio.com](https://mojahedsportfolio.com/): a single-page
portfolio with my experience, projects, résumé, and a contact form.

![Portfolio preview](public/og-image.jpg)

## Tech stack

- [React 18](https://react.dev/) + [Vite](https://vite.dev/)
- Hand-written CSS (no UI kit), one page in three styles: dark and sleek (hero, contact),
  retro arcade (projects, with keyboard-driven project select) and clean and light (experience)
- Fonts self-hosted via Fontsource
- Contact form posts to Netlify Forms, or to my own Java Spring Boot API
  ([telegramApi](https://github.com/mibrahim95/telegramApi)) when it is running

## Getting started

Requires Node.js 20.19+ or 22.12+ (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script            | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload           |
| `npm run build`   | Production build into `build/`                 |
| `npm run preview` | Serve the production build locally             |
| `npm run lint`    | Run ESLint                                     |

## Contact form

The form has two delivery routes:

1. **Netlify Forms (default).** With no API configured, the form posts to Netlify
   Forms. The hidden `<form name="contact">` in `index.html` is what Netlify
   detects at deploy time. One-time setup in the Netlify dashboard:
   - **Forms** > **Enable form detection**, then redeploy.
   - **Project configuration** > **Notifications** > **Emails and webhooks** >
     **Form submission notifications** > **Add notification** > **Email notification**,
     form `contact`, your email address.
2. **Telegram API (optional).** Set `REACT_APP_API_HOST` to the
   [telegramApi](https://github.com/mibrahim95/telegramApi) `/sendMessage` URL and the
   message goes to Telegram instead, with a live phone preview next to the form. If
   that API is down or returns a 5xx, the form falls back to Netlify Forms so the
   message is not lost.

For local work, put the variables in `.env.local` (git-ignored):

```bash
REACT_APP_API_HOST=https://your-api.example.com/sendMessage
# Optional. Sent as HTTP Basic auth to the contact API.
REACT_APP_JAVA_API_USERNAME_AND_PASS=username:password
```

> **Note:** every `REACT_APP_*` / `VITE_*` variable is compiled into the public
> JavaScript bundle and can be read by anyone. Do not treat the Basic auth value
> as a secret; protect the API itself (rate limiting, CAPTCHA, origin checks).

## Editing content

All page content lives in JSON, so most updates need no code changes:

- `src/json/about.json` — headline, intro, quick facts, Skills highlights and groups,
  education, contact email
- `src/json/expList.json` — work experience
- `src/json/projects.json` — project cards (`imgPath`, `github` and `url` are optional)

Images live in `public/`. Keep screenshots around 800px wide (4:3 works best) and in WebP format.
