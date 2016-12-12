let lib = require('lib');

var role = {
    run: function(creep) {
    	console.log(`${creep.name}@${creep.room.name}`);

        if (creep.fatigue || creep.spawning)
            return;

        let target = 'W64S21'

        // if (creep.room.name !== target) {  // Home
            creep.moveTo(new RoomPosition(10, 10, target));
    }
};

module.exports = role;
