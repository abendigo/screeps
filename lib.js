let lib = {
    refuel: (creep) => {
        console.log('refuel', creep.name)
        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] >= 50) ||
                       (structure.structureType == STRUCTURE_EXTENSION && structure.energy >= 50) ||
                       (structure.structureType == STRUCTURE_SPAWN && structure.energy >= 50);
            }
        });

        if (container) {
            console.log('found', container.id, container.structureType)
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
        } else {
            console.log('not found. parking');
            creep.moveTo(Game.flags.parking);
        }
    }
};

module.exports = lib;