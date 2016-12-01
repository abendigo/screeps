let lib = {
    refuel: (creep) => {
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
            source = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure => (structure.structureType == STRUCTURE_EXTENSION && structure.energy >= 50) ||
                                     (structure.structureType == STRUCTURE_SPAWN && structure.energy >= 50)
            });
        }

        if (source) {
            let rc = creep.withdraw(container, RESOURCE_ENERGY);
            if (rc === ERR_NOT_IN_RANGE) {
                rc = rc = creep.moveTo(container);
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
    }
};

module.exports = lib;
