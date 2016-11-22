var role = {

	spawn: function() {

	},

    /** @param {Creep} creep **/
    run: function(creep) {
        // console.log('h2', creep.name);

    //    var sources = creep.room.find(FIND_SOURCES);
    //    for (var i = 0; i < sources.length; i++) {
    //    	console.log('id:', sources[i].id);
    //    }

        var target = Game.getObjectById('57ef9ccc86f108ae6e60cd6e');
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};

module.exports = role;
