# Asah — Play ideas that grow with your child

**Live app:** https://playwithasah.lovable.app

Asah is a bilingual (Bahasa Indonesia / English) early-childhood play companion for Indonesian parents and caregivers. It suggests short, everyday play activities matched to a child's age (0–72 months) and to the items already at home, and turns each finished activity into visible growth in a "garden of skills".

## What it does

- **Age-matched activities** — 40+ activities across 9 age groups, each with a short description, step-by-step instructions and an illustration for every step.
- **Household items matching** — only shows activities the family can do with what they have; material-free options are always available.
- **Garden of development** — four plants, one per skill area (Moving, Talking, Socialising, Thinking). Every finished activity waters a plant; plants only grow, never wilt. No scores, streaks or comparisons.
- **Growth replay** — a short time-lapse of how the garden grew, with activity names and dates.
- **History** — a log of every recorded play moment.
- **Device-only family spaces** — no passwords or cloud account; data stays in the browser on the device. Resumable onboarding, multiple children, sign out without erasing data.
- **Works offline** as an installable web app, shown in a phone layout on every screen size.

> Asah does not give medical or clinical assessments and is not a substitute for a health professional.

## How we used Flashpoint AI

- **Build personas** — synthesized parent interviews into personas such as *Dewi*, which shaped the onboarding flow, tone and activity length.
- **Test hypotheses** — checked each product hypothesis against existing research on early childhood development and caregiver behaviour.
- **Pick key findings** — kept the strongest evidence for our presentation slides and used it to prioritise features.

## Tech stack

TanStack Start (React 19), TypeScript, Vite, Tailwind CSS v4, Vitest.

## How to run it

**Just open the link — nothing to install or configure:**

https://playwithasah.lovable.app

All family data is stored in the browser on your own device, so there are no accounts, credentials or environment variables to set up. The same layout appears on every screen size.

## Run it from source (optional)

Only needed if you want to change the code or host your own copy.

### Prerequisites

- Node.js 20 or newer
- npm (or bun / pnpm)
- Git

### Setup and run locally

```sh
git clone <your-repository-url>
cd <repository-folder>
npm install
npm run dev        # http://localhost:8080
```

Other commands:

```sh
npm run test       # run the test suite
npm run build      # production build
npm run preview    # preview the production build
npm run lint       # lint the code
```

### Environment variables

None are required — the app runs as-is with no keys or services.

If you deploy your own copy or add optional services later, create a `.env` file in the project root using placeholder values like these:

```env
# Optional — public URL of your deployment
VITE_APP_URL=https://your-app.example.com

# Optional — only if you add an external service later (placeholders, never commit real keys)
VITE_PUBLIC_API_KEY=your-public-key-here
SERVER_SECRET_KEY=your-secret-key-here
```

Variables prefixed with `VITE_` are visible in the browser; keep secrets in non-prefixed server-only variables.

## Project structure (short)

- `src/routes/` — pages (Today, Development, History, Settings, activity details)
- `src/components/asah/` — app components (garden, onboarding, carousel)
- `src/data/`, `src/lib/` — activity catalogue, translations and domain rules
- `src/test/` — tests
