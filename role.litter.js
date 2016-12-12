let lib = require('lib');

var role = {
    preprocess: function(room) {
        if (!room.memory.litterPickup)
            room.memory.litterPickup = {
                next: 1, queue: {}
            };

        // console.log(`${room.name} taskQueue: ${JSON.stringify(room.memory.litterPickup)}`)

        let queued = {};
        for (let index in room.memory.litterPickup.queue) {
            let task = room.memory.litterPickup.queue[index];
            if (!queued[task.container])
                queued[task.container] = 0;
            queued[task.container] += task.amount;
        }
        
        let litter = room.find(FIND_DROPPED_ENERGY);

        for (let next of litter) {
            if (!queued[next.id]) {
                queued[next.id] = 0;
            }
            if ((queued[next.id] + 50) <= next.amount) {
                room.memory.litterPickup.queue[room.memory.litterPickup.next++] = {
                    container: next.id, amount: 50, creep: 'available' 
                };
            }
        }

        // console.log(room.name, JSON.stringify(room.memory.litterPickup))

        // for (let container of containers) {
        //     console.log(`${container.id}: ${queued[container.id]} of ${container.store[RESOURCE_ENERGY]}`)
        // }
    },

    run: function(creep, options) {
        if (creep.fatigue || creep.spawning)
            return;

        // console.log(`${creep.name}@${creep.room.name}:${creep.memory.role}[${creep.memory.state}] ${creep.memory.target}`)

        // var litter = creep.room.find(FIND_DROPPED_RESOURCES);

        let total = _.sum(creep.carry);
	    if (creep.memory.state === 'deliver' && total == 0) {
            creep.memory.state = 'pickup';
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
            if (!storage) {
                storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        // if (structure.structureType == STRUCTURE_CONTAINER)
                        //     console.log(creep.name, structure.store[RESOURCE_ENERGY], structure.storeCapacity)
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
                    }
                });
            }

            if (storage) {
                creep.moveTo(storage);
                for (let resource in creep.carry) {
                    let rc = creep.transfer(storage, resource) 
                }
            }
        } else {
            if (!creep.memory.task) {
                for (let index in creep.room.memory.litterPickup.queue) {
                    let task = creep.room.memory.litterPickup.queue[index];
                    // console.log(`task ${index}: ${JSON.stringify(task)}`);
                    if (task.creep === 'available') {
                        creep.memory.task = index;
                        task.creep = creep.name;
                        break;
                    } else if (!Game.creeps[task.creep]) {
                        task.creep = 'available'
                    }
                }
            }
            if (creep.memory.task) {
                let task = creep.room.memory.litterPickup.queue[creep.memory.task];
                if (!task) {
                    delete creep.memory.task;
                    return;
                }

                let target = Game.getObjectById(task.container);
                if (!target) {
                    console.log('PANIC! INVALID TARGET')
                    delete creep.room.memory.litterPickup.queue[creep.memory.task];
                    delete creep.memory.task;
                } else {
                    if (creep.pos.isNearTo(target)) {
//                        let rc = creep.withdraw(target, RESOURCE_ENERGY, task.amount);
                        let rc = creep.pickup(target);
                        if (rc === ERR_FULL) {
                            creep.memory.state = 'deliver'
                        } else {
                            delete creep.room.memory.litterPickup.queue[creep.memory.task];
                            delete creep.memory.task;
                        }
                    } else {
                        creep.moveTo(target);
                    }
                }
            } else if (creep.carry.energy > 0) {
                creep.memory.state = 'deliver';
            } else {
                lib.park(creep);
            }
/*            
            // let key = 'litter';
            // if (!creep.memory.target && creep.room.memory[key]) {
            let target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                filter: resource => resource.amount > 50
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
*/            
        }
    }
};

module.exports = role;
