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



        let here = creep.pos.look();
        console.log('here', JSON.stringify(here))
        let foundStructure = false;
        for (group of here) {
            // for (type in group) {
            console.log('xxxxxx type', group.type)
            // }
            if (group.type === LOOK_CONSTRUCTION_SITES || group.type === LOOK_STRUCTURES)
                foundStructure = true;
        }
        console.log('foundStructure', foundStructure);
        if (!foundStructure) {
            room.pos.createConstructionSite(STRUCTURE_ROAD);
        }


        if (!creep.memory.upgrading) {
            if (lib.refuel(creep) === ERR_NOT_ENOUGH_ENERGY) {
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