var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, options) {

	    if (creep.memory.deliver && creep.carry.energy == 0) {
            creep.memory.deliver = false;
            creep.say('sweeping');
	    }
	    if (!creep.memory.deliver && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.deliver = true;
	        creep.say('deliver');
	    }

        if (creep.memory.deliver) {
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == 'container';
                }
            });

            console.log('====', container)

            if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        } else {
            var litter = creep.room.find(FIND_DROPPED_ENERGY);
            if (litter.length) {
                if (creep.pickup(litter[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(litter[0]);
                }
            } else {
                creep.say('no litter');
                creep.memery.deliver = true;
            }
        }
    }
};

module.exports = roleUpgrader;