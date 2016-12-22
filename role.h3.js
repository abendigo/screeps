let lib = require('lib');

var role = {
    run: function(creep, context) {
        // console.log(`${creep.name}[${creep.memory.role}]@${creep.room.name}:${JSON.stringify(creep.memory.source)} ttl ${creep.ticksToLive}:${creep.memory.arrivedAt}`);

        if (creep.fatigue || creep.spawning)
            return;

        if (!creep.memory.source && creep.room.memory.sources) {
            let sources = _.filter(creep.room.memory.sources, next => next.mode === 'h3');
            for (let source of sources) {
                // console.log('source', JSON.stringify(source))
                let owners = _.filter(context.creeps.h3, xy => {
                    // console.log('xy', JSON.stringify(xy.memory))
                    return xy.memory.source && xy.memory.source.id === source.id;
                })
                // console.log('owners', JSON.stringify(owners))

                if (!owners.length) {
                    creep.memory.source = source;
                    break;
                }
            }
        }

        if (creep.memory.source) {
            // console.log('=====', creep.memory.source)
            let container = Game.getObjectById(creep.memory.source.container);
            let source = Game.getObjectById(creep.memory.source.id);
            // console.log('container', container, 'source', source);
            if (creep.pos.isEqualTo(container)) {
                if (!creep.memory.arrivedAt)
                    creep.memory.arrivedAt = creep.ticksToLive;
                creep.harvest(source);
            } else {                
                creep.moveTo(container);
            }
        }
    }
};

module.exports = role;
