import * as policy from "policy";

const BODY_HARVESTER: BodyPartConstant[] = [WORK, CARRY, MOVE];
const BODY_DEFENDER: BodyPartConstant[] = [RANGED_ATTACK, MOVE];

// Fixed, not tuned by policy - defense shouldn't be something the reward
// loop can optimize away just because it doesn't pay off within a window.
const TARGET_DEFENDERS = 1;

export function run(room: Room): void {
  const spawn = room.find(FIND_MY_SPAWNS)[0];
  if (!spawn || spawn.spawning) {
    return;
  }

  const defenders = Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === "defender" && creep.room.name === room.name,
  );

  if (defenders.length < TARGET_DEFENDERS) {
    const name = `defender_${Game.time}`;
    if (spawn.spawnCreep(BODY_DEFENDER, name, { memory: { role: "defender" } }) === OK) {
      console.log(`${room.name}: spawning ${name}`);
    }
  }

  const harvesters = Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === "harvester" && creep.room.name === room.name,
  );

  if (harvesters.length < policy.getTargetHarvesters(room)) {
    const name = `harvester_${Game.time}`;
    const result = spawn.spawnCreep(BODY_HARVESTER, name, {
      memory: { role: "harvester", working: false },
    });

    if (result === OK) {
      console.log(`${room.name}: spawning ${name}`);
    }
  }
}
