let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.memory.role}: ${creep.name} in ${creep.room.name}`);

        if (creep.fatigue || creep.spawning)
            return;

        if (creep.memory.source) {
            let target = Game.getObjectById(creep.memory.source);
            console.log('target', target);
        } else if (creep.room.memory.sources) {
            let source = creep.pos.findClosestByRange(FIND_SOURCES, {
                filter: structure => {
                    return creep.room.memory.sources[structure.id] == 'available';
                }
            });
            console.log('source', source);
        }
    }
};

module.exports = role;
