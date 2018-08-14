var roleAttacker = {
    run: function(creep) {
        // First move to desired room.
        if (this.room.name !== 'W51N52') {
            var destination = new RoomPosition(8, 14, 'W51N52');
            creep.moveTo(destination, {
                ignoreRoads: true,
            });
        } else {
            // Kill any repairing creeps.
            var repairer = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (creep) => {
                    var spawn = new RoomPosition(8, 14, 'W51N52');
                    if (!spawn.inRangeTo(creep, 7)) {
                        return false;
                    }

                    var body = creep.body;
                    for (var i in body) {
                        var part = body[i];
                        if (part.type === ATTACK && part.hits > 0) {
                            return true;
                        } else if (part.type === WORK && creep.carry.energy > 0 && part.hits > 0) {
                            return true;
                        }
                    }
                    return false;
                }
            });

            if (repairer) {
                if(creep.attack(repairer) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairer, {
                        ignoreRoads: true,
                    });
                    creep.heal(this);
                }
                creep.say('glhf', true);
            } else {

                // Kill the spawn.
                var spawns = this.room.find(FIND_HOSTILE_SPAWNS);
                if (spawns.length > 0) {
                    if(creep.attack(spawns[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawns[0], {
                            ignoreRoads: true,
                        });
                        creep.heal(this);
                    } else {
                        creep.say('gg', true);
                    }

                } else {

                    // Kill anything.
                    var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if (target > 0) {
                        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {
                                ignoreRoads: true,
                            });
                            creep.heal(this);
                            creep.say('gg', true);
                        }
                    } else {
                        creep.say('gg', true);
                    }

                }

            }

        }
    }
};

module.exports = roleAttacker;