const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    characters: [String]
});

module.exports = mongoose.model('User', usersSchema);