# Work Bets Product Plan

## 1) Core Experience (Wager Board)
**Goal:** Fun, fast betting within a shared workplace.

**Key entities**
- **Workplace** (tenant)
- **User**
- **Guest**
- **Wager**
  - title, description
  - list of options
  - creator
  - status (open/closed)
- **Vote**
  - selected option
  - base “1 work cred”
  - optional “enhancement” cred

**Flow**
1. User creates wager (title, description, options).
2. Wager appears on **Wager Board** as a card.
3. Anyone can vote (even with 0 work cred) → each vote counts as **1 work cred**.
4. Users can optionally **enhance** their vote up to a max allowed (spend work cred).
5. Creator can **close** wager and pick a winning option.
6. Winning voters get payout in work cred based on the payout strategy below.

**Rules**
- Every user or guest can always place a vote (1 cred).
- Enhanced vote = base + additional cred (capped per wager).
- Winners receive cred; losers lose their enhanced amount (base stays neutral or is consumed—pick rule explicitly).

## 2) Payouts & Odds (Simple but Standard)
**Calculation strategy**
- **Total work creds on the wager are divided among the winners.**
- **Additional work creds (enhancements) are capped to no more than half the total work creds on that wager at the time the user places the bet.**

**Odds presentation (simple UI)**
- “Popular pick” tag
- “x% chose this”
- “Potential payout” badge (simple)

## 3) UI Design System
**Style direction**
- **Light, pastel** palette (playful but clean).
- **Card-based layout** with rounded corners.
- **Tag chips** for metadata (status, popularity, odds).

**Card example elements**
- Title
- Description
- Options as buttons
- Tags: “Open”, “Trending”, “Low risk”
- “Vote” and “Enhance” controls

**Mobile-first**
- Single column on mobile
- Hamburger menu (top-left or top-right)

## 4) Pages & Components

### ✅ Wager Board
- List of wager cards
- Create wager button

### ✅ Wager Details (optional)
- Expanded view or inline reveal on card
- Voting + enhance slider
- Simple odds display

### ✅ User Profile
- Points summary
- Voting history (collapsible list)
- Points history (collapsible list)

### ✅ Admin
- User table (secure by default)
- Assign roles
- Move user to workplace
- Delete user
- Reset password (never viewable)

## 5) Roles & Permissions
- **Guest**: view wagers, place base votes, no enhancements unless granted.
- **User**: vote, enhance, create.
- **Creator**: close their own wagers.
- **Admin**: user management, role assignment, workspace assignment.

## 6) Testing Strategy (TDD-first)
**TDD loop**
- Write a failing test for the next behavior.
- Implement the minimal code to pass.
- Refactor with tests green.

### Unit + Component Testing
**Tools**
- Vitest for fast tests.
- React Testing Library (+ @testing-library/user-event) for component behavior.
- Optional: MSW only if you want to mock fetch/assets/etc. (you probably won’t need it for Convex calls).

**What to unit test**
- Pure functions (formatters, selectors, rules, parsing).
- UI components behavior that doesn’t require “real Convex data”.

### Backend Behavior (Convex)
**Tools**
- convex-test + Vitest to test Convex functions directly.

**What to test**
- Core invariants (authorization rules, domain constraints, idempotency where relevant).
- Critical query/mutation behavior: “given these docs, query returns X”, “mutation enforces Y”.
- Edge cases: missing fields, forbidden actions, concurrency-ish behavior (as applicable).

### Journey Testing (E2E)
**Tools**
- Cypress E2E.

**What to cover**
- A small set of “money paths”: login/session, main CRUD flows, permissions/roles, key navigation.
- Assertions around what the user sees and can do (not DOM implementation details).

### Regression Testing
- Cypress E2E regression suite (small + stable).
- Optional visual regression:
  - If you have Storybook: Chromatic.
  - If not: Cypress screenshot comparisons (more brittle).
- If you’re keeping tooling minimal: start with unit + convex-test + Cypress, add visual regression only if UI breakage becomes recurring.

## 7) Tech Stack Integration
**React + Tailwind + Vite + Convex**
- Convex handles:
  - Auth + user roles
  - Wager + vote data
  - Payout logic + odds calculation
- Tailwind for styling
- Optional ShadCN:
  - Button, Card, Dialog, Badge, Table

## 8) Next Step Suggestion
If you want, I can:
1. Scaffold the Vite + React + Tailwind + Convex project
2. Build the Wager Board UI first
3. Add the admin + user pages
4. Hook up Convex data + payout logic
