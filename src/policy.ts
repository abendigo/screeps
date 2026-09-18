// A minimal (1+1) evolutionary tuner: every WINDOW_LENGTH ticks, trial a small
// perturbation of the policy weights and keep it only if the reward improved.
// This is intentionally simple and noisy (room state drifts between windows,
// e.g. as RCL rises) rather than a rigorous optimizer - it's meant to nudge a
// few knobs in the right direction over time on a live server, safely.
import * as metrics from "metrics";

const WINDOW_LENGTH = 200;
const STEP_SIZE = 1;
const MIN_TARGET_HARVESTERS = 1;
const MAX_TARGET_HARVESTERS = 6;
const DEATH_PENALTY = 50;
const HISTORY_LIMIT = 20;

const DEFAULT_WEIGHTS: PolicyWeights = { targetHarvesters: 3 };

function clampTargetHarvesters(value: number): number {
  return Math.max(MIN_TARGET_HARVESTERS, Math.min(MAX_TARGET_HARVESTERS, value));
}

function randomStep(): number {
  return Math.random() < 0.5 ? -STEP_SIZE : STEP_SIZE;
}

function init(room: Room): PolicyMemory {
  return {
    weights: { ...DEFAULT_WEIGHTS },
    candidateWeights: null,
    windowStartTick: Game.time,
    windowStartSnapshot: metrics.snapshot(room),
    baselineReward: null,
    history: [],
  };
}

function getPolicy(room: Room): PolicyMemory {
  if (!Memory.policy) {
    Memory.policy = init(room);
  }
  return Memory.policy;
}

export function getTargetHarvesters(room: Room): number {
  const policy = getPolicy(room);
  const active = policy.candidateWeights ?? policy.weights;
  return Math.round(clampTargetHarvesters(active.targetHarvesters));
}

// Advance the policy's learning window. Call once per room per tick, before
// spawn logic reads the current weights.
export function tick(room: Room): void {
  const policy = getPolicy(room);
  const elapsed = Game.time - policy.windowStartTick;
  if (elapsed < WINDOW_LENGTH) {
    return;
  }

  const deaths = Memory.metrics.deathsThisWindow;
  const currentReward = metrics.reward(room, policy.windowStartSnapshot, deaths, DEATH_PENALTY);

  if (policy.candidateWeights) {
    const improved = policy.baselineReward === null || currentReward >= policy.baselineReward;
    if (improved) {
      policy.weights = policy.candidateWeights;
      console.log(
        `policy[${room.name}]: accepted ${JSON.stringify(policy.weights)} (reward ${currentReward.toFixed(1)})`,
      );
    } else {
      console.log(
        `policy[${room.name}]: reverted ${JSON.stringify(policy.candidateWeights)}, ` +
          `staying at ${JSON.stringify(policy.weights)} (reward ${currentReward.toFixed(1)} < ` +
          `${(policy.baselineReward ?? 0).toFixed(1)})`,
      );
    }
    policy.history.push({
      tick: Game.time,
      reward: currentReward,
      weights: policy.candidateWeights,
      accepted: improved,
    });
    if (policy.history.length > HISTORY_LIMIT) {
      policy.history.shift();
    }
  }

  policy.baselineReward = currentReward;
  policy.candidateWeights = {
    targetHarvesters: clampTargetHarvesters(policy.weights.targetHarvesters + randomStep()),
  };
  policy.windowStartTick = Game.time;
  policy.windowStartSnapshot = metrics.snapshot(room);
  Memory.metrics.deathsThisWindow = 0;
}
