var role = {

    /** @param {Creep} creep **/
    run: function(creep, options) {
        if (creep.fatigue || creep.spawning)
            return;

        console.log('sweeper', creep.name, 'energy', creep.room.energyAvailable, 'of', creep.room.energyCapacityAvailable)

	    if (creep.memory.deliver && creep.carry.energy == 0) {
            creep.memory.deliver = false;
            creep.say('sweeping');
	    }
	    if (!creep.memory.deliver && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.deliver = true;
	        creep.say('deliver');
	    }

        if (creep.memory.deliver) {
            var storage = Game.getObejctById('5834d53ba28559d70a076e2c');
            if (creep.transfer(strogae, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
            // var container = Game.getObjectById('58337fda4503a6a6427e41a2');

            // var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return structure.structureType == 'container';
            //     }
            // });

            // var targets = creep.room.find(FIND_STRUCTURES, {
            //         filter: (structure) => {
            //             return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
            //                 structure.energy < structure.energyCapacity;
            //         }
            // });
            // if (targets.length > 0) {
            //     if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(targets[0]);
            //     }
            // }



            // if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(container);
            // }
        } else {

            if (creep.room.energyAvailable > 800) {
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
                    console.log('sweeper', creep.name, 'no extension');
                    creep.say('#$%^');
                }

            }
/*


            var litter = creep.room.find(FIND_DROPPED_ENERGY);
            if (litter.length) {
                if (creep.pickup(litter[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(litter[0]);
                }
            } else {
                var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == 'container' && structure.store[RESOURCE_ENERGY] > 0;
                    }
                });
                // console.log(creep.name, 'container', container, 'energy', container.store[RESOURCE_ENERGY]);
                if (container && container.store[RESOURCE_ENERGY] > 0) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                } else {
                    creep.say('no litter');
                    creep.memory.deliver = true;
                }
            }
*/
        }
    }
};

module.exports = role;
