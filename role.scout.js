let lib = require('lib');

var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {
    	console.log('roleScout', creep.name, creep.room.name);

        if (creep.fatigue || creep.spawning)
            return;

        if (creep.room.name === 'W63S24') {  // Home
            let exit = creep.pos.findClosestByRange(FIND_EXIT_TOP);
            creep.moveTo(exit);
        } else if (creep.room.name === 'W63S23') {  // Target
            let spawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
            if (creep.attack(spawn) == ERR_NOT_IN_RANGE)
                creep.moveTo(spawn);
        } else {
            console.log('WHERE AM I?')
            creep.suicide();
        }
    }
/*
        if(creep.memory.deliver && creep.carry.energy == 0) {
            creep.memory.deliver = false;
            creep.say('harvesting');
        }
        if(!creep.memory.deliver && creep.carry.energy == creep.carryCapacity) {
            creep.memory.deliver = true;
            creep.say('delivering');
        }

        if (creep.memory.deliver) {
        	var x = 'W63S24';

       //  	if (creep.room.name != 'x') {
		    	// creep.moveTo(Game.flags.Flag2);
       //  	} else {

	            var targets = Game.rooms[x].find(FIND_STRUCTURES, {
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
	        // }
        } else {

			var roomName = 'W63S23';

	    	if (creep.room.name != 'roomName') {
		    	creep.moveTo(Game.flags.Flag2);
		    } else {
		    	var sources = Game.rooms[roomName].find(FIND_SOURCES);
		    	// console.log('sources', sources.length);

		        // var sources = creep.room.find(FIND_SOURCES);
		        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
		            creep.moveTo(sources[0]);
		        }
		    }
		}
	}
*/
};

module.exports = roleScout;
