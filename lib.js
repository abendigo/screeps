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
        console.log(`createRoadsAndQueueRepairs: ${creep.name} ${creep.memory.role}`)
        let here = creep.pos.look();
        let foundStructure = false;
        for (group of here) {
            if (group.type === LOOK_CONSTRUCTION_SITES || group.type === LOOK_STRUCTURES)
                foundStructure = true;
        }
        if (!foundStructure) {
            creep.pos.createConstructionSite(STRUCTURE_ROAD);
        }
    }
};

module.exports = lib;
