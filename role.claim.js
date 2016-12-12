//let lib = require('lib');
var role = {

    run: function(creep) {
        if (creep.fatigue || creep.spawning)
            return;

        let targetRoom = 'W62S23';

        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role} ${targetRoom} ticks: ${creep.ticksToLive}`)

        if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(10, 10, targetRoom));
        } else if (creep.pos.isNearTo(creep.room.controller)) {
            creep.claimController(creep.room.controller); 
        } else {
            creep.moveTo(creep.room.controller);
        }
    }
};

module.exports = role;
