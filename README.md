# screeps-bot

A [Screeps](https://screeps.com) AI, written in TypeScript.

## Structure

- `src/main.ts` — the game loop entry point (`module.exports.loop`).
- `src/spawner.ts` — spawn logic per room.
- `src/roles/*.ts` — per-role creep behavior (harvester, etc.).
- `src/types.d.ts` — `Memory`/`CreepMemory` type augmentations.

## Setup

```bash
npm install
npm run build   # compiles src/ -> dist/ as CommonJS modules
```

## Deploying

Not wired up yet. Options to revisit:

- **Manual**: copy the compiled files under `dist/` into the in-game code
  editor (Overview → your account → Code).
- **[rollup-plugin-screeps](https://github.com/screeps/rollup-plugin-screeps)**:
  bundles and pushes straight to the official server or a private server via
  the Screeps API, using a `.screeps.json` token file (gitignored).
