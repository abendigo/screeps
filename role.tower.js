var role = {

    /** @param {Creep} creep **/
    run: function(tower) {
        console.log('tower', tower.energy)

        let hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) {
            tower.attack(hostile);
        } else {
            tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_RAMPART &&
                           structure.hits < structure.hitsMax &&
                           structure.hits > 0;
                }
            });
            if (tower) {
                if (creep.repair(tower) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower);
                }
            }
        }
    }
};

module.exports = role;