var structureTower = {
    run: function(tower) {
        if(tower) {

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }

            else {
                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < (structure.hitsMax * 0.8) && structure.hits < 1000000
                });

                if(closestDamagedStructure && tower.energy > 100) {
                    tower.repair(closestDamagedStructure);
                }
            }
        }
    }
};

module.exports = structureTower;