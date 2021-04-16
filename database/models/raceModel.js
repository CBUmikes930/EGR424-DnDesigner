const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
    race_name: String,
    size: String,
    speed: String,
    abilityScoreBonus: [Object],
    traits: [Object],
    languages: [String],
    subraces: [Object]
});

module.exports = mongoose.model('Race', raceSchema);