var role = {

    /** @param {Creep} creep **/
    run: function(tower) {
        console.log('tower', tower.energy)

        let hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) {
            tower.attack(hostile);
        } else {

        }
    }
};

module.exports = role;
