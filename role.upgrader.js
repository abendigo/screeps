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


        lib.createRoadsAndQueueRepairs(creep);


        if (!creep.memory.upgrading) {
            let storage = (creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure => structure.structureType === STRUCTURE_STORAGE
            }));
            if (storage) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    rc = creep.moveTo(storage);
                }
            }
            else if (lib.refuel(creep) === ERR_NOT_ENOUGH_ENERGY) {
                if (creep.carry.energy > 0) {
                    creep.memory.upgrading = true;
                    creep.say('upgrading');
                } else {
                    lib.park(creep);
                }
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