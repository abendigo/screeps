let lib = require('lib');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, options) {
        options = options || {};
        options.source = options.source || 0;

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


        // lib.createRoadsAndQueueRepairs(creep);


        if (!creep.memory.upgrading) {
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    if (structure.structureType === STRUCTURE_STORAGE)
                        console.log('type', structure.structureType, STRUCTURE_STORAGE, structure.store[RESOURCE_ENERGY])
                    return structure.structureType === STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] >= 50;
                }
            });
            if (!container) {
                container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 50
                    }
                });
            }
            if (!container && creep.room.energyAvailable > 700) {
                container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION && structure.energy >= 50) ||
                               (structure.structureType == STRUCTURE_SPAWN && structure.energy >= 50);
                    }
                });
            }

            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    rc = creep.moveTo(container);
                }
            } else {
                lib.park(creep);
            }
        }
        else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleUpgrader;