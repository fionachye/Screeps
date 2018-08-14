const UPGRADERS_LIMIT = 3;
const HARVERSTERS_LIMIT = 2;
const BUILDERS_LIMIT = 2;
const DEFENDERS_LIMIT = 0;
const HARVESTERS_BUILDERS_LIMIT = HARVERSTERS_LIMIT + BUILDERS_LIMIT;
const TOTAL_LIMIT = UPGRADERS_LIMIT + HARVERSTERS_LIMIT + BUILDERS_LIMIT;

 /**
 * Make a creep with body parts that follow the given ratio using as much
 * energy as possible. The creep is not actually spawned.
 *
 * The ratios should be specified as follow:
 *
 * The ratios parameter is an object.
 * Each property of ratios should be a body part.
 * The value of the property should be a number that is the ratio of that body part.
 *
 *
 * > var energy = 400;
 * > var ratios = {};
 * > var ratios[WORK] = 2;
 * > var ratios[CARRY] = 1;
 * > var ratios[MOVE] = 2;
 * > makeCreep(energy, ratios, {});
 * {
 *     body: [WORK, CARRY, MOVE, MOVE],
 *     name: undefined,
 *     memory: {}
 * }
 *
 *
 *
 * @param  {Number} energy the amount of avaliable energy.
 * @param  {Object} ratios ratio of body parts.
 * @return {Object} the body, name, and memory of the creep. Creep is not
 *                  actually spawned.
 */
function makeCreep(energy, ratios, memoryRole) {

    // Useful to maintain ratio.
    var tmpRatio = Object.assign({}, ratios);

    var body = [];

    while (energy > 0) {
        // Prevents infintie loop if no part can be added.
        var added = false;

        // Recharge the tmpRatio if we hit 0 on all the parts. We don't
        // stop until we actually run out of energy.
        if (_.reduce(tmpRatio, function(result, value, key) {
            return result + value;
        }, 0) === 0) {
            tmpRatio = Object.assign({}, ratios);
        }

        for (var part in ratios) {

            if (tmpRatio[part] > 0 && energy - BODYPART_COST[part] > 0) {
                body.push(part);
                tmpRatio[part]--;
                energy -= BODYPART_COST[part];
                added = true;
            }

            // 50 is the maximum number of body parts.
            if (body.length >= 50) {
                added = false;
                break;
            }

        }

        if (!added) {

            break;
        }
    }

    return {
        body: body,
        name: undefined,
        memory: memoryRole
    };
}

var taskSpawns = {


    run: function() {
        for(var name in Game.rooms) {
            console.log('Room "' + name + '" has '+ Game.rooms[name].energyAvailable +' energy');
        }

        var harvesters = _.filter(Game.creeps, (creep) => (creep.memory.role == 'harvester' || creep.memory.role == 'collector') && creep.ticksToLive > 20);
        console.log('Harvesters: ' + harvesters.length);

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.ticksToLive > 20);
        console.log('Upgraders: ' + upgraders.length);

        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.ticksToLive > 20);
        console.log('Builders: ' + builders.length);

        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender' && creep.ticksToLive > 20);
        console.log('Defenders: ' + defenders.length);

        var total_harvesters_builders = harvesters.length + builders.length;

        if(harvesters.length < HARVERSTERS_LIMIT &&
            total_harvesters_builders < HARVESTERS_BUILDERS_LIMIT) {

            var ratios = {};
            ratios[WORK] = 2;
            ratios[CARRY] = 1;
            ratios[MOVE] = 2;

            if(harvesters.length < 1) {
                var creep = makeCreep(Game.spawns['Spawn1'].room.energyAvailable, ratios, { role: 'harvester' });
            }

            else{
                var creep = makeCreep(Game.spawns['Spawn1'].room.energyCapacityAvailable, ratios, { role: 'harvester' });
            }

            // Only spawn if at least every part is included once.
            if (_.intersection(creep.body, [WORK, CARRY, MOVE]).length === 3) {
                var newName = Game.spawns['Spawn1'].createCreep(creep.body, creep.name, creep.memory);
                console.log('Spawning new harvester: ' + newName);
            }
        }

        if(builders.length < BUILDERS_LIMIT &&
            harvesters.length >= HARVERSTERS_LIMIT &&
            total_harvesters_builders < HARVESTERS_BUILDERS_LIMIT) {

            var ratios = {};
            ratios[WORK] = 2;
            ratios[CARRY] = 1;
            ratios[MOVE] = 2;
            var creep = makeCreep(Game.spawns['Spawn1'].room.energyCapacityAvailable, ratios, { role: 'builder' });

            // Only spawn if at least every part is included once.
            if (_.intersection(creep.body, [WORK, CARRY, MOVE]).length === 3) {
                var newName = Game.spawns['Spawn1'].createCreep(creep.body, creep.name, creep.memory);
                console.log('Spawning new builder: ' + newName);
            }
        }

        if(upgraders.length < UPGRADERS_LIMIT &&
            builders.length >= BUILDERS_LIMIT &&
            harvesters.length >= HARVERSTERS_LIMIT) {

            var ratios = {};
            ratios[WORK] = 3;
            ratios[CARRY] = 2;
            ratios[MOVE] = 1;
            var creep = makeCreep(Game.spawns['Spawn1'].room.energyCapacityAvailable, ratios, { role: 'upgrader' });

            // Only spawn if at least every part is included once.
            if (_.intersection(creep.body, [WORK, CARRY, MOVE]).length === 3) {
                var newName = Game.spawns['Spawn1'].createCreep(creep.body, creep.name, creep.memory);
                console.log('Spawning new upgrader: ' + newName);
            }
        }

        if(harvesters.length >=HARVERSTERS_LIMIT &&
            upgraders.length >= UPGRADERS_LIMIT &&
            builders.length >= BUILDERS_LIMIT &&
            defenders.length < DEFENDERS_LIMIT) {

            var ratios = {};
            ratios[ATTACK] = 1;
            ratios[MOVE] = 1;
            var creep = makeCreep(Game.spawns['Spawn1'].room.energyCapacityAvailable, ratios, { role: 'defender' });

            // Only spawn if at least every part is included once.
            if (_.intersection(creep.body, [ATTACK, MOVE]).length === 2) {
                var newName = Game.spawns['Spawn1'].createCreep(creep.body, creep.name, creep.memory);
                console.log('Spawning new defender: ' + newName);
            }
        }

    },

};

module.exports = taskSpawns;