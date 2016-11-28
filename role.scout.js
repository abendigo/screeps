let lib = require('lib');

var roleScout = {
    run: function(creep) {
    	console.log('scout', creep.name, creep.room.name);

        if (creep.fatigue || creep.spawning)
            return;

        if (creep.room.name === 'W63S24') {  // Home
            let exit = creep.pos.findClosestByRange(FIND_EXIT_RIGHT);
            creep.moveTo(exit);
        } else if (creep.room.name === 'W62S24') {
            let exit = creep.pos.findClosestByRange(FIND_EXIT_RIGHT);
            creep.moveTo(exit);
        } else if (creep.room.name === 'W61S24') { 
            if (creep.memory.work && creep.carry.energy == 0) {
                creep.memory.work = false;
                creep.say('harvesting');
            }
            if (!creep.memory.work && creep.carry.energy == creep.carryCapacity) {
                creep.memory.work = true;
                creep.say('working');
            }

            if (!creep.memory.work) {
                let source = creep.pos.findClosestByRange(FIND_SOURCES);
                let rc = creep.harvest(source);

                if (rc === OK) {
                    let here = creep.pos.look();
                    let foundStructure = false;
                    for (group of here) {
                        if (group.type === LOOK_CONSTRUCTION_SITES || group.type === LOOK_STRUCTURES) {
                            foundStructure = true;
                        }
                    }

                    if (!foundStructure) {
                        rc = creep.pos.createConstructionSite(STRUCTURE_CONTAINER);
                    }  
                } else if (rc === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                } 
            } else {
                let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (target) {
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target);                    
                    }
                } else {
                    let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.hits < structure.hitsMax && structure.hits > 0;
                        }
                    });
                    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target);                    
                    }
                }
            }

        // } else if (creep.room.name === 'W63S23') {  // Target
        //     let spawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
        //     if (spawn) {
        //         if (creep.attack(spawn) == ERR_NOT_IN_RANGE)
        //             creep.moveTo(spawn);
        //     } else {
        //         let enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        //         if (enemy) {
        //             if (creep.attack(enemy) == ERR_NOT_IN_RANGE)
        //                 creep.moveTo(enemy);
        //         } else {
        //             console.log('all gone');
        //             creep.suicide();
        //         }
        //     }
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
