# SIE Command Center — Claude Code Build Brief

A standalone HTML dashboard exists (`sie-command-center.html`). Hand this brief to Claude Code to rebuild it as a production web app.

---

## Context

User: Kyle Quilantang. Studying for the FINRA SIE exam scheduled **Friday, July 10, 2026 at 10:15 AM** at Camarillo Test Center. Study window starts **Monday, May 11, 2026**. Free-resource study route (no paid course). Audio learner using NotebookLM as primary aid.

The existing HTML file is a fully functional v1 with localStorage persistence. The goal is to elevate it into a real app with better data persistence, mobile UX, and integrations.

---

## Current Features (already in v1 HTML)

- Live countdown to exam day
- Phase progress tracker (5 phases, May 11 – July 9)
- "Today's Focus" card driven by current study week
- Practice exam logger (4 exams) with 3-consecutive-80% gate detection
- Session logger (hours + confidence 1–5)
- Streak counter, total hours logged, 7-day confidence average
- Free-resource link panel (Capital Advantage, Series 7 Guru, FINRA, SIEPracticeExam, Knopman, Quizlet, NotebookLM)
- Whiteboard concept map checklist by week
- Mission-anchor quote panel
- Editorial finance-terminal aesthetic: dark mode, Fraunces display + JetBrains Mono, orange `#ff7a1a` accent

---

## Stack Recommendation

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui — but keep the editorial finance-terminal aesthetic (do NOT default to generic shadcn looks). Lift the design tokens directly from the v1 HTML.
- **Database:** Supabase (Postgres + Auth) — free tier is plenty
- **Deployment:** Vercel
- **Fonts:** Self-host Fraunces + JetBrains Mono via `next/font`

---

## Data Model

```sql
-- Study sessions
CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  session_date date NOT NULL,
  hours numeric(3,1) NOT NULL,
  confidence smallint CHECK (confidence BETWEEN 1 AND 5),
  topic text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Practice exam scores
CREATE TABLE practice_exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  exam_number smallint NOT NULL,
  score smallint CHECK (score BETWEEN 0 AND 100),
  taken_at date NOT NULL,
  weak_units text[],
  notes text
);

-- Whiteboard checklist
CREATE TABLE whiteboard_maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  week_number smallint NOT NULL,
  topic text NOT NULL,
  completed_at timestamptz
);

-- Daily check-ins (TickTick mirror)
CREATE TABLE checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  checkin_date date NOT NULL,
  did_study boolean,
  reflection text,
  created_at timestamptz DEFAULT now()
);
```

Add Row Level Security (RLS) policies so each user only sees their own rows.

---

## Pages & Routes

| Route | Purpose |
|---|---|
| `/` | Dashboard (the v1 HTML, but driven by Supabase) |
| `/log` | Quick mobile-first session logger |
| `/exams` | Practice exam log + score history chart |
| `/calendar` | Visual 9-week timeline |
| `/resources` | Resource stack + add custom links |
| `/login` | Supabase magic link auth |

---

## Key Features to Build Beyond v1

1. **Mobile-first session logger** — big buttons, swipe to set confidence. Should be usable from phone right after the 6 AM study block.
2. **Score history chart** — practice exam scores over time (use Recharts, line chart)
3. **Daily push notifications** — at 5:55 AM (Mon–Fri) and 12:55 PM (Sat) reminding to start the study block. Use Vercel Cron + a notification service (Pushover or one-signal).
4. **Weakness tracker** — when logging exam scores, capture weak units. Aggregate across all exams to show "your weakest topics" so final-week drills are targeted.
5. **Whiteboard photo upload** — Supabase Storage. After completing a weekly whiteboard map, snap a photo, upload, attach to that week's record. Builds a visual study journal.
6. **NotebookLM quick-link generator** — a button that opens the user's NotebookLM with the right notebook for the current week.
7. **Test day mode** — on July 10, replace dashboard with a single "Drive to Camarillo · 9:15 AM · You've got this" screen.

---

## Aesthetic Notes (Important — preserve from v1)

- **NO** generic shadcn pastels or rounded-everything Linear-style boring UI
- Dark, editorial, monospace-heavy. Sharp 90° corners, hairline borders, precise grid.
- Display font: Fraunces (italic for accents)
- Body/data font: JetBrains Mono
- Single accent color: `#ff7a1a` (warm orange — feels like a confident bet, fits the WSB ethos)
- Background: pure black `#0a0a0a` with subtle radial gradients
- Numbers should feel like a Bloomberg terminal — precise, monospaced, slightly oversized
- Use uppercase letterspaced labels for section headers

---

## Integrations (Phase 2)

- **TickTick** — pull "SIE" tagged tasks via TickTick API and surface them in the dashboard
- **Google Calendar** — show today's study block + any conflicts on the dashboard
- **Notion** — push session reflections into Kyle's Memory Library database (data source ID: `9d508e2d-4e14-47e0-a718-af7bd24f6664`) so they end up alongside his other journal entries

---

## Build Order

1. Set up Next.js + Tailwind + shadcn + Supabase
2. Port v1 HTML structure to React components, keeping aesthetic tokens
3. Wire Supabase auth (magic link only — no passwords)
4. Replace localStorage with Supabase queries
5. Build mobile session logger
6. Add chart for exam history
7. Wire push notifications
8. Add whiteboard photo upload
9. Phase 2 integrations

---

## Reference: Phase Schedule (already encoded in v1)

| # | Phase | Window | Pass Gate |
|---|---|---|---|
| 1 | Foundation | May 11 – May 24 | Ch 1–2 quizzes ≥70% |
| 2 | Products Deep Dive | May 25 – Jun 14 | Product unit tests ≥75% |
| 3 | Trading & Accounts | Jun 15 – Jun 26 | Operations tests ≥75% |
| 4 | Diagnostic & Drills | Jun 27 – Jul 4 | 3× 80%+ exams |
| 5 | Final Push & Taper | Jul 5 – Jul 9 | Sleep, rest, trust |

## Reference: Exam Day

- **Friday July 10, 2026 · 10:15 AM**
- Ventura–Camarillo Test Center, 400 W Ventura Blvd Suite 130, Camarillo CA 93010
- Eligibility ID: T0887186
- Leave Wagon Wheel by 9:15 AM, arrive by 9:45 AM (30 min decompression buffer)
