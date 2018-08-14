var roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var targets = creep.room.find(FIND_HOSTILE_CREEPS);

        if(targets.length) {
            if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        } else {
            var moves = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT];
            creep.move(moves[Math.floor(Math.random() * moves.length)])
        }

    }
};

module.exports = roleDefender;