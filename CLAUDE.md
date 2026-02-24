# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev          # Start development server
bun run build        # Production build
bun run preview      # Preview production build
bun run check        # TypeScript + Svelte type checking
bun run check:watch  # Watch mode type checking
```

> Use `bun` as the package manager (enforced via `.npmrc` with `engine-strict=true`).

## Architecture

SvelteKit 2 app with Svelte 5, TypeScript, and Tailwind CSS v4. Follows **Feature-Sliced Design (FSD)** — layers can only import from layers below them.

```
src/
├── app/             # Layer: initialization
│   ├── index.html   # HTML entry (lang="ru")
│   ├── routes/      # SvelteKit file-based routing (+page.svelte, +layout.svelte)
│   └── styles/
│       └── globals.css  # Global Tailwind + OKLCH theme tokens
├── pages/           # Layer: page compositions (import from widgets ↓)
├── widgets/         # Layer: composite blocks, e.g. Header, Footer
├── features/        # Layer: user interactions / business logic
├── entities/        # Layer: business entities
└── shared/          # Layer: reusable primitives
    ├── ui/          # UI components (shadcn-svelte pattern)
    ├── hooks/       # Custom Svelte hooks
    └── utils.ts     # cn(), WithElementRef, WithoutChild[ren] helpers
```

**FSD import rule**: `app` → `pages` → `widgets` → `features` → `entities` → `shared`. Never import upward.

Each slice exposes a public API via `index.ts`.

## Key Conventions

**Path alias**: `@/*` maps to `src/*` for imports (e.g. `@/shared/ui/button`).

**Routes location**: configured to `src/app/routes/` (non-default SvelteKit path) in `svelte.config.js`.

**UI components** follow the shadcn-svelte pattern — see `components.json`. Components use `tailwind-variants` (`tv()`) for typed variant props and `cn()` (clsx + tailwind-merge) for class merging.

**Theming**: CSS custom properties in `globals.css` using OKLCH color space. Dark mode via `.dark` class on `<html>`.

**Adding shadcn-svelte components**:
```bash
bunx shadcn-svelte@latest add <component>
```
Components land in `src/shared/ui/` per the alias in `components.json`.
