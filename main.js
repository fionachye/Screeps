var roleCreep = require('./creep');
var structureStructure = require('./structure');
var taskSpawns = require('./spawns');

function garbageCollection() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

module.exports.loop = function () {

    garbageCollection();

    // run tasks.
    taskSpawns.run();

    // call the run method on all structures.
    for (var id in Game.structures) {
        structureStructure.run(id);
    }

    // call the run method on all creeps.
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        roleCreep.run(creep);
    }
};