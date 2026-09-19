// A cheap snapshot of live room state, written to Memory each tick so
// external tools (e.g. the dashboard in tools/dashboard) can read it without
// needing their own copy of game logic.
export function update(room: Room): void {
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
  };
}
