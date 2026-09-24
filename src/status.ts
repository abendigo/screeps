// A cheap snapshot of live room state, written to Memory each tick so
// external tools (e.g. the dashboard in tools/dashboard) can read it without
// needing their own copy of game logic.
const RCL_HISTORY_LIMIT = 20;

function recordRclChange(room: Room): void {
  const level = room.controller?.level ?? 0;
  const previous = Memory.status?.rcl;
  if (previous === undefined || previous === level) {
    return;
  }
  Memory.rclHistory ??= [];
  Memory.rclHistory.push({
    tick: Game.time,
    from: previous,
    to: level,
    progress: room.controller?.progress ?? 0,
  });
  if (Memory.rclHistory.length > RCL_HISTORY_LIMIT) {
    Memory.rclHistory.shift();
  }
  console.log(`${room.name}: controller level ${previous} -> ${level}`);
}

export function update(room: Room): void {
  recordRclChange(room);

  const creepCounts: Record<string, number> = {};
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.room.name !== room.name) {
      continue;
    }
    creepCounts[creep.memory.role] = (creepCounts[creep.memory.role] ?? 0) + 1;
  }

  Memory.status = {
    tick: Game.time,
    roomName: room.name,
    rcl: room.controller?.level ?? 0,
    controllerProgress: room.controller?.progress ?? 0,
    controllerProgressTotal: room.controller?.progressTotal ?? 0,
    energyAvailable: room.energyAvailable,
    energyCapacityAvailable: room.energyCapacityAvailable,
    storedEnergy: room.storage?.store[RESOURCE_ENERGY] ?? 0,
    creepCounts,
    safeMode: room.controller?.safeMode ?? null,
    safeModeAvailable: room.controller?.safeModeAvailable ?? 0,
    ticksToDowngrade: room.controller?.ticksToDowngrade ?? null,
  };
}
