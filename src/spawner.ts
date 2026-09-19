import * as policy from "policy";

const BODY_HARVESTER: BodyPartConstant[] = [WORK, CARRY, MOVE];
const BODY_DEFENDER: BodyPartConstant[] = [RANGED_ATTACK, MOVE];
const BODY_BUILDER: BodyPartConstant[] = [WORK, CARRY, MOVE];

// Fixed, not tuned by policy - defense shouldn't be something the reward
// loop can optimize away just because it doesn't pay off within a window.
const TARGET_DEFENDERS = 1;

// Also fixed for now rather than policy-tuned - only spawn a builder while
// there's actually something queued to build, so it doesn't sit idle-ish
// (falling back to upgrading) when the planner has nothing for it.
const TARGET_BUILDERS = 1;

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

  if (room.find(FIND_CONSTRUCTION_SITES).length > 0) {
    const builders = Object.values(Game.creeps).filter(
      (creep) => creep.memory.role === "builder" && creep.room.name === room.name,
    );
    if (builders.length < TARGET_BUILDERS) {
      const name = `builder_${Game.time}`;
      if (spawn.spawnCreep(BODY_BUILDER, name, { memory: { role: "builder", working: false } }) === OK) {
        console.log(`${room.name}: spawning ${name}`);
      }
    }
  }
}
