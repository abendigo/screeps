var role = {

	spawn: function() {
        Game.spawns['home'].createCreep([WORK,WORK,MOVE,MOVE], {role: 'h2'});
	},

    run: function(creep) {
        if (creep.fatigue || creep.spawning)
            return;

        console.log(creep.name, 'pos', creep.pos.roomName, creep.pos.x, creep.pos.y);

        if (creep.memory.arrived) {
            console.log(creep.name, 'harvesting')
            let source;
            if (!creep.memory.source) {
                console.log(creep.name, 'get source')
                source = creep.pos.findClosestByRange(FIND_SOURCES);
                creep.memory.source = source.id;
            } else {
                console.log(creep.name, 'use source')
                source = Game.getObjectById(creep.memory.source);
            }

            creep.harvest(source);
        } else if (creep.memory.container) {
            let target = Game.getObjectById(creep.memory.container);

            if (creep.pos.x != target.pos.x && creep.pos.y != target.pos.y) {
                console.log(creep.name, 'moving...')
                creep.moveTo(target, {reusePath: 5});
            } else {
                console.log(creep.name, 'arrived')
                creep.memory.arrived = true;
            }
        } else if (creep.room.memory.containers) {
            console.log(creep.name, 'need to pick one');

            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                           creep.room.memory.containers[structure.id] == 'available';
                }
            });

            console.log(creep.name, 'xxxx', container)
            if (container) {
                creep.room.memory.containers[container.id] = creep.name;
                creep.memory.container = container.id;
            }
        } else {
            console.log(creep.name, 'HELP NOTHING TO DO')
        }



        // var target = Game.getObjectById('57ef9ccc86f108ae6e60cd6e');
        // if (creep.harvest(target) != OK) {
        //     let rc = creep.moveTo(target, {reusePath: 5});
        //     console.log('rc', rc)
        // }
    }
};

module.exports = role;
