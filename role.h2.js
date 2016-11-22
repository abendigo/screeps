var role = {

	spawn: function() {
        Game.spawns['home'].createCreep([WORK,WORK,MOVE,MOVE], {role: 'h2'});
	},

    run: function(creep) {
        var target = Game.getObjectById('57ef9ccc86f108ae6e60cd6e');
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};

module.exports = role;
