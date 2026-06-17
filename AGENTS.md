# Repository Guidelines

## Project Structure & Module Organization

FlipiFriends is a Vite + React memory game. Application code lives in `src/`.
Use `src/App.jsx` as the top-level composition point and `src/main.jsx` for app
bootstrap, PWA registration, and analytics. UI is organized by feature in
`src/components/<feature>/`, with the matching CSS file beside each component.
Reusable game state and layout logic belong in `src/hooks/`; pure helpers belong
in `src/utils/`. Character catalog data lives in `src/data/character-groups/`
and is re-exported through the catalog modules. Static assets are under
`public/`, especially `public/characters/`, `public/brand/`, and
`public/screenshots/`. Generated production output goes to `dist/` and should
not be edited.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies from `pnpm-lock.yaml`.
- `pnpm dev`: start the local Vite development server.
- `pnpm build`: validate the character catalog, then create a production build.
- `pnpm preview`: serve the production build locally for verification.
- `pnpm lint`: run ESLint across JavaScript and JSX files.
- `pnpm validate:catalog`: check character groups and required catalog fields.

## Coding Style & Naming Conventions

Use ES modules, React function components, and hooks. Keep component files in
PascalCase, for example `WelcomeScreen.jsx`; use camelCase for hooks and helper
modules, for example `useMemoryGame.js`. Keep CSS class names descriptive and
feature-scoped. Follow the existing two-space indentation style in JSX, and keep
imports grouped before local CSS imports. ESLint is configured in
`eslint.config.js` with React Hooks and Vite React Refresh rules; fix lint errors
before submitting changes.

## Testing Guidelines

There is no automated unit test suite yet. Treat `pnpm lint`,
`pnpm validate:catalog`, and `pnpm build` as the required verification path.
For UI changes, also run `pnpm dev` or `pnpm preview` and manually check the
welcome screen, group selection, gameplay, level completion dialog, sound toggle,
and responsive layout. When adding catalog entries, verify asset paths match
files in `public/characters/`.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commits, such as `feat: add character assets`
and `fix: update analytics import`. Keep commits scoped and imperative:
`feat: add new character group`, `fix: correct catalog path`, or
`docs: update setup notes`. Pull requests should include a short summary,
verification commands run, linked issue if applicable, and screenshots or screen
recordings for visible UI changes.

## Security & Configuration Tips

Do not commit secrets or local environment files. Vercel Analytics should use
the React/Vite entrypoint, `@vercel/analytics/react`; do not import Next.js
entrypoints in this Vite app.
