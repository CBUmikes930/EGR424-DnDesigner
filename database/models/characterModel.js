const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    name: String,
    race: String,
    class: String,
    subClass: String,
    background: String,
    alignment: String,
    armorClass: Number,
    speed: Number,
    strengthStat: Number,
    dexterityStat: Number,
    constitutionStat: Number,
    intelligenceStat: Number,
    wisdomStat: Number,
    charismaStat: Number,
    hitPoints: Number,
    hitDiceType: String,
    hitDiceNumber: Number
});

module.exports = mongoose.model('Character', characterSchema);