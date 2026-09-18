# screeps-bot

A [Screeps](https://screeps.com) AI, written in TypeScript.

## Structure

- `src/main.ts` — the game loop entry point (`module.exports.loop`).
- `src/spawner.ts` — spawn logic per room.
- `src/roles/*.ts` — per-role creep behavior (harvester, etc.).
- `src/policy.ts` / `src/metrics.ts` — a small self-tuning policy loop.
- `src/status.ts` — per-tick colony snapshot written to `Memory.status`.
- `src/types.d.ts` — `Memory`/`CreepMemory` type augmentations.
- `tools/dashboard/` — a local web dashboard that reads the bot's Memory over
  the Screeps API; see its own setup notes there.

## Setup

```bash
npm install
npm run build   # type-checks, then bundles src/ -> dist/main.js (Vite, CJS)
```

## Deploying

`npm run deploy` builds and pushes `dist/main.js` to Screeps via
[`screeps-api`](https://www.npmjs.com/package/screeps-api) (`scripts/deploy.mjs`).
It needs:

- `SCREEPS_TOKEN` — a token from
  [screeps.com/a/#!/account/auth-tokens](https://screeps.com/a/#!/account/auth-tokens)
- `SCREEPS_BRANCH` — optional, defaults to `default` (the branch that runs live)

In CI, `.github/workflows/bot-deploy.yml` runs this automatically whenever a
PR into `main` is merged, using a `SCREEPS_TOKEN` repo secret.
