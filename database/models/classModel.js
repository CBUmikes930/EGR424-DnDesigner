const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    class_name: String,
    hit_dice: Number,
    proficiencies: [Object],
    equipment: [Object],
    features: [Object],
    table: [Object]
});

module.exports = mongoose.model('Class', classSchema);