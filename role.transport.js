let lib = require('lib');

var role = {

    /** @param {Creep} creep **/
    run: function(creep, options) {
        if (creep.fatigue || creep.spawning)
            return;

	    if (creep.memory.deliver && creep.carry.energy == 0) {
            creep.memory.deliver = false;
            creep.say('sweeping');
	    }
	    if (!creep.memory.deliver && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.deliver = true;
	        creep.say('deliver');
	    }

        lib.createRoadsAndQueueRepairs(creep);

        // Take CONTAINER energy and move it to EXTENSIONS or SPAWN

        if (creep.memory.deliver) {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
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
                    let storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: structure => structure.structureType === STRUCTURE_STORAGE
                    });
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                }
            }
        } else {
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == 'container' && structure.store[RESOURCE_ENERGY] >= 50;
                }
            });

            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
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
