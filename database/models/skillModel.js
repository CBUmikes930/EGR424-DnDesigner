const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: String,
    type: String
});

module.exports = mongoose.model('Skill', skillSchema);