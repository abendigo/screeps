var role = {

    /** @param {Creep} creep **/
    run: function(creep, options) {
        if (creep.fatigue || creep.spawning)
            return;

        var litter = creep.room.find(FIND_DROPPED_ENERGY);

        console.log('sweeper', creep.name, 'energy', creep.room.energyAvailable, 'of', creep.room.energyCapacityAvailable)
        console.log('litter', litter.length);

	    if (creep.memory.deliver && creep.carry.energy == 0) {
            creep.memory.deliver = false;
            creep.say('sweeping');
	    }
	    if (!creep.memory.deliver && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.deliver = true;
	        creep.say('deliver');
	    }

        // Find dropped ENERGY and store it in EXTENSIONS or SPAWN

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

            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });

            if (target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            var litter = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            if (litter) {
                if (creep.pickup(litter) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(litter);
                }
            }
        }
    }
};

module.exports = role;
