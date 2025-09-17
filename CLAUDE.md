# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application for simple time tracking, bootstrapped with `create-next-app`. The project uses TypeScript, React 19, and Tailwind CSS v4 for styling.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Fonts**: Geist Sans and Geist Mono from next/font/google
- **Linting**: ESLint with Next.js core-web-vitals and TypeScript configs

### Project Structure
- `src/app/` - App Router pages and layouts
- `src/app/layout.tsx` - Root layout with font configuration
- `src/app/page.tsx` - Main page component
- `src/app/globals.css` - Global styles with Tailwind and CSS variables
- Path alias `@/*` maps to `./src/*`

### Styling System
The project uses Tailwind CSS v4 with a custom theming system:
- CSS variables defined in `globals.css` for colors (`--background`, `--foreground`)
- Automatic dark mode support via `prefers-color-scheme`
- Font variables integrated with Tailwind config

### Configuration Files
- `tsconfig.json` - TypeScript configuration with strict mode and Next.js plugin
- `eslint.config.mjs` - ESLint flat config with Next.js rules
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS
- `next.config.ts` - Next.js configuration (minimal)