import * as harvester from "roles/harvester";
import * as policy from "policy";
import * as spawner from "spawner";
import * as status from "status";

function cleanupMemory(): void {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
      Memory.metrics.deathsThisWindow += 1;
    }
  }
}

export function loop(): void {
  Memory.metrics ??= { deathsThisWindow: 0 };
  cleanupMemory();

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if (room.controller && room.controller.my) {
      policy.tick(room);
      spawner.run(room);
      status.update(room);
    }
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    switch (creep.memory.role) {
      case "harvester":
        harvester.run(creep);
        break;
      default:
        console.log(`${name}: unknown role "${creep.memory.role}"`);
    }
  }
}
