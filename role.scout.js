var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {
    	console.log('roleScout');

    	creep.moveTo(Game.flags.Flag1);
	}
};

module.exports = roleScout;   
