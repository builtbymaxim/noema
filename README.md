# Noema

Noema is a front-end prototype of a personal energy reflection app. It helps users log short mood and energy check-ins, review patterns in dashboards, and experiment with calendar-aware scheduling ideas.

The project is built as a single-page React application with a mobile-first interface, mock data, and interaction-heavy UI flows.

## Purpose

The repository demonstrates how an energy-tracking product could work end to end in a realistic product shell:

- onboarding and authentication states (mocked)
- quick reflection capture and manual reflection journaling
- insight visualizations for trends and focus patterns
- calendar view with activity and energy impact signals
- profile settings, goals, streaks, and achievement mechanics
- contextual in-app helper prompts

## Product Scope

Noema currently focuses on **experience design and interaction logic**, not backend integration.

Implemented behavior is mostly local state and simulated workflows (for example: test accounts, calendar connection, generated insights, and achievement progress). This makes the app suitable for:

- concept validation
- UX prototyping and demos
- portfolio presentation
- future backend/API integration planning

## Core Features

### 1) Landing and auth flow
- Branded landing screen with animated transitions
- Login, sign-up, and guest access paths
- Client-side validation and mock account handling

### 2) Reflection capture
- Two capture modes:
  - quick check-in (slider-based mood input)
  - detailed reflection form (importance, energy tag, notes, learning)
- Optional activity tagging (work, exercise, social, rest, university)
- Reflection CRUD in-memory state

### 3) Insight experience
- Weekly insights page with charts and modal deep dives
- Energy trend, focus comparison, and digest-style metrics
- Recommendation-style insight copy for planning decisions

### 4) Calendar experience
- Month/week/day views with sample events
- Event categories with visual coding (work, exercise, social, rest)
- Energy impact labels and AI-style scheduling suggestions

### 5) Profile and personalization
- Dark mode and notification toggles
- Connected calendar simulation (Google/iCloud/Outlook)
- Goal selection and progress badges
- Streak and achievements presentation

### 6) Contextual helper system
- Tip/reminder/insight cards triggered by app state
- Priority-based helper selection
- Temporary dismiss and permanent hide actions
- Optional action buttons that route users to relevant screens

## Technical Architecture

## Stack
- React 18 + TypeScript
- Vite 5 build toolchain
- Tailwind CSS for utility-first styling
- Recharts for chart visualizations
- Lucide icons for UI iconography
- Radix primitives + generated UI component set under `app/components/ui`

## Structure

- `app/App.tsx`  
  Main orchestrator: global state, auth flow, screen routing, reflection logic, helper triggers, and quick reflection modal.

- `app/components/`  
  Feature screens and shared UI wrappers:
  - `LandingScreen.tsx`
  - `DashboardScreen.tsx`
  - `WeeklyReflectionsScreen.tsx`
  - `CalendarScreen.tsx`
  - `ProfileScreen.tsx`
  - `BottomNav.tsx`, `AppContainer.tsx`, `Helper.tsx`

- `app/components/ui/`  
  Reusable low-level UI primitives (Radix/shadcn-style inventory), included as a component toolbox.

- `styles/`  
  Theme tokens, Tailwind wiring, custom animation keyframes, and base global CSS.

- `assets/`  
  Brand asset(s) used in the interface.

## Data and state model

Noema currently uses local React state as the source of truth:

- `savedReflections`
- `connectedCalendars`
- `settings` (theme, notifications, locations, helper preferences)
- navigation and transition state
- helper lifecycle state (seen, dismissed, hidden, contextual triggers)

This keeps iteration speed high and enables deterministic UI demonstrations.

## Recent repository activity (last months)

Commit history is intentionally small and focused:

1. **Initial commit**: introduced the full prototype codebase, UI system, styling, and project scaffolding.
2. **Follow-up cleanup commit**: removed a local Claude permissions settings file from version control.

Implication: the repository is currently in an early but already feature-rich prototype stage, with most capability added in one concentrated implementation pass.

## What this project reveals about the author

From architecture and implementation choices, the project highlights strengths in:

- product-minded front-end engineering
- interaction design and UX storytelling
- state-driven UI logic in React
- rapid prototyping with modern tooling
- visual polish (animations, micro-interactions, dark mode adaptation)
- information design for insight-oriented interfaces

## Value and insights delivered by the app concept

Even with mocked data, the product model demonstrates concrete user value:

- identifying personal high/low-energy patterns
- linking activities and schedules to perceived energy impact
- encouraging consistent reflection behavior via streak mechanics
- converting raw check-ins into actionable planning suggestions

This translates subjective well-being signals into lightweight decision support.

## Getting started

## Requirements
- Node.js 18+
- npm 9+

## Install

```bash
npm install
```

## Run locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

## Limitations and next steps

Current limitations:
- No persistent backend or authentication provider
- No real calendar API integration
- Static/sample data in insight and profile sections
- No automated test suite included yet

Recommended next steps:
- introduce API-backed persistence for reflections and settings
- integrate calendar providers via OAuth and event sync
- derive insights from real user data instead of static fixtures
- add unit/component tests and end-to-end flows
- define analytics and telemetry for product learning loops

## License

No explicit license file is currently included in this repository.
