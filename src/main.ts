import * as harvester from "roles/harvester";
import * as spawner from "spawner";

function cleanupMemory(): void {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
}

export function loop(): void {
  cleanupMemory();

  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if (room.controller && room.controller.my) {
      spawner.run(room);
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
