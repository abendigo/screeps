const BODY_HARVESTER: BodyPartConstant[] = [WORK, CARRY, MOVE];
const MIN_HARVESTERS_PER_ROOM = 3;

export function run(room: Room): void {
  const spawn = room.find(FIND_MY_SPAWNS)[0];
  if (!spawn || spawn.spawning) {
    return;
  }

  const harvesters = Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === "harvester" && creep.room.name === room.name,
  );

  if (harvesters.length < MIN_HARVESTERS_PER_ROOM) {
    const name = `harvester_${Game.time}`;
    const result = spawn.spawnCreep(BODY_HARVESTER, name, {
      memory: { role: "harvester", working: false },
    });

    if (result === OK) {
      console.log(`${room.name}: spawning ${name}`);
    }
  }
}
