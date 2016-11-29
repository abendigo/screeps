let lib = require('lib');

var role = {
    run: function(creep) {
        console.log(`${creep.memory.role}: ${creep.name} in ${creep.room.name}`);

        if (creep.fatigue || creep.spawning)
            return;

        if (creep.memory.source) {
console.log('1')
            let target = Game.getObjectById(creep.memory.source);
            console.log('target', target);
        } else if (creep.room.memory.sources) {
console.log('2')            
            let source = creep.pos.findClosestByRange(FIND_SOURCES, {
                filter: structure => {
                    return creep.room.memory.sources[structure.id] == 'available';
                }
            });

            if (source) {
console.log('3')                
                creep.room.memory.sources[source.id] = creep.name;
                creep.memory.source = source.id;
            } else {
                console.log(creep.name, 'HELP NO EMPTY SOURCES');
                creep.suicide();
            }
        }
    }
};

module.exports = role;
