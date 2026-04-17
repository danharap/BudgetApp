# BudgetApp

A premium personal finance app built with Expo, React Native, and Supabase. Track spending, manage budgets, monitor bills, and stay on top of your finances — all in a polished dark-mode interface.

## Features

- **Dashboard** — Monthly spending overview with circular progress chart, weekly/daily averages, and quick insights
- **Transactions** — Log expenses, income, and transfers with a floating modal and numeric keypad. Grouped by day with net totals.
- **Budgets** — Set monthly spending limits per category. Visual progress bars and a tip card keep you on track.
- **Bills** — Track upcoming and recurring bills. Mark as paid, edit, or delete with full recurrence support.
- **Accounts** — Manage bank accounts and investment accounts. Balances update automatically when transactions are saved.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) (React Native) |
| Navigation | [Expo Router](https://expo.github.io/router) (file-based) |
| Backend | [Supabase](https://supabase.com) (Auth + Postgres + RLS) |
| State | [Zustand](https://zustand-demo.pmnd.rs) |
| Language | TypeScript |
| Deployment | [Vercel](https://vercel.com) |

## Architecture

```
app/                    # Expo Router screens
  (tabs)/               # Main tab screens (Home, Transactions, Budgets, Bills, Accounts)
  auth/                 # Sign in / Sign up
  onboarding/           # First-run setup flow
  add-transaction.tsx   # Floating modal: expense / income / transfer
  add-bill.tsx          # Add or edit a bill
  edit-budget.tsx       # Set monthly budget and category limits

components/             # Reusable UI components
  ui/                   # Base components (cards, buttons, keypad, tab bar)
  home/                 # Home screen components
  accounts/             # Account card
  budgets/              # Budget cards and empty CTA
  bills/                # Bill card
  transactions/         # Transaction list and groups

features/               # Service layer (Supabase ↔ Zustand)
  accounts/service.ts
  transactions/service.ts
  budgets/service.ts
  bills/service.ts
  onboarding/service.ts

store/useAppStore.ts    # Zustand global store
lib/supabase.ts         # Supabase client (platform-aware secure storage)
supabase/migrations/    # Postgres schema with RLS policies
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo`)
- A [Supabase](https://supabase.com) project

### Environment Variables

Create a `.env.local` file in the root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Run Locally

```bash
npm install
npx expo start
```

Press `w` to open in browser, or scan the QR code with the Expo Go app on your phone.

### Deploy to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Add your two environment variables in the Vercel dashboard
4. Deploy — Vercel runs `npx expo export --platform web` automatically

On iPhone: open the deployed URL in Safari → Share → **Add to Home Screen** for a full-screen app experience.

## Database Schema

The Supabase migration at `supabase/migrations/20240101000000_initial_schema.sql` creates:

- `profiles` — user display name and onboarding status
- `accounts` — bank/investment accounts per user
- `transactions` — expense, income, and transfer records
- `budgets` — monthly budget with total limit
- `budget_categories` — per-category spending limits
- `bills` — recurring and one-time bills

All tables have Row Level Security (RLS) enabled — users can only read and write their own data.

## Security

- No secrets are stored in the codebase
- Environment variables are injected at build time via Vercel
- Supabase anon key is safe to expose publicly — RLS policies enforce data isolation
- Auth sessions are stored in `expo-secure-store` on native and `localStorage` on web
