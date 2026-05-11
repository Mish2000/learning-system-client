# QuickMath AI Learning System — Frontend Client

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-6-007FFF?logo=mui&logoColor=white)
![Realtime](https://img.shields.io/badge/Realtime-SSE-blue)
![i18n](https://img.shields.io/badge/i18n-English%20%2F%20Hebrew-green)

Frontend client for **QuickMath AI Learning System** — an adaptive mathematics learning platform with a polished React interface, topic-based practice, real-time learning dashboards, AI-generated explanations, admin tools, and full English/Hebrew support.

The client is built with **React**, **Vite**, **Material UI**, **React Router**, **Axios**, **Server-Sent Events**, and **i18next**. It communicates with a Spring Boot backend through `/api` endpoints and uses secure HTTP-only cookie sessions.

---

## Product overview

QuickMath gives students a guided way to practice mathematics while the system adapts to their performance. The frontend provides:

- A landing page for unauthenticated users.
- Login and registration flows.
- A personalized home dashboard.
- Topic and subtopic selection for practice.
- A notebook-style question solving interface.
- Immediate answer feedback and solution steps.
- AI-powered alternative explanations streamed in real time.
- User statistics and success-rate charts.
- Admin dashboard and topic management tools.
- Profile management with language, username, password, and image settings.
- English/Hebrew localization with RTL layout support.

---

## Key features

### Adaptive practice experience

Users select a math topic or subtopic, generate a question, solve it in a notebook-like interface, and receive immediate feedback. The backend tracks performance and adapts the user's difficulty level per subtopic.

Supported topic groups include:

- Arithmetic: addition, subtraction, multiplication, division, fractions.
- Geometry: rectangle, circle, triangle, polygon.

### AI-assisted learning

The client integrates with the backend's Ollama-powered SSE endpoint to stream AI responses progressively.

AI is used in two main places:

1. **Home dashboard summary** — a personalized learning summary based on the user's progress and topic performance.
2. **Question help** — an alternative explanation for a specific generated exercise.

The streaming UX is designed to feel responsive because tokens appear as they are generated.

### Real-time dashboards

The client uses `EventSource` connections for live dashboard updates:

- User dashboard: progress level, attempts, success rate, topic performance.
- Admin dashboard: system-wide users, attempts, average success, and topic insights.
- Notification center: progress-related notifications and difficulty changes.

### Admin experience

Admin users have access to a dedicated admin area with:

- Real-time system metrics.
- Topic/subtopic management.
- Soft-delete and restore workflows.
- Deleted-topic recovery UI.

Frontend admin checks are used for UX, while backend role enforcement remains the source of truth.

### Localization and RTL support

The client supports English and Hebrew through `i18next`. The layout direction is derived from the selected language:

```text
English -> LTR
Hebrew  -> RTL
```

The app also uses an RTL-aware Emotion cache and Material UI theme so Hebrew screens render naturally.

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 6 |
| UI library | Material UI 6 |
| Routing | React Router DOM 6 |
| API client | Axios |
| Realtime | Server-Sent Events / EventSource |
| Charts | MUI X Charts, Recharts, AG Charts |
| Localization | i18next, react-i18next |
| Markdown/math rendering | react-markdown, remark-math, rehype-katex, KaTeX |
| RTL support | Emotion cache, stylis, stylis-plugin-rtl |
| Styling | Material UI theme + CSS modules/assets |

---

## Project structure

```text
src/
├── App.jsx                         # Routing, auth bootstrap, layout direction
├── main.jsx                        # React entry point and global setup
├── setupAxios.js                   # Axios cookie auth and refresh interceptor
├── assets/                         # Images, icons, AI installation guide assets
├── components/
│   ├── Admin/                      # Admin dashboard and topic management
│   ├── Auth/                       # Login and registration screens
│   ├── Common/                     # Shared UI: language switcher, notifications, icons
│   └── Dashboard/                  # Home, profile, practice, notebook, statistics
├── services/                       # API helper modules
├── styles/                         # Global and component CSS
└── utils/                          # Constants, dictionary, theme, formatting helpers
```

Important frontend areas:

| File / package | Purpose |
|---|---|
| `App.jsx` | Auth state, protected routes, RTL/LTR setup, main route tree |
| `setupAxios.js` | Global `withCredentials`, 401 refresh queue, login redirect fallback |
| `utils/Dictionary.js` | English/Hebrew translation dictionary |
| `utils/Theme.js` | Material UI theme and visual styling |
| `Dashboard/Home.jsx` | Personalized home dashboard and AI learning summary |
| `Practice/QuestionGenerator.jsx` | Topic/subtopic selection and question generation |
| `Practice/NoteBook.jsx` | Notebook-style solving screen, answer submission, AI explanation stream |
| `Dashboard/UserDashboardSSE.jsx` | User statistics dashboard via SSE |
| `Admin/AdminDashboardSSE.jsx` | Admin metrics dashboard via SSE |
| `Admin/TopicManagementPage.jsx` | Topic soft-delete/restore management |
| `Common/NotificationCenter.jsx` | Notification dropdown and live events |
| `Dashboard/ProfilePage.jsx` | Profile, language, password, and image management |
| `Dashboard/AiInstallationGuide.jsx` | In-app Ollama installation guide |

---

## Main routes

| Route | Access | Description |
|---|---|---|
| `/landing` | Public | Marketing/intro page |
| `/login` | Public | User login |
| `/register` | Public | User registration |
| `/home` | Authenticated | Personalized dashboard and AI summary |
| `/practice` | Authenticated | Topic/subtopic selection and question generation |
| `/practice/:questionId` | Authenticated | Notebook solving interface |
| `/dashboard` | Authenticated | User statistics dashboard |
| `/admin-dashboard` | Admin | Admin dashboard and topic management tabs |
| `/profile` | Authenticated | User profile settings |

---

## Backend integration

The client expects the backend API to be available under `/api`.

During development, Vite proxies API requests to the Spring Boot backend:

```js
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
    secure: false,
  },
}
```

The backend is expected to run on:

```text
http://localhost:8080
```

The client runs on:

```text
http://localhost:5173
```

Because authentication uses HTTP-only cookies, Axios is configured globally with:

```js
axios.defaults.withCredentials = true;
```

---

## Authentication flow

The frontend does not manually store access tokens. Instead:

1. The user logs in through `/api/auth/login`.
2. The backend sets secure HTTP-only cookies.
3. Axios sends cookies automatically with API requests.
4. If a protected request returns `401`, the Axios interceptor calls `/api/auth/refresh`.
5. Queued requests continue after refresh succeeds.
6. If refresh fails, the user is redirected to `/login`.

This keeps the session flow cleaner and avoids exposing JWT access tokens to browser JavaScript.

---

## Prerequisites

Install:

- Node.js 18+ recommended
- npm
- Running QuickMath backend server
- Ollama configured on the backend machine if AI features are used

---

## Installation

From the client repository root:

```bash
npm install
```

---

## Running locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Make sure the backend is running on `http://localhost:8080` before logging in or opening protected routes.

---

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

---

## User experience flow

### 1. Register or log in

Users create an account or authenticate using email and password. After login, the app checks `/api/auth/me` and redirects authenticated users to the protected area.

### 2. Select practice topic

The practice page loads top-level topics and subtopics from the backend. Users can select a subtopic and generate a question.

### 3. Solve in notebook mode

The notebook page renders the generated question, supports structured answer inputs for multi-part problems, tracks solving time, and submits the answer to the backend.

### 4. Receive feedback

After submission, the user sees whether the answer is correct, the correct answer, and solution steps.

### 5. Ask AI for explanation

The user can request an AI explanation. The frontend opens an SSE stream and progressively renders the AI response.

### 6. Track progress

Dashboards update success rates, attempts, topic performance, strengths, weaknesses, and progress levels.

---

## Admin workflow

Admin users can open the admin section and manage the learning catalog:

- View live system metrics.
- Inspect topic performance.
- Delete topics using soft-delete behavior.
- Restore deleted topics.
- Manage parent topics and subtopics.

The frontend provides a clean admin UX, while authorization is enforced by the backend.

---

## AI installation guide

The client includes a visual in-app guide for installing and configuring Ollama. This is useful for local setup because the project is designed to run the AI tutor locally.

Default model:

```bash
ollama pull aya-expanse:8b
```

The backend streams responses from Ollama to the frontend through SSE.

---

## Localization

The app supports multilingual UI text through `i18next` and a central dictionary file. Language preference is reflected in:

- Interface text.
- Layout direction.
- AI prompt language.
- Profile settings.
- Notification formatting.
- Topic and difficulty labels.

---

## Production notes

For production deployment:

- Serve the built static files from a web server or hosting provider.
- Route `/api` to the Spring Boot backend.
- Use HTTPS.
- Configure backend cookies as secure.
- Set a strict frontend origin in backend CORS configuration.
- Do not expose backend secrets or JWT values to the client.

---

## What this project demonstrates

This frontend is especially relevant for full-stack/React roles because it includes:

- Protected routing and auth-aware navigation.
- Secure cookie-based API integration.
- Centralized Axios refresh-token handling.
- Real-time SSE consumption.
- AI response streaming UX.
- Admin and user dashboards.
- Multilingual and RTL-aware UI architecture.
- Material UI theming and reusable components.
- Chart-based statistics and profile management.
- Integration with a non-trivial Spring Boot backend.

---

## Related repository

This client is intended to run together with the Spring Boot backend API.

```text
learning-system-client  -> React/Vite frontend
learning-system-server  -> Spring Boot backend
```

Start the backend first, then run the client with `npm run dev`.
