let lib = require('lib');

var role = {
    preprocess: function(room, context) {
        if (!room.memory.transportPickup)
            room.memory.transportPickup = {
                next: 1, queue: {}
            };

        // console.log(`${room.name} taskQueue: ${JSON.stringify(room.memory.transportPickup)}`)

        let queued = {};
        for (let index in room.memory.transportPickup.queue) {
            let task = room.memory.transportPickup.queue[index];
            if (!queued[task.container])
                queued[task.container] = 0;
            queued[task.container] += task.amount;
        }
        
        let containers = room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_CONTAINER
        });

        for (let container of containers) {
            if (!queued[container.id]) {
                queued[container.id] = 0;
            }
            if ((queued[container.id] + 100) <= container.store[RESOURCE_ENERGY]) {
                room.memory.transportPickup.queue[room.memory.transportPickup.next++] = {
                    container: container.id, amount: 100, creep: 'available' 
                };
            }
        }

        // console.log(room.name, JSON.stringify(room.memory.transportPickup))

        // for (let container of containers) {
        //     console.log(`${container.id}: ${queued[container.id]} of ${container.store[RESOURCE_ENERGY]}`)
        // }
    },

    run: function(creep, options) {
        if (creep.fatigue || creep.spawning)
            return;

        if (!creep.memory.state)
            creep.memory.state = 'pickup'

        // console.log(`${creep.room.name}: ${creep.name}[${creep.memory.role}] - ${creep.memory.state}[${creep.memory.task}] ${creep.carry.energy}/${creep.carryCapacity}`);

	    if (creep.memory.state === 'deliver' && creep.carry.energy == 0) {
            creep.memory.state = 'pickup';
	    }
	    if (creep.memory.state !== 'deliver' && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.state = 'deliver';
	    }

        //lib.createRoadsAndQueueRepairs(creep);

        // Take CONTAINER energy and move it to EXTENSIONS or SPAWN

        if (creep.memory.state === 'deliver') {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });

            if (!target) { 
                target = creep.room.storage;
            }

            if (target) {
                if (creep.pos.isNearTo(target)) {
                    creep.transfer(target, RESOURCE_ENERGY);
                } else { 
                    creep.moveTo(target);
                }
            }
        } else {
            if (!creep.memory.task) {
                for (let index in creep.room.memory.transportPickup.queue) {
                    let task = creep.room.memory.transportPickup.queue[index];
                    console.log(`task ${index}: ${JSON.stringify(task)}`);
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
                let task = creep.room.memory.transportPickup.queue[creep.memory.task];
                if (!task) {
                    delete creep.memory.task;
                    return;
                }

                let target = Game.getObjectById(task.container);
                if (!target) {
                    console.log('PANIC! INVALID TARGET')
                    delete creep.room.memory.transportPickup.queue[creep.memory.task];
                    delete creep.memory.task;
                } else {
                    if (creep.pos.isNearTo(target)) {
                        let rc = creep.withdraw(target, RESOURCE_ENERGY, task.amount);
                        if (rc === ERR_FULL) {
                            creep.memory.state = 'deliver'
                        } else {
                            delete creep.room.memory.transportPickup.queue[creep.memory.task];
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
        }
    }
};

module.exports = role;
