# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run dev` - Start Vite dev server with hot module replacement
- `npm run build` - TypeScript compilation followed by Vite production build
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally

## Tech Stack

- **Framework:** React 19 with TypeScript (strict mode)
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4 (via @tailwindcss/vite plugin)
- **State Management:** Zustand 5 (installed, ready for use)
- **Linting:** ESLint 9 with flat config, TypeScript ESLint, React hooks rules

## Architecture

This is a React frontend application using Vite's modern build setup:

- `src/main.tsx` - Application entry point using React 19's createRoot API with StrictMode
- `src/App.tsx` - Root component
- `src/index.css` - Tailwind CSS imports
- `vite.config.ts` - Vite configuration with React and Tailwind plugins

## TypeScript Configuration

The project uses strict TypeScript with ES2022 target and bundler module resolution. JSX uses the automatic `react-jsx` transform (no React import needed in components). Key strictness settings are enabled including `noUncheckedSideEffectImports` and `erasableSyntaxOnly` for better tree-shaking.

## ESLint Configuration

Uses the flat config format (`eslint.config.js`) with:
- JavaScript recommended rules
- TypeScript recommended rules
- React hooks rules (eslint-plugin-react-hooks)
- React refresh rules for Vite HMR compatibility
