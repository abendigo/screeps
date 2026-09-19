import * as policy from "policy";

const BODY_MINER: BodyPartConstant[] = [WORK, WORK, MOVE];
const BODY_HAULER: BodyPartConstant[] = [CARRY, CARRY, MOVE];
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

  // Miners: fixed at 1 per source (like defenders/builders, not policy-tuned)
  // - there's an obvious right answer (one stationary miner per source), no
  // need for the reward loop to learn it.
  const miners = Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === "miner" && creep.room.name === room.name,
  );
  const claimedSourceIds = new Set(miners.map((creep) => creep.memory.sourceId));
  const unclaimedSource = room.find(FIND_SOURCES).find((source) => !claimedSourceIds.has(source.id));

  if (unclaimedSource) {
    const name = `miner_${Game.time}`;
    if (
      spawn.spawnCreep(BODY_MINER, name, { memory: { role: "miner", sourceId: unclaimedSource.id } }) === OK
    ) {
      console.log(`${room.name}: spawning ${name} for source ${unclaimedSource.id}`);
    }
  }

  // Haulers only spawn once every source has a miner - they're cheaper
  // than a miner (150 vs 250 energy), so without this a young colony's
  // fluctuating energy can let haulers keep winning the affordability race
  // and starve a source's miner out indefinitely, leaving haulers with
  // nothing to actually haul.
  const haulers = Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === "hauler" && creep.room.name === room.name,
  );

  if (!unclaimedSource && haulers.length < policy.getTargetHaulers(room)) {
    const name = `hauler_${Game.time}`;
    const result = spawn.spawnCreep(BODY_HAULER, name, {
      memory: { role: "hauler", working: false },
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
