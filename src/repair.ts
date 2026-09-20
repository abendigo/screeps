// Shared between tower.ts and roles/builder.ts - both repair opportunistically
// when they have nothing higher-priority to do, so containers/roads don't
// quietly decay to destruction with no tower yet (RCL3+) to keep them up.
export function findRepairTarget(room: Room): Structure | null {
  const damaged = room.find(FIND_STRUCTURES, {
    filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART,
  });
  if (damaged.length === 0) {
    return null;
  }
  return damaged.reduce((worst, s) => (s.hits / s.hitsMax < worst.hits / worst.hitsMax ? s : worst));
}
