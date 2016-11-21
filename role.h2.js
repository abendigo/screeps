var role = {

	spawn: function() {

	},

    /** @param {Creep} creep **/
    run: function(creep) {
    	console.log('h2', creep.name);

        var sources = creep.room.find(FIND_SOURCES);
        for (var i = 0; i < sources.length; i++) {
        	console.log('id:', sources[i].id);
        }
    }
};

module.exports = role;
