let lib = require('lib');

var role = {

    /** @param {Creep} creep **/
    run: function(creep, options) {
        console.log(`${creep.memory.role}: ${creep.name} in ${creep.room.name}`)
        if (creep.fatigue || creep.spawning)
            return;

//        console.log('sweeper', creep.name, 'energy', creep.room.energyAvailable, 'of', creep.room.energyCapacityAvailable)

	    if (creep.memory.deliver && creep.carry.energy == 0) {
            creep.memory.deliver = false;
            creep.say('sweeping');
	    }
	    if (!creep.memory.deliver && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.deliver = true;
	        creep.say('deliver');
	    }

        // lib.createRoadsAndQueueRepairs(creep);

        // Take EXTENSION energy and save it to STORAGE

        if (creep.memory.deliver) {
console.log('---', 1)            
            // let tower = Game.getObjectById('5833230ecbc9367a7f0c0afe');
            let tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
                }
            });
            if (tower && tower.energy < tower.energyCapacity) {
console.log('---', 2)            
                if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
console.log('---', 3)            
                    creep.moveTo(tower);
                }
            } else {
console.log('---', 4)            
                var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: structure => {
                        console.log('xx', structure.structureType)
                        return structure.sturctureType === STRUCTURE_STORAGE
                    }
                });
                if (storage) {
console.log('---', 5)            
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
console.log('---', 6)            
                        creep.moveTo(storage);
                    }
                }
            }
        } else {
console.log('---', 7)            

            if (creep.room.energyAvailable > 600) {
console.log('---', 8)            
                var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_EXTENSION && structure.energy > 0;
                    }
                });

                if (container) {
console.log('---', 9)            
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
console.log('---', 'a')            
                        creep.moveTo(container);
                    }
                } else {
console.log('---', 'b')            
//                    console.log('sweeper', creep.name, 'no extension');
                    creep.say('#$%^');
                }

            } else if (creep.carry.energy > 0) {
console.log('---', 'c')            
                creep.memory.deliver = true;
                creep.say('deliver');
            } else {
console.log('---', 'd')            
                lib.park(creep);
            }
        }
    }
};

module.exports = role;
