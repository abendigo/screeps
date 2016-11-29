let lib = require('lib');

var role = {

    /** @param {Creep} creep **/
    run: function(creep, options) {
        console.log(`${creep.memory.role}: ${creep.name} in ${creep.room.name}`)
        if (creep.fatigue || creep.spawning)
            return;

//        console.log('sweeper', creep.name, 'energy', creep.room.energyAvailable, 'of', creep.room.energyCapacityAvailable)

	    if (creep.memory.deliver && creep.carry.energy == 0) {
            creep.memory.deliver = false;
            creep.say('sweeping');
	    }
	    if (!creep.memory.deliver && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.deliver = true;
	        creep.say('deliver');
	    }

        // lib.createRoadsAndQueueRepairs(creep);

        // Take EXTENSION energy and save it to STORAGE

        if (creep.memory.deliver) {
            let tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
                }
            });
            if (tower && tower.energy < tower.energyCapacity) {
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            } else {
                var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: structure => structure.structureType === STRUCTURE_STORAGE
                });
                if (storage) {
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                }
            }
        } else {
            if (creep.room.energyAvailable > 600) {
                var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_EXTENSION && structure.energy > 0;
                    }
                });

                if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                } else {
//                    console.log('sweeper', creep.name, 'no extension');
                    creep.say('#$%^');
                }

            } else if (creep.carry.energy > 0) {
                creep.memory.deliver = true;
                creep.say('deliver');
            } else {
                lib.park(creep);
            }
        }
    }
};

module.exports = role;
