let lib = require('lib');

var role = {
    preprocess: function(room) {
/*
        let litter = room.find(FIND_DROPPED_RESOURCES);
//        lib.cleanupAssignments(room, 'litter', litter);
        let key = 'litter';
        let targets = litter;

        if (!room.memory[key]) {
            room.memory[key] = {};
        }

        let memory = room.memory[key];
        for (let next in memory) {
            let object = Game.getObjectById(next);
            if (!object) {
                delete memory[next];
            }
        }
        for (let target of targets) {
            // console.log('target', target, target.energy)
            // let count = target.energy / 400;
            // console.log('count', count, target.energy);
            if (!memory[target.id]) {
                memory[target.id] = 'available';
            } else {
                if (memory[target.id] !== 'available' && !Game.creeps[memory[target.id]]) {
                    memory[target.id] = 'available';
                }
            }
        }
*/            
    },

    run: function(creep, options) {
        if (creep.fatigue || creep.spawning)
            return;

        // console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target}`)

        // var litter = creep.room.find(FIND_DROPPED_RESOURCES);

        let total = _.sum(creep.carry);
	    if (creep.memory.state === 'deliver' && total == 0) {
            creep.memory.state = 'sweep';
	    }
	    if (creep.memory.state !== 'deliver' && total == creep.carryCapacity) {
	        creep.memory.state = 'deliver';
	    }

        // Find dropped ENERGY and store it in EXTENSIONS or SPAWN
        if (creep.memory.state === 'deliver') {
            let storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) || 
                           (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity);
                }
            });
            // var storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            //     filter: structure => structure.structureType === STRUCTURE_STORAGE
            // });
            if (!storage) {
                storage = creep.room.storage;
            }

            if (storage) {
                creep.moveTo(storage);
                for (let resource in creep.carry) {
                    let rc = creep.transfer(storage, resource) 
                }
            }
        } else {
            // let key = 'litter';
            // if (!creep.memory.target && creep.room.memory[key]) {
            let target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                // filter: structure => {
                //     return creep.room.memory[key][structure.id] === 'available';
                // }
            });

                // if (target) {
                //     creep.room.memory[key][target.id] = creep.name;
                //     creep.memory.target = target.id;
                // }
            // }

            if (target) {
            // if (creep.memory.target) {
            //     let object = Game.getObjectById(creep.memory.target);
                // if (object) {
                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                // } else {
                //     creep.memory.target = false;
                // }
            } else if (total > 0) {
                creep.memory.state = 'deliver';
            } else {
                lib.park(creep);
            }
        }
    }
};

module.exports = role;
