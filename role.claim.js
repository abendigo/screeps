//let lib = require('lib');
var role = {

    run: function(creep) {
        if (creep.fatigue || creep.spawning)
            return;

        creep.memory.target = 'W79S36';
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role} ${creep.memory.target} ticks: ${creep.ticksToLive}`)

        if (creep.room.name !== creep.memory.target) {
            creep.moveTo(new RoomPosition(29, 22, creep.memory.target));
        } else if (creep.pos.isNearTo(creep.room.controller)) {
            creep.claimController(creep.room.controller); 
        } else {
            creep.moveTo(creep.room.controller);
        }
    }
};

module.exports = role;
