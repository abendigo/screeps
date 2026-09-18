// Reward signal for the policy learner: how much productive work happened
// in a room over a window, penalized for creeps that died along the way.

function storedEnergy(room: Room): number {
  let total = room.energyAvailable;
  if (room.storage) {
    total += room.storage.store[RESOURCE_ENERGY];
  }
  return total;
}

export function snapshot(room: Room): RewardSnapshot {
  return {
    controllerProgress: room.controller?.progress ?? 0,
    storedEnergy: storedEnergy(room),
  };
}

export function reward(room: Room, start: RewardSnapshot, deaths: number, deathPenalty: number): number {
  const current = snapshot(room);
  const controllerGain = current.controllerProgress - start.controllerProgress;
  const energyGain = current.storedEnergy - start.storedEnergy;
  return controllerGain + energyGain - deaths * deathPenalty;
}
