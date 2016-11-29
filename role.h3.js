let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.memory.role}: ${creep.name} in ${creep.room.name}`);

        if (creep.fatigue || creep.spawning)
            return;

        if (!creep.memory.source && creep.room.memory.sources) {
            let source = creep.pos.findClosestByRange(FIND_SOURCES, {
                filter: structure => {
                    return creep.room.memory.sources[structure.id] == 'available';
                }
            });

            if (source) {
                creep.room.memory.sources[source.id] = creep.name;
                creep.memory.source = source.id;
            } else {
                console.log(creep.name, 'HELP NO EMPTY SOURCES');
                creep.suicide();
            }
        }

        if (creep.memory.source) {
            let target = Game.getObjectById(creep.memory.source);
            console.log('target', target);
        }
    }
};

module.exports = role;
