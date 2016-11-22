var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepair = require('role.repair');
var roleScout = require('role.scout');
var roleSweeper = require('role.sweeper');
var roleH2 = require('role.h2');

 let roles = {
 	'h2': require('role.h2')
 };



module.exports.loop = function () {
	console.log('roles', roles);

	for(var name in Game.rooms) {
        console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy', 'of', Game.rooms[name].energyCapacityAvailable);
    }

	for (var i in Memory.creeps) {
		if (!Game.creeps[i]) {
			delete Memory.creeps[i];
		}
	}

    var roomName = 'W63S24';
    var room = Game.rooms[roomName];
    var energyAvailable = room.energyAvailable;
    var energyCapacityAvailable = room.energyCapacityAvailable;
    var home = 'home';

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
	var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
	var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
	var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
	var sweepers = _.filter(Game.creeps, (creep) => creep.memory.role == 'sweeper');
    var h2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'h2');

	console.log('h2', h2.length, 'harvestors', harvesters.length, 'upgraders', upgraders.length, 'builders', builders.length, 'repairs', repairs.length, 'sweepers', sweepers.length);

	// Always have 1 harvester, no matter what
	if (harvesters.length < 1) {
		if (energyAvailable >= 300) {
			var name = Game.spawns[home].createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: 'harvester'});
			console.log('new harvestor', name);
		}
    } else if (energyCapacityAvailable <= 800) {
        if (h2.length < 4) {
            if (energyAvailable >= 300) {
                Game.spawns[home].createCreep([WORK,WORK,MOVE,MOVE], undefined, {role: 'h2'});
            }
        } else if (sweepers.length < 2) {
            if (energyAvailable > 350) {
                Game.spawns[home].createCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, {role: 'sweeper'});
            }
        }
    }


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep, {source: 1});
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep, {source: 0});
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep, {source: 1});
        }
        if (creep.memory.role == 'repair') {
        	roleRepair.run(creep, {source: 1});
        }
        if (creep.memory.role == 'scout') {
        	roleScout.run(creep);
        }
        if (creep.memory.role == 'sweeper') {
        	roleSweeper.run(creep);
        }

        // if (creep.memory.role == 'h2') {
        // 	roleH2.run(creep);
        // }

        if (creep.memory.role == 'h2') {
        	roles['h2'].run(creep);
        }
    }
}


