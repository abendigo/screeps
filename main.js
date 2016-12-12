var roleRoom = require('role.room');
// var roleTower = require('role.tower');

 let roles = {
    'builder': require('role.builder'),
    // 'sourceKeeperKiller': require('role.sourceKeeperKiller'),
    // 'claim': require('role.claim'),
    // 'c2': require('role.c2'),
    // 'probe': require('role.probe'),
    // 'soldier': require('role.soldier'),
    // 'superTanker': require('role.superTanker'),
    // 'claimbuilder': require('role.claimbuilder'),
    // 'claimBuilder': require('role.claimbuilder'),
    // 'claimupgrader': require('role.claimupgrader'),
 	// 'h2': require('role.h2'),
 	// 'h3': require('role.h3'),
    'harvester': require('role.harvester'),
    // 'remoteHarvest': require('role.remoteHarvest'),
    // 'remoteHarvester': require('role.remoteHarvest'),
    // 'remoteharvester': require('role.remoteHarvest'),
    // 'repair': require('role.repair'),
    'roadcrew': require('role.roadcrew'),
    // 'scout': require('role.scout'),
    // 'patrol': require('role.patrol'),
    // 'sweeper': require('role.storageTransport'),
    // 'litter': require('role.litter'),
    // 'sweeper2': require('role.litter'),
    // 'towertransport': require('role.towertransport'),
    // 'transport': require('role.transport'),
    // 'sweeper3': require('role.transport'),
    'upgrader': require('role.upgrader'),
    'wallcrew': require('role.wallcrew'),
    // 'miner': require('role.miner'),
    // 'marketTransport': require('role.marketTransport')
 };

module.exports.loop = function () {
    // Clean up memory of dead creeps
    // let spawn = Game.spawns['home']
    // console.log(`home: ${spawn.hits} of ${spawn.hitsMax} in ${spawn.room.name}`)
    // if (spawn.hits < spawn.hitsMax) {
    //     if (!spawn.room.controller.safeMode)
    //         spawn.room.controller.activateSafeMode();
    // }
    // spawn = Game.spawns['Spawn1']
    // console.log(`Spawn1: ${spawn.hits} of ${spawn.hitsMax} in ${spawn.room.name}`)
    // if (spawn.hits < spawn.hitsMax) {
    //     if (!spawn.room.controller.safeMode)
    //         spawn.room.controller.activateSafeMode();
    // }
    // spawn = Game.spawns['Spawn2']
    // console.log(`Spawn2: ${spawn.hits} of ${spawn.hitsMax} in ${spawn.room.name}`)
    // if (spawn.hits < spawn.hitsMax) {
    //     if (!spawn.room.controller.safeMode)
    //         spawn.room.controller.activateSafeMode();
    // }

	for (var i in Memory.creeps) {
		if (!Game.creeps[i]) {
			delete Memory.creeps[i];
		}
	}

    // Memory.spawnQueue = [];

    // let spawning = {};
    // let soutput = `Global SpawnQueue: `;
    // for (var role in roles) {
    //     spawning[role] = _.filter(Memory.spawnQueue, (creep) => creep.memory.role == role);
    //     if (spawning[role].length)
    //         soutput += `${role}: ${spawning[role].length} `;
    // }
    // console.log(soutput);
    

	for (let name in Game.rooms) {
        roleRoom.run(Game.rooms[name], roles);
    }

    // for (let name in Game.creeps) {
    //     var creep = Game.creeps[name];

    //     if (roles[creep.memory.role]) {
    //         roles[creep.memory.role].run(creep);
    //     } else {
    //         console.log('no run for role:', creep.memory.role);
    //     }
    // }
}
