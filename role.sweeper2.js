var role = {

    /** @param {Creep} creep **/
    run: function(creep, options) {
        if (creep.fatigue || creep.spawning)
            return;

        var litter = creep.room.find(FIND_DROPPED_ENERGY);
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
            if (litter.length) {
                let target = litter[0];

                for (let i = 1; i < litter.length; i++) {
                    console.log(target.amount, '<', litter[i].amount);
                    if (target.amount < litter[i].amount) {
                        target = litter[i];
                    }
                }

                if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else if (creep.carry.energy > 0) {
                creep.memory.deliver = true;
                creep.say('deliver');
            } else {
                creep.say('park');
                creep.moveTo(Game.flags.parking);
            }
        }
    }
};

module.exports = role;
