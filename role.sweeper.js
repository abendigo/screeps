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

        // Take EXTENSION energy and save it to TOWER or STORAGE

        if (creep.memory.deliver) {
            let tower = Game.getObjectById('5833230ecbc9367a7f0c0afe');
            if (tower.energy < tower.energyCapacity) {
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            } else {
                var storage = Game.getObjectById('5834d53ba28559d70a076e2c');
                if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
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

            } else if (creep.carry.energy > 0) {
                creep.memory.deliver = true;
                creep.say('deliver');
            }
        }
    }
};

module.exports = role;
