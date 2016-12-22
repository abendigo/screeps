

class PriorityQueue {
    constructor() {
        console.log('PriorityQueue')
    }
}



// > queue = {}
// > push(queue, 9, 'new')
// > queue
// {9: ["new"]}
//
// > queue = {9: ['nine'], 1: ['one.a', 'one.b']}
// > push(queue, 9, 'new')
// > queue
// {9: ['nine', 'new'], 1: ['one.a', 'one.b']}
function push(queue, priority, object) {
    if (!queue[priority])
        queue[priority] = [];
    queue[priority].push(object);
}


// > queue = {}
// > _nextAvailableKey(queue)
// undefined
//
// > queue = {9: ['nine'], 1: ['one.a', 'one.b']}
// > _nextAvailableKey(queue)
// "1"
function _nextAvailableKey(queue) {
    let key = undefined;
    let keys = Object.keys(queue);
    if (keys) {
        let sorted = Object.keys(queue).sort((a, b) => a - b);
        key = sorted[0];
    }

    return key;
}

// > queue = {}
// > peek(queue)
// undefined
//
// > queue = {9: ['nine'], 1: ['one.a', 'one.b']}
// > peek(queue)
// "one.a"
function peek(queue) {
    let object = undefined;
    let key = _nextAvailableKey(queue);

    if (key && queue[key]) {
        object = queue[key][0]
    }

    return object;
}

// > queue = {}
// > pop(queue)
// undefined
//
// > queue = {9: ['nine'], 1: ['one.a', 'one.b']}
// > pop(queue)
// "one.a"
// > queue
// {9: ['nine'], 1: ['one.b']}
function pop(queue) {
    let object = undefined;
    let key = _nextAvailableKey(queue);

    if (key && queue[key]) {
        object = queue[key].shift();
        if (queue[key].length === 0)
            delete queue[key];
    }

    return object;
}



let lib = {
    refuel: (creep) => {
        let source;
        
        if (creep.room.energyCapacityAvailable <= 850) {
            let target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, {
                filter: resource => resource.amount > 50
            });
            if (target) {
                if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }

                return OK;
            } else {
                let spawning = lib.peek(creep.room.memory.spawnPriorityQueue)
                source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: structure =>
                        (structure.structureType == STRUCTURE_CONTAINER && !spawning && structure.store[RESOURCE_ENERGY] >= 50) ||
                        (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] >= 50) || 
                        (structure.structureType == STRUCTURE_EXTENSION && !spawning && structure.energy >= 50) ||
                        (structure.structureType == STRUCTURE_SPAWN && !spawning && structure.energy >= 50)
                });
            }
        } else {
            // If there is a STORAGE or CONTIANER in this room:
            //    find closest STORAGE or CONTAINER with avialable ENERGY
            // Else 
            //    find the closest SPAWN or EXTENSION

            let structures = creep.room.find(FIND_STRUCTURES, {
                filter: structure => structure.structureType == STRUCTURE_CONTAINER ||
                                    structure.structureType == STRUCTURE_STORAGE
            });

            if (structures.length) {
                source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: structure => (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 50) ||
                                        (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] >= 50)
                });
            } else {
                // source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                //     filter: structure => (structure.structureType == STRUCTURE_EXTENSION && structure.energy >= 50) ||
                //                         (structure.structureType == STRUCTURE_SPAWN && structure.energy >= 50)
                // });
            }
        }

        if (source) {
            let rc = creep.withdraw(source, RESOURCE_ENERGY);
            if (rc === ERR_NOT_IN_RANGE) {
                rc = rc = creep.moveTo(source);
            }

            return rc;
        } else {
            return ERR_NOT_ENOUGH_ENERGY;
        }
    }, 

    park: (creep) => {
        let flag = creep.pos.findClosestByRange(FIND_FLAGS, {
            filter: structure => {
                return structure.name.startsWith('parking');
            }
        });
        return creep.moveTo(flag);
    },

    createRoadsAndQueueRepairs: (creep) => {
        // console.log(`createRoadsAndQueueRepairs: ${creep.name} ${creep.memory.role}`)
        // let here = creep.pos.look();
        // let foundStructure = false;
        // for (group of here) {
        //     if (group.type === LOOK_CONSTRUCTION_SITES || group.type === LOOK_STRUCTURES) {
        //         foundStructure = true;
        //     }
        // }

        // if (!foundStructure) {
        //     rc = creep.pos.createConstructionSite(STRUCTURE_ROAD);
        // }
    },

    cleanupAssignments: (room, key, targets) => {
        // console.log(`${room.name}: cleanupAssignments(${key})`)

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
            if (!memory[target.id]) {
                memory[target.id] = 'available';
            } else {
                if (memory[target.id] !== 'available' && !Game.creeps[memory[target.id]]) {
                    memory[target.id] = 'available';
                }
            }
        }
    },

    _foo: (room, key, resources, method) => {
        // console.log('_foo', room.name, key)
        if (!room.memory[key])
            room.memory[key] = {
                next: 1, queue: {}
            };

        // if (room.name === 'W62S23')
        //     console.log(`${room.name} ${key}: ${JSON.stringify(room.memory[key])}`)

        let queued = {};
        for (let index in room.memory[key].queue) {
            let task = room.memory[key].queue[index];
            if (!queued[task.target])
                queued[task.target] = 0;
            queued[task.target] += task.amount;
        }

        // if (room.name === 'W62S23')
        //     console.log(`${room.name} ${key} queued: ${JSON.stringify(queued)}`)
        
        for (let next of resources) {
            if (!queued[next.id]) {
                queued[next.id] = 0;
            }
            if ((queued[next.id] + 50) <= method(next)) {
                room.memory[key].queue[room.memory[key].next++] = {
                    target: next.id, amount: 50, creep: 'available' 
                };
            }
        }
    },

    preprocessLitterQueue: room => {
        let resources = room.find(FIND_DROPPED_ENERGY);
        let method = function(resource) {return resource.amount;};
        lib._foo(room, '__litterPickup', resources, method);
    },
    preprocessTransportQueue: room => {
        let resources = room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_CONTAINER
        });
        let method = function(resource) {return resource.store[RESOURCE_ENERGY];}
        lib._foo(room, '__transportPickup', resources, method);
    },


    push: push,
    peek: peek,
    pop: pop
    
};

module.exports = lib;
