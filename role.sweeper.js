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
            // var container = Game.getObjectById('58337fda4503a6a6427e41a2');

            // var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return structure.structureType == 'container';
            //     }
            // });

            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }



            // if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(container);
            // }
        } else {
            var litter = creep.room.find(FIND_DROPPED_ENERGY);
            if (litter.length) {
                if (creep.pickup(litter[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(litter[0]);
                }
            } else {
                creep.say('no litter');
                creep.memory.deliver = true;
            }
        }
    }
};

module.exports = roleUpgrader;