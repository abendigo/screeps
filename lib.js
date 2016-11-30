let lib = {
    refuel: (creep) => {
        // console.log('refuel', creep.name, creep.memory.role)

        if (creep.room.energyCapacityAvailable < 550) {
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 50) ||
                        (structure.structureType == STRUCTURE_EXTENSION && structure.energy >= 50);
                }
            });
            if (container) {
                let rc = creep.withdraw(container, RESOURCE_ENERGY);
                if (rc === ERR_NOT_IN_RANGE) {
                    rc = rc = creep.moveTo(container);
                }

                return rc;
            }
        } else {
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 50) ||
                        (structure.structureType == STRUCTURE_EXTENSION && structure.energy >= 50) ||
                        (structure.structureType == STRUCTURE_SPAWN && structure.energy >= 50);
                }
            });

            if (container) {
                let rc = creep.withdraw(container, RESOURCE_ENERGY)
                if (rc === ERR_NOT_IN_RANGE) {
                    rc = creep.moveTo(container);
                }

                return rc;
            } else {
                return ERR_NOT_ENOUGH_ENERGY;
            }
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

    preprocessAssignments: (room, key, targets) => {
        console.log(`${room.name}: updateAssignments(${key})`)

        if (!room.memory[key]) {
            room.memory[key] = {};
        }

        let memory = room.memory[key];
        for (let next in memory) {
            let object = Game.getObjectById(next);
            console.log('object', next, object)
            // if (!source) {
            //     console.log('removing old source')
            //     delete room.memory.sources[source];
            // }
        }
        // for (let next in sources) {
        //     console.log('in', next)
        // }
        for (let target of targets) {
            console.log('target', target)
            if (!memory[target.id]) {
                memory[target.id] = 'available';
            } else {
                if (memory[target.id] !== 'available' && !Game.creeps[memory[target.id]]) {
                    memory[target.id] = 'available';
                }
            }
        }
        console.log(`memory: ${JSON.stringify(memory)}`)
    }
};

module.exports = lib;
