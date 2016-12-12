let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}/${creep.memory.secondary}[${creep.memory.state}] ${creep.memory.target} ttl: ${creep.ticksToLive} hits: ${creep.hits} of ${creep.hitsMax}`)

        if (creep.fatigue || creep.spawning)
            return;


        if (!creep.memory.state)
            creep.memory.state = 'pickup'

	    if (creep.memory.state === 'deliver' && creep.carry.energy == 0) {
            if (creep.ticksToLive < 300)
                creep.suicide();
            creep.memory.state = 'pickup';
	    }
	    if (creep.memory.state !== 'deliver' && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.state = 'deliver';
	    }

        let home = 'W62S23'
        let target = 'W63S24';
        if (creep.memory.state === 'deliver') {
            if (creep.room.name !== target) {
                creep.moveTo(new RoomPosition(10, 10, target));
            } else if (creep.pos.isNearTo(creep.room.storage)) {
                creep.transfer(creep.room.storage, RESOURCE_ENERGY);
            } else {
                creep.moveTo(creep.room.storage);
            }
        } else {
            if (creep.room.name !== home) {
                creep.moveTo(new RoomPosition(10, 10, home));
            } else {
                let storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 100)
                    }
                });

                if (creep.pos.isNearTo(storage)) {
                    creep.withdraw(storage, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(storage);
                }
            }
        }
    }
};

module.exports = role;
