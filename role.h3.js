let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.memory.role}: ${creep.name} in ${creep.room.name}`);
        
        if (creep.fatigue || creep.spawning)
            return;
    }
};

module.exports = role;
