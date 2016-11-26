//let lib = require('lib');

var role = {

    run: function(creep) {
        if (creep.fatigue || creep.spawning)
            return;

        if (creep.room.name === 'W63S24') {  // Home
            let exit = creep.pos.findClosestByRange(FIND_EXIT_TOP);
            creep.moveTo(exit);
        } else if (creep.room.name === 'W63S23') {  // Target
            console.log('arrived')
            let claim = Game.getObjectById('57ef9ccb86f108ae6e60cd6c')
//            let claim = creep.pos.findClosestByRange(STRUCTURE_CONTROLLER);
            console.log('claim', claim)
            if (claim) {
                if (creep.claim(claim) == ERR_NOT_IN_RANGE)
                    creep.moveTo(claim);
            }
        } else {
            console.log('WHERE AM I?')
            creep.suicide();
        }
    }
};

module.exports = role;
