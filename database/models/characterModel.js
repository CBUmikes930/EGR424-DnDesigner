const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    name: String,
    race: String,
    subrace: String,
    class: String,
    subclass: String,
    level: Number,
    background: String,
    alignment: String,
    stats: [Object],
    armorClass: Number,
    speed: Number,
    hitPoints: Number,
    proficiencies: Object,
    equipment: [Object],
    features: [Object],
    raw_stats: [Number]
});

module.exports = mongoose.model('Character', characterSchema);