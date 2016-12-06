let lib = require('lib');

var role = {

    /** @param {Creep} creep **/
    run: function(tower) {
        // console.log('tower', tower.energy)

        let hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            // filter: (next) => {
            //     return next.getActiveBodyparts(ATTACK) || next.getActiveBodyParts(RANGED_ATTACK) || next.getActiveBodyparts(HEAL);
            // }   
        });
        if (hostile) {
            tower.attack(hostile);
        } else if (tower.energy > 300) {
            let creep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (next) => {
                    return next.hits < next.hitsMax;
                }
            });

            if (creep) {
                target.heal(creep);
            } else {
                let target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART &&
                                structure.hits < Math.min(20000, structure.hitsMax) &&
                                structure.hits > 0) ||
                               (structure.structureType == STRUCTURE_CONTAINER &&
                                structure.hits < structure.hitsMax &&
                                structure.hits > 0) ||
                               (structure.structureType == STRUCTURE_STORAGE &&
                                structure.hits < structure.hitsMax &&
                                structure.hits > 0);
                    }
                });
                if (target) {
                    tower.repair(target);
                }
            }
        }
    }
};

module.exports = role;
