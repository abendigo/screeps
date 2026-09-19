/**
 * Defender: engages the closest hostile creep with ranged attacks,
 * falling back to melee if it has no RANGED_ATTACK parts. Idles near
 * the spawn when there's nothing to fight.
 */
export function run(creep: Creep): void {
  const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

  if (!hostile) {
    const spawn = creep.room.find(FIND_MY_SPAWNS)[0];
    if (spawn && !creep.pos.inRangeTo(spawn, 3)) {
      creep.moveTo(spawn, { visualizePathStyle: { stroke: "#ff0000" } });
    }
    return;
  }

  if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
    if (creep.rangedAttack(hostile) === ERR_NOT_IN_RANGE) {
      creep.moveTo(hostile, { visualizePathStyle: { stroke: "#ff0000" } });
    }
  } else if (creep.attack(hostile) === ERR_NOT_IN_RANGE) {
    creep.moveTo(hostile, { visualizePathStyle: { stroke: "#ff0000" } });
  }
}
