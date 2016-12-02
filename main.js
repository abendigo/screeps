var roleRoom = require('role.room');
// var roleTower = require('role.tower');

 let roles = {
    'builder': require('role.builder'),
    'claim': require('role.claim'),
    // 'claimbuilder': require('role.claimbuilder'),
    // 'claimupgrader': require('role.claimupgrader'),
 	// 'h2': require('role.h2'),
 	'h3': require('role.h3'),
    'harvester': require('role.harvester'),
    'repair': require('role.repair'),
    'roadcrew': require('role.roadcrew'),
    'scout': require('role.scout'),
    // 'sweeper': require('role.storageTransport'),
    'litter': require('role.litter'),
    // 'sweeper2': require('role.litter'),
    'towertransport': require('role.towertransport'),
    'transport': require('role.transport'),
    // 'sweeper3': require('role.transport'),
    'upgrader': require('role.upgrader'),
    'wallcrew': require('role.wallcrew'),
    'miner': require('role.miner'),
    'marketTransport': require('role.marketTransport') ,
 };

module.exports.loop = function () {
    // Clean up memory of dead creeps
	for (var i in Memory.creeps) {
		if (!Game.creeps[i]) {
			delete Memory.creeps[i];
		}
	}

	for (let name in Game.rooms) {
        roleRoom.run(Game.rooms[name], roles);
    }

    for (let name in Game.creeps) {
        var creep = Game.creeps[name];

        if (roles[creep.memory.role]) {
            roles[creep.memory.role].run(creep);
        } else {
            console.log('no run for role:', creep.memory.role);
        }
    }
}
