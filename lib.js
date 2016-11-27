let lib = {
    refuel: (creep) => {
        console.log('refuel', creep.name, creep.memory.role)

        if (creep.room.energyCapacityAvailable < 550) {
            var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 50) ||
                        (structure.structureType == STRUCTURE_EXTENSION && structure.energy >= 50);
                }
            });
console.log('------------', container)            
            if (container) {
                let rc = creep.withdraw(container, RESOURCE_ENERGY);
console.log('======= rc', rc, container.structureType)                
                if (rc === ERR_NOT_IN_RANGE) {
                    rc = rc = creep.moveTo(container);
console.log('####### rc', rc)                
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
    }
};

module.exports = lib;
