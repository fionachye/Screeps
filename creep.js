var roleHarvester = require('./harvester');
var roleCollector = require('./collector');
var roleUpgrader = require('./upgrader');
var roleBuilder = require('./builder');
var roleDefender = require('./defender');
var roleAttacker = require('./attacker');

var roleCreep = {
    run: function(creep) {
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'collector') {
            roleCollector.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if(creep.memory.role == 'attacker') {
            roleAttacker.run(creep);
        }
    },
};

module.exports = roleCreep;