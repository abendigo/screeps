# screeps

Game.spawns['Spawn1'].createCreep( [WORK, CARRY, MOVE], 'Harvester1' );

Game.spawns['Spawn1'].createCreep( [WORK, CARRY, MOVE], 'Upgrader1' );

Game.creeps['Harvester1'].memory.role = 'harvester';
Game.creeps['Upgrader1'].memory.role = 'upgrader';

Game.spawns['Spawn1'].createCreep( [WORK, CARRY, MOVE], 'Builder1', { role: 'builder' } );


Game.spawns['home'].createCreep( [WORK, CARRY, MOVE], undefined, { role: 'upgrader'} );
Game.spawns['home'].createCreep( [CARRY, CARRY, CARRY,MOVE,MOVE,MOVE,MOVE], undefined, { role: 'sweeper'} );

Game.spawns['home'].createCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], 'HarvesterBig', { role: 'harvester' } );

W27N68

Game.spawns['home'].createCreep( [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE], undefined, { role: 'claimbuilder' } );