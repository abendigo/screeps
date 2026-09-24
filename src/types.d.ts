// Augment the base Screeps types with our own memory shape.
// See: https://github.com/screeps/screeps/wiki/Typescript-support

declare global {
  interface CreepMemory {
    role: string;
    working?: boolean;
    // Last-seen Game.creeps[name].ticksToLive, refreshed every tick a creep
    // is alive. Read once the creep is gone to tell a natural end-of-lifespan
    // death (this was near 0) from an unexpected one (this was still high).
    lastKnownTtl?: number;
    // Miners only: the source this miner is permanently parked on.
    sourceId?: Id<Source>;
    // Haulers only: the structure/controller this hauler has claimed to
    // deliver to, so other haulers can treat its incoming energy as
    // already accounted for (see roles/hauler.ts).
    deliverTargetId?: Id<StructureSpawn | StructureExtension | StructureTower | StructureController>;
  }

  interface Memory {
    uuid: number;
    log: unknown;
    policy: PolicyMemory;
    metrics: MetricsMemory;
    status: StatusMemory;
    goal: GoalMemory;
    rclHistory: RclChange[];
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
    ticksToDowngrade: number | null;
  }

  // One entry per controller level change, kept so an out-of-band notice
  // (e.g. Screeps' "downgraded" email) can be checked against what the bot
  // actually saw - nothing else records this once Memory.status is
  // overwritten each tick.
  interface RclChange {
    tick: number;
    from: number;
    to: number;
    progress: number;
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
    // Haulers, not harvesters, as of the miner/hauler split - miners are
    // fixed at 1-per-source (like defenders/builders), so the only thing
    // left worth tuning is how many haulers keep up with them.
    targetHaulers: number;
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
    // Unexpected losses only (still had significant ticksToLive) - this is
    // what feeds the policy reward penalty, so routine aging-out doesn't
    // get mistaken for a bad harvester-count decision.
    deathsThisWindow: number;
    // Natural end-of-lifespan deaths - informational only, doesn't affect
    // policy reward.
    expiredThisWindow: number;
  }
}

export {};
