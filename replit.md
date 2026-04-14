# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend framework**: React + Vite
- **Styling**: Tailwind CSS
- **Design System**: LVE Component Library (Livvic + Mulish fonts, LVE color palette)

## Artifacts

### Annuity Tax Returns (`artifacts/annuity-tax-returns`)
- Static React web app (no backend API)
- Modernized version of legacy desktop "Tax Return Generation" tool
- Uses LVE design system: navy header (#00263e), blue primary (#006cf4), green accents (#178830)
- Components: Header, Footer, LveButton (cva variants), LveInput, YearSelector, AboutDialog
- Main page: TaxReturnGeneration - simulates tax return processing with progress bar and log output
- Fonts: Livvic (headers/buttons), Mulish (body/inputs) via Google Fonts
- No backend required - deployable as static website

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/annuity-tax-returns run dev` — run frontend locally
- `pnpm --filter @workspace/annuity-tax-returns run build` — production build

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
