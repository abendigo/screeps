var roleRepair = {
	var repairit = creep.room.find(FIND_STRUCTURES, { 
	   filter: (structure) => { 
	       return ((structure.hits < 5000) && (structure.hits > 0))
	   }
	});

	console.log('to repair', repairit.length);
};

module.exports = roleRepair;