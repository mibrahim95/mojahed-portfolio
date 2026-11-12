# Mojahed Ibrahim: Portfolio

Source for [mojahedsportfolio.com](https://mojahedsportfolio.com/): a single-page
portfolio with my experience, projects, résumé, and a contact form.

![Portfolio preview](public/og-image.jpg)

## Tech stack

- [React 18](https://react.dev/) + [Vite](https://vite.dev/)
- Hand-written CSS (no UI kit), two dark themes: Blue Hour (default) and Midnight, with a toggle
- Fonts self-hosted via Fontsource
- Contact form: a Netlify Function delivers messages to Discord, Slack or Telegram, with
  Netlify Forms as the fallback

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
| `npm test`        | Contact function, headers and skills tests     |

## Contact form

The form posts to a Netlify Function, `netlify/functions/contact.js`. The function
checks the message (name 3 to 99 characters, a valid email, message under 250
characters, empty honeypot) and sends it to the provider named in `CONTACT_PROVIDER`.
Tokens and webhook URLs stay on the server.

If the function is off (`none`), not configured, or fails, the browser posts the
message to **Netlify Forms** instead, so nothing is lost. The hidden
`<form name="contact">` in `index.html` is what Netlify detects for that.

### Environment variables

Set these in the Netlify dashboard: **Project configuration** > **Environment variables** >
**Add a variable** > **Add a single variable**. After changing any of them, go to
**Deploys** > **Trigger deploy** > **Deploy project** so they take effect.

| Variable | Where it is read | Value |
| --- | --- | --- |
| `CONTACT_PROVIDER` | function (secret side) | `discord`, `telegram`, `slack` or `none` |
| `REACT_APP_CONTACT_PROVIDER` | browser (public) | `discord`, `telegram`, `slack` or `email`. Picks the live preview next to the form; `email` shows none. Set it to match `CONTACT_PROVIDER` (use `email` when that is `none`). |
| `DISCORD_WEBHOOK_URL` | function | Discord only |
| `TELEGRAM_BOT_TOKEN` | function | Telegram only |
| `TELEGRAM_CHAT_ID` | function | Telegram only |
| `SLACK_WEBHOOK_URL` | function | Slack only |

> Never give a secret a `REACT_APP_` or `VITE_` prefix. Those variables are compiled
> into the public JavaScript and anyone can read them.

**Discord**

1. In Discord, make a private server and a private text channel (for example `#contact`).
2. Channel gear icon (**Edit Channel**) > **Integrations** > **Webhooks** > **New Webhook** >
   **Copy Webhook URL**. Anyone with the URL can post to the channel, so keep it secret.
3. In Netlify add: `CONTACT_PROVIDER` = `discord`, `DISCORD_WEBHOOK_URL` = the URL
   (tick **Contains secret values**), `REACT_APP_CONTACT_PROVIDER` = `discord`. Redeploy.
4. On your phone set the server's notifications to **All Messages** so each message buzzes.

The function turns off mentions (`@everyone` pings nobody), link previews and Discord's
markdown, so a sender can't format or ping anything.

**Telegram**

1. In Telegram, message **@BotFather**, send `/newbot`, pick a name and a username.
   It replies with the bot token.
2. Open a chat with your new bot and send it any message.
3. In a browser, open `https://api.telegram.org/bot<TOKEN>/getUpdates` (your token in
   place of `<TOKEN>`). Copy the number at `"chat":{"id": ...}`. That is the chat ID.
4. In Netlify add: `CONTACT_PROVIDER` = `telegram`, `TELEGRAM_BOT_TOKEN` = the token,
   `TELEGRAM_CHAT_ID` = the chat ID, `REACT_APP_CONTACT_PROVIDER` = `telegram`.
   Tick **Contains secret values** for the token. Redeploy.

**Slack**

1. Go to <https://api.slack.com/apps> > **Create New App** > **From scratch**, name it,
   pick your workspace.
2. **Incoming Webhooks** > turn on **Activate Incoming Webhooks** > **Add New Webhook
   to Workspace** > pick the channel > **Allow**. Copy the webhook URL.
3. In Netlify add: `CONTACT_PROVIDER` = `slack`, `SLACK_WEBHOOK_URL` = the URL
   (tick **Contains secret values**), `REACT_APP_CONTACT_PROVIDER` = `slack`. Redeploy.

**Netlify Forms only (no chat app)**

1. Set `CONTACT_PROVIDER` = `none` and `REACT_APP_CONTACT_PROVIDER` = `email`
   (or leave both unset). Redeploy.
2. One-time setup: **Forms** > **Enable form detection**, then redeploy. Then
   **Project configuration** > **Notifications** > **Emails and webhooks** >
   **Form submission notifications** > **Add notification** > **Email notification**,
   form `contact`, your email address.

Do the Forms setup even when Discord, Telegram or Slack is on: it is the fallback.

**Old variables to delete:** `REACT_APP_API_HOST` and `REACT_APP_JAVA_API_USERNAME_AND_PASS`
are no longer read. Remove them, and change that password anywhere you reuse it,
because it was public in the old bundle.

**Adding another provider (Discord, email):** add one entry to `PROVIDERS` in
`netlify/functions/contact.js` (a `configured` check and a `send` function), add a
test in `netlify/contact.test.js`, and list its variables here.

**Testing locally:** `npm run dev` has no functions, so the form falls back to
Netlify Forms and shows an error. To run the function locally, use the Netlify CLI
(`npx netlify dev`) with the variables in a git-ignored `.env` file.

## Theme

The site is dark by default. A small script at the top of `index.html` sets
`data-theme="light"` or `"dark"` on `<html>` before the page paints: the visitor's saved
choice first, then their system setting, then dark. The toggle in the nav
(`src/components/themeToggle.jsx`) flips it and saves the choice in `localStorage`.
Style light mode in CSS under `:root[data-theme="light"]`.

## Profile photo

The photo sits in a fixed frame and is cropped to fill it, so any photo fits.

1. Put the new image in `public/` (WebP, at least 600px on the short side).
2. In `src/json/about.json`, edit `photo`: `src` (for example `/profile.webp`), `alt`
   (describe the photo), `width` and `height` (the file's real pixel size), and `focal`.
3. `focal` is the point that stays in view, as `"x% y%"`: `"50% 50%"` is the center,
   `"50% 30%"` keeps the upper middle (good for a face in a portrait shot), `"30% 40%"`
   shifts left. Run `npm run dev` and adjust until the face sits well.

## Editing content

All page content lives in JSON, so most updates need no code changes:

- `src/json/about.json`: headline, intro, photo, Skills highlights and groups,
  education (major, honors, tutoring job), contact email
- `src/json/expList.json`: work experience
- `src/json/projects.json`: project cards (`imgPath`, `github` and `url` are optional)

Images live in `public/`. Keep screenshots around 800px wide (4:3 works best) and in WebP format.
