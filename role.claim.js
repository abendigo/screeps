//let lib = require('lib');

var role = {

    run: function(creep) {
        if (creep.fatigue || creep.spawning)
            return;

        if (creep.room.name === 'W63S24') {  // Home
            let exit = creep.pos.findClosestByRange(FIND_EXIT_TOP);
            creep.moveTo(exit);
        } else if (creep.room.name === 'W63S23') {  // Target
            
        } else {
            console.log('WHERE AM I?')
            creep.suicide();
        }
    }
};

module.exports = role;
