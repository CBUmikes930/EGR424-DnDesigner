const Character = require('../models/characterModel');
const Race = require('../models/raceModel');
const Class = require('../models/classModel');
const Background = require('../models/backgroundModel');
const Skill = require('../models/skillModel');

module.exports.createCharacter = async (content) => {
    try {
        let character = new Character(content);
        await character.save();
        return character._id;
    } catch (error) {
        console.log("Something went wrong with createCharacter", error);
        throw new Error(error);
    }
}

module.exports.getCharacters = async (characterIds) => {
    try {
        var characters = [];
        
        for (let i = 0; i < characterIds.length; i++) {
            let character = await Character.findById(characterIds[i]);
            characters.push(character);
        }
        
        return characters;
    } catch (error) {
        console.log("Something went wrong with getCharacters", error);
        throw new Error(error);
    }
}

module.exports.getCharacter = async (characterId) => {
    try {
        let character = await Character.findById(characterId);

        return character;
    } catch (error) {
        console.log("Something went wrong with getCharacter", error);
        throw new Error(error);
    }
}


module.exports.getRaces = async (filter) => {
    try {
        let result = await Race.find(filter);

        return result;
    } catch (error) {
        console.log("Something went wrong with getRaces", error);
        throw new Error(error);
    }
}

module.exports.getClasses = async (filter) => {
    try {
        let result = await Class.find(filter);

        return result;
    } catch (error) {
        console.log("Something went wrong with getClasses", error);
        throw new Error(error);
    }
}

module.exports.getBackgrounds = async (filter) => {
    try {
        let result = await Background.find(filter);

        return result;
    } catch (error) {
        console.log("Something went wrong with getBackgrounds", error);
        throw new Error(error);
    }
}

module.exports.getSkills = async (filter) => {
    try {
        let result = await Skill.find(filter);

        return result;
    } catch (error) {
        console.log("Something went wrong with getSkills", error);
        throw new Error(error);
    }
}