## Quick context for AI coding agents

- Project: Create React App (React 19) + TailwindCSS. Entry: `src/index.js` -> `src/App.js`.
- Routing: uses `react-router-dom` with `Routes`/`Route` in `src/App.js`.
- OAuth: Google OAuth provider is wrapped in `App.js` and reads `process.env.REACT_APP_GOOGLE_CLIENT_ID`.

## What to know first (big picture)

- Single-page frontend that talks to a backend running on http://127.0.0.1:5000. Many auth/API calls are hardcoded to that host in components (see `src/components/SignIn.jsx` and `src/components/SignUp.jsx`).
- Authentication flow: POST to `/api/signin` or `/api/signup` -> on success store token in `localStorage` under the key `token` (see `src/components/SignIn.jsx`).
- Google login flow: UI buttons redirect to `http://127.0.0.1:5000/login?redirect_url=...` and `src/pages/GoogleCallback.jsx` extracts `email` and `name` from query params and writes `userEmail`/`userName` to localStorage.
- Client-side guarded redirect: `src/components/RedirectHandler.jsx` checks `localStorage.getItem('token')` and navigates to `/mentormate-homepage`.

## Key files to reference when making changes

- Routing & providers: `src/App.js` (Google provider, route list, env var usage)
- App entry: `src/index.js`
- Auth UI + API calls: `src/components/SignIn.jsx`, `src/components/SignUp.jsx`, `src/components/Authentication.jsx`
- OAuth callback: `src/pages/GoogleCallback.jsx`
- Redirect helper: `src/components/RedirectHandler.jsx`
- Pages: `src/pages/*` (chat pages are named `chat_mama_dudu`, `chat_sis_nandi`, etc.)
- Styling: `tailwind.config.js`, `postcss.config.js`, and `src/index.css` include Tailwind setup.

## Project-specific patterns & conventions

- UI structure: `components/` holds reusable widgets and auth forms; `pages/` holds route-level screens. Follow this separation.
- Styling: Tailwind utility classes are used everywhere. Avoid introducing new CSS files unless necessary.
- API calls: existing code uses the browser `fetch` API with JSON headers (see `SignIn.jsx`/`SignUp.jsx`). Even though `axios` is listed in package.json, prefer following existing fetch-based patterns for consistency.
- Local storage: tokens and simple user info are stored directly in `localStorage` keys: `token`, `userEmail`, `userName`.
- Redirects: navigation uses `useNavigate()` from `react-router-dom` and `navigate('/path')` after side-effects.

## Build, run and test commands (developer workflow)

Use these from the project root (`c:\Users\ZoeDube\mentormate\client`) in PowerShell:

```powershell
npm install
npm start    # dev server at http://localhost:3000
npm test     # runs CRA tests
npm run build
```

Notes: environment variable `REACT_APP_GOOGLE_CLIENT_ID` is read at runtime in `App.js`. The backend base URL is currently hardcoded to `http://127.0.0.1:5000` in several files.

## Concrete examples for editing code

- To change sign-in behaviour, edit `src/components/SignIn.jsx` — it POSTs to `http://127.0.0.1:5000/api/signin` and on success calls `localStorage.setItem('token', data.token)` then `navigate('/mentormate-homepage')`.
- To centralize the API host, replace hardcoded strings in `src/components/SignIn.jsx` and `src/components/SignUp.jsx` with a single `src/config.js` exporting `API_BASE_URL` and update calls to `
  fetch(`${API_BASE_URL}/api/signin`, ...)`.
- For Google OAuth changes, update `src/App.js` (clientId env var) and `src/pages/GoogleCallback.jsx` (query param parsing -> storage).

## What to avoid / watch for

- Don't assume axios is used — follow existing `fetch` patterns when adding requests.
- The repo is CRA-based; avoid changing build tooling (e.g., eject) unless explicitly requested.
- Tailwind classes are pervasive; small CSS changes usually belong in components or the Tailwind config.

## Where to add tests / quick checks

- Unit / component tests live alongside `src` and run via `npm test` (CRA test runner). Start with small component tests for modified components.

---
If any of the above assumptions are incorrect or you want different conventions (e.g., switch to axios or centralize API host), tell me which approach you prefer and I will update these instructions.
