let lib = require('lib');

var role = {
    run: function(creep) {
        // console.log('claimupgrader', creep.name, creep.room.name, creep.memory.upgrading)
    
        if (creep.fatigue || creep.spawning)
            return;

        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }
        let targetRoom = 'W62S23';

        if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(10, 10, targetRoom));
        } else {
            if (!creep.memory.upgrading) {
                // lib.refuel(creep);

                let source = creep.pos.findClosestByRange(FIND_SOURCES);
                if (creep.pos.isNearTo(source)) {
                    creep.harvest(source);
                } else {                    
                    creep.moveTo(source);
                }
            } else {
                if (creep.pos.isNearTo(creep.room.controller)) {
                    creep.upgradeController(creep.room.controller);
                } else {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};

module.exports = role;
