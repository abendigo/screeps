var roomHandler = require('role.room');

const roles = ['claim', 'claimbuilder', 'claimupgrader',
               'harvester', 'h3',
               'transport',
               'soldier',
               'upgrader', 'builder', 'repair', 'towertransport',
               'roadcrew', 'wallcrew'];
let modules = {};
for (let role of roles) {
    modules[role] = require(`role.${role}`);
}


module.exports.loop = function () {
    // let spawn = Game.spawns['home']
    // console.log(`home: ${spawn.hits} of ${spawn.hitsMax} in ${spawn.room.name}`)
    // if (spawn.hits < spawn.hitsMax) {
    //     if (!spawn.room.controller.safeMode)
    //         spawn.room.controller.activateSafeMode();
    // }

    // Clean up memory of dead creeps
	for (var i in Memory.creeps) {
		if (!Game.creeps[i]) {
			delete Memory.creeps[i];
		}
	}
	for (var i in Memory.rooms) {
		if (!Game.rooms[i]) {
			delete Memory.rooms[i];
		}
	}



	for (let name in Game.rooms) {
        roomHandler.run(Game.rooms[name], modules);
    }
}
