var roleRepair = {

	/** @param {Creep} creep **/
    run: function(creep, options) {
		// console.log('roleRepair', creep.name, creep.memory.target);

        options = options || {};
        options.source = options.source || 1;

    	if (creep.fatigue)
    		return;

	    if(creep.memory.repair && creep.carry.energy == 0) {
            creep.memory.repair = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.repair && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repair = true;
	        creep.say('repair');
	    }


	    if(creep.memory.repair) {
			if (creep.memory.target) {
				var target = Game.getObjectById(creep.memory.target);
				// console.log(creep.name, 'hits', target.hits, 'of', target.hitsMax)
				if (target == null) {
					// console.log('target not found')
					creep.memory.target = false;
				} else if (target.hits < target.hitsMax) {
					if(creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target);
					}
				} else {
					// console.log('already fixed')
					creep.memory.target = false;
				}
			} else {
				var targets = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return structure.structureType != STRUCTURE_ROAD &&
						       structure.structureType != STRUCTURE_WALL &&
                               structure.hits < structure.hitsMax &&
                               structure.hits > 0;
					}
				});
            	if (targets.length) {
					var index = parseInt(Math.random() * targets.length);
					creep.say(index + ':' + targets.length)
					creep.memory.target = targets[index].id;
				}
            }
	    }
	    else {

            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 50) ||
                           (structure.structureType == STRUCTURE_EXTENSION && structure.energy >= 50) ||
                           (structure.structureType == STRUCTURE_SPAWN && structure.energy >= 50);
                }
            });

            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
            } else {
                creep.moveTo(Game.flags.parking);
            }
	    }
	}
};

module.exports = roleRepair;