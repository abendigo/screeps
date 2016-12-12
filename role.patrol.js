let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}/${creep.memory.secondary}[${creep.memory.state}] ${creep.memory.target} ttl: ${creep.ticksToLive} hits: ${creep.hits} of ${creep.hitsMax}`)

        if (creep.fatigue || creep.spawning)
            return;

        let target = 'W62S22';
        if (creep.room.name !== target) {
            creep.moveTo(new RoomPosition(25, 25, target));
        } else {
            let hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                // filter: (next) => {
                //     return next.getActiveBodyparts(ATTACK) || next.getActiveBodyparts(RANGED_ATTACK) || next.getActiveBodyparts(HEAL);
                // }   
            });
            if (hostile) {
                creep.moveTo(hostile);
                creep.attack(hostile);
            } else {
                creep.moveTo(new RoomPosition(25, 25, target));
            }
        }
    }
};

module.exports = role;
