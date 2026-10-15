# Mojahed Ibrahim - Portfolio

Personal portfolio site built with React (Create React App) and Semantic UI.

## Development

```
npm install
npm start      # http://localhost:3000
npm run build  # production build in /build
```

## Configuration

The contact form posts to a personal Spring Boot API
([telegramApi](https://github.com/mibrahim95/telegramApi)). Create a `.env`
file (git-ignored) with:

| Variable | Purpose |
| --- | --- |
| `REACT_APP_API_HOST` | URL the contact form POSTs to |
| `REACT_APP_JAVA_API_USERNAME_AND_PASS` | `user:password` used for Basic auth |

Note: `REACT_APP_*` values are embedded in the public bundle, so don't treat the
credentials as secret.

## Content

Edit the JSON files in `src/json/` to update experience, projects and the
summary list.
