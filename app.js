const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const dbConnection = require('./database/connection');
const app = express();
dbConnection();

//Service to interact with the users part of the database
const usersService = require('./database/service/usersService');
const characterService = require('./database/service/characterService');

//Routers for specific functionalities
var characterRouter = express.Router();
var userRouter = express.Router();

//Start the server
app.listen(3000, () => {
    console.log("Listening on port 3000");
});


app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(session({ secret : 'dancingonthebrooklynbridge'}));


// Base Page Routes
app.get('/', (req, res) => {
    user = (req.session.user) ? req.session.user : null;
    res.render('index', { title: 'Home', user: user, static: "." });
});

app.get('/about', (req, res) => {
    user = (req.session.user) ? req.session.user : null;
    res.render('about', { title: 'About', user: user, static: "." });
});

// Character Routes
app.use('/characters', characterRouter);

characterRouter.route('/').get(async (req, res) => {
    //If the user is signed in
    if (req.session.user) {
        user = req.session.user;

        //Get a list of character Ids registered to the user
        let characterIds = await usersService.getCharactersByUser(user);
        //Get a list of characters by the list of ids
        let characters = await characterService.getCharacters(characterIds);
        res.render('character_list', { title: 'My Characters', user: user, characters: characters, static: "." });
    } else {
        //Otherwise, if the user hasn't logged in, then send them to login page
        res.redirect('/user/login?next=/characters');
    }
});

characterRouter.route('/create').get(async (req, res) => {
    //If user has signed in
    if (req.session.user) {
        user = req.session.user;

        let races = await characterService.getRaces();
        let classes = await characterService.getClasses();
        let backgrounds = await characterService.getBackgrounds();
        res.render('create_character', { title: 'New Character', user: user, races: races, classes: classes, backgrounds: backgrounds, static: ".." });
    } else {
        //Otherwise, if the user hasn't logged in, then send them to login page
        res.redirect('/user/login?next=/characters/create');
    }
}).post(async (req, res) => {
    var body = req.body;
    if (!req.session.user) {
        res.redirect('/user/login');
        return res.redirect('/characters/create');
    } else if (body.race == undefined || body.race == 'undefined' || body.race == '') {
        console.log("Error: No race parameter found");
        return res.redirect('/characters/create');
    } else if (body.class == undefined || body.class == 'undefined' || body.class == '') {
        console.log("Error: No class parameter found");
        return res.redirect('/characters/create');
    } else if (body.subclass == undefined || body.subclass == 'undefined' || body.subclass == '') {
        console.log("Error: No subclass parameter found");
        return res.redirect('/characters/create');
    } else if (body.background == undefined || body.background == 'undefined' || body.background == '') {
        console.log("Error: No background parameter found");
        return res.redirect('/characters/create');
    } else if (body.name == undefined || body.name == 'undefined' || body.name == '') {
        console.log("Error: No name parameter found");
        return res.redirect('/characters/create');
    }

    let raw_stats = body.stats.split(",");

    let details = { 
        name: body.name,
        race: body.race,
        subrace: body.subrace,
        class: body.class,
        subclass: body.subclass,
        background: body.background,
        level: 1,
        raw_stats: raw_stats,
        proficiencies: {
            skills: []
        },
        stats: [
            {
                name: "Strength",
                value: "0"
            },
            {
                name: "Dexterity",
                value: "0"
            },
            {
                name: "Constitution",
                value: "0"
            },
            {
                name: "Intelligence",
                value: "0"
            },
            {
                name: "Wisdom",
                value: "0"
            },
            {
                name: "Charisma",
                value: "0"
            }
        ]
    };

    console.log(details);

    let characterID = await characterService.createCharacter(details);
    await usersService.addCharacterToUser(req.session.user, characterID);
    res.redirect('/characters/' + characterID);
});

characterRouter.route('/:characterId').get(async (req, res) => {
    //If user has signed in
    if (req.session.user) {
        user = req.session.user;

        let character = await characterService.getCharacter(req.params["characterId"]);
        let character_class = await characterService.getClasses({'class_name': character.class});
        let character_race = await characterService.getRaces({'race_name': character.race});
        let character_subrace;
        if (character.subrace != "") {
            character_subrace = character_race[0].subraces.filter(subrace => Object.keys(subrace).includes(character.subrace))[0];
        }
        let skills = await characterService.getSkills();
        let background = await characterService.getBackgrounds({'background_name': character.background});

        res.render('character_details', { title: 'Character Details', character: character, character_class: character_class[0], character_race: character_race[0], character_subrace: character_subrace, background: background[0], skills: skills, user: user, static: ".." });
    } else {
        //Otherwise, if the user hasn't logged in, then send them to login page
        res.redirect('/user/login?next=/characters/' + req.params["characterId"]);
    }
}).post(async (req, res) => {
    var body = req.body;

    let alignment = body.alignment_1 + " " + body.alignment_2;
    let stats = [
        { name: "Strength", value: body.Strength_ability_score },
        { name: "Dexterity", value: body.Dexterity_ability_score },
        { name: "Constitution", value: body.Constitution_ability_score },
        { name: "Intelligence", value: body.Intelligence_ability_score },
        { name: "Wisdom", value: body.Wisdom_ability_score },
        { name: "Charisma", value: body.Charisma_ability_score }
    ];
    
    let skills = [];
    Object.keys(body).forEach((key) => {
        if (key.substring(key.length - 6) == "_skill") {
            let skill_name = key.substring(0, key.length - 6);
            skill_name = skill_name.replace(/_/g, " ");
            skills.push(skill_name);
        }
    });
    let proficiencies = { skills: skills };

    let character = await characterService.getCharacter(req.params["characterId"]);
    character.alignment = alignment;
    character.stats = stats;
    character.proficiencies = proficiencies;
    
    await character.save();

    res.redirect(req.params["characterId"]);
});

// User Routes
app.use('/user', userRouter);

userRouter.route('/login').get((req, res) => {
    //If user has already signed in
    if (req.session.user) {
        user = req.session.user;

        if (req.query.next != null) {
            res.redirect(req.query.next);
        } else {
            //Take them to home page
            res.redirect('/');
        }
    } else {
        //Otherwise, if the user hasn't logged in, generate the login page
        user = null;
        res.render('login', { title: 'Log-in', user: user, error: '', static: ".." });
    }
}).post(async (req, res) => {
    var body = req.body;

    let result = await usersService.login({'username': body.username, 'password': body.password});
    if (!result) {
        console.log("No user found");
        res.render('login', { title: 'Log-in', user: user, error: 'Incorrect username or password.', static: ".." });
    } else {
        user = body.username;
        req.session.user = body.username;

        if (req.query.next != null) {
            res.redirect(req.query.next);
        } else {
            //Take them to home page
            res.redirect('/');
        }
    }
});

userRouter.route('/register').get((req, res) => {
    //If user has signed in
    if (req.session.user) {
        user = req.session.user;

        //Then send them to the home page
        res.redirect('/');
    } else {
        //Otherwise, generate the register page
        res.render('register', { title: 'Register', user: user, error: '', static: ".." });
    }
}).post(async (req, res) => {
    var body = req.body;

    if (body.password != body.password_2) {
        res.render('register', { title: 'Register', user: null, error: 'The passwords do not match', static: ".." });
    } else {
        let result = await usersService.findUsers({'username': body.username});
        if (result[0] == null) {
            await usersService.register(body.username, body.password);
            req.session.user = body.username;
            res.redirect('/');
        } else {
            res.render('register', { title: 'Register', user: null, error: 'The username already exists', static: ".." });
        }
    }
});

//Sign the user out
userRouter.route('/logout').get((req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});