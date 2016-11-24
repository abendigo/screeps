let lib = require('lib');

var role = {

	spawn: function() {
        Game.spawns['home'].createCreep([WORK,WORK,MOVE,MOVE], {role: 'h2'});
	},

    run: function(creep) {
        if (creep.fatigue || creep.spawning)
            return;

        if (creep.memory.arrived) {
            let source;
            if (!creep.memory.source) {
                source = creep.pos.findClosestByRange(FIND_SOURCES);
                creep.memory.source = source.id;
            } else {
                source = Game.getObjectById(creep.memory.source);
            }

            creep.harvest(source);
        } else if (creep.memory.container) {
            let target = Game.getObjectById(creep.memory.container);

            if (!(creep.pos.x == target.pos.x && creep.pos.y == target.pos.y)) {
                creep.moveTo(target);
            } else {
                creep.memory.arrived = true;
            }
        } else if (creep.room.memory.containers) {
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                           creep.room.memory.containers[structure.id] == 'available';
                }
            });

            if (container) {
                creep.room.memory.containers[container.id] = creep.name;
                creep.memory.container = container.id;
            } else {
                console.log(creep.name, 'HELP NO EMPTY CONTIANERS');
            }
        } else {
            console.log(creep.name, 'HELP NOTHING TO DO')
        }
    }
};

module.exports = role;
