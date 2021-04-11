const User = require('../models/usersModel');

module.exports.findUsers = async (filter) => {
    try {
        let result = await User.find(filter);
        
        return result;
    } catch (error) {
        console.log("Something went wrong with findUsers", error);
        throw new Error(error);
    }
}

module.exports.login = async (filter) => {
    try {
        let result = await User.find(filter);

        return result[0] != null;
    } catch (error) {
        console.log("Something went wrong with login", error);
        throw new Error(error);
    }
}

module.exports.register = async (username, password) => {
    try {
        let user = new User({ 'username': username, 'password': password });
        return await user.save();
    } catch (error) {
        console.log("Something went wrong with register", error);
        throw new Error(error);
    }
}

module.exports.addCharacterToUser = async (username, characterId) => {
    try {
        let user = await User.find({ 'username': username });

        user.characters.push(characterId);
        return await user.save();
    } catch (error) {
        console.log("Something went wrong with addCharacterToUser", error);
        throw new Error(error);
    }
}

module.exports.getCharactersByUser = async (username) => {
    try {
        let user = await User.find({ 'username': username });
        
        return user[0].characters;
    } catch (error) {
        console.log("Something went wrong with getCharactersByUser", error);
        throw new Error(error);
    }
}