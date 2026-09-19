// Augment the base Screeps types with our own memory shape.
// See: https://github.com/screeps/screeps/wiki/Typescript-support

declare global {
  interface CreepMemory {
    role: string;
    working?: boolean;
  }

  interface Memory {
    uuid: number;
    log: unknown;
    policy: PolicyMemory;
    metrics: MetricsMemory;
    status: StatusMemory;
    goal: GoalMemory;
  }

  interface StatusMemory {
    tick: number;
    roomName: string;
    rcl: number;
    controllerProgress: number;
    controllerProgressTotal: number;
    energyAvailable: number;
    energyCapacityAvailable: number;
    storedEnergy: number;
    creepCounts: Record<string, number>;
    safeMode: number | null;
    safeModeAvailable: number;
  }

  type SubGoalStatus = "pending" | "active" | "done";

  interface SubGoal {
    id: string;
    summary: string;
    status: SubGoalStatus;
  }

  interface GoalMemory {
    summary: string;
    rationale: string;
    subGoals: SubGoal[];
  }

  interface RewardSnapshot {
    controllerProgress: number;
    storedEnergy: number;
  }

  interface PolicyWeights {
    targetHarvesters: number;
  }

  interface PolicyHistoryEntry {
    tick: number;
    reward: number;
    weights: PolicyWeights;
    accepted: boolean;
  }

  interface PolicyMemory {
    weights: PolicyWeights;
    candidateWeights: PolicyWeights | null;
    windowStartTick: number;
    windowStartSnapshot: RewardSnapshot;
    baselineReward: number | null;
    history: PolicyHistoryEntry[];
  }

  interface MetricsMemory {
    deathsThisWindow: number;
  }
}

export {};
