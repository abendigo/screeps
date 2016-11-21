var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {
    	console.log('roleScout', creep.room.name);

    	// creep.moveTo(Game.flags.Flag2);

		var roomName = 'W63S23';
    	var sources = Game.rooms[roomName].find(FIND_SOURCES);
    	console.log('sources', sources.length);

        // var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }

	}
};

module.exports = roleScout;   
