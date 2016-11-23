var role = {

	spawn: function() {
        Game.spawns['home'].createCreep([WORK,WORK,MOVE,MOVE], {role: 'h2'});
	},

    run: function(creep) {
        if (creep.memory.container) {
            console.log('assigned to', creep.memory.container);
        } else if (creep.room.memory.containers) {
            console.log('need to pick one');

            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                           creep.room.memory.containers[structure.id] == 'available';
                }
            });

            console.log('xxxx', container)
            if (container) {
                creep.room.memory.containers[container.id] = creep.name;
                creep.memory.container = container.id;
            }
        }



        var target = Game.getObjectById('57ef9ccc86f108ae6e60cd6e');
        if (creep.harvest(target) != OK) {
            creep.moveTo(target);
        }
    }
};

module.exports = role;
