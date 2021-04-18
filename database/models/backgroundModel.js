const mongoose = require('mongoose');

const backgroundSchema = new mongoose.Schema({
    background_name: String,
    description: String,
    proficiencies: [Object],
    equipment: [Object],
    Feature: Object
});

module.exports = mongoose.model('Background', backgroundSchema);