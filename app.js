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
app.listen(5000, () => {
    console.log("Listening on port 5000");
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
        res.redirect('/user/login');
    }
});

characterRouter.route('/create').get(async (req, res) => {
    //If user has signed in
    if (req.session.user) {
        user = req.session.user;

        let races = await characterService.getRaces();
        let classes = await characterService.getClasses();
        let backgrounds = await characterService.getBackgrounds();
        res.render('edit_character', { title: 'New Character', user: user, races: races, classes: classes, backgrounds: backgrounds, static: ".." });
    } else {
        //Otherwise, if the user hasn't logged in, then send them to login page
        res.redirect('/user/login');
    }
}).post(async (req, res) => {
    var body = req.body;
    if (!req.session.user) {
        res.redirect('/user/login');
    } else if (body.race == undefined) {
        console.log("Error: No race parameter found");
    } else if (body.subrace == undefined) {
        console.log("Error: No subrace parameter found");
    } else if (body.class == undefined) {
        console.log("Error: No class parameter found");
    } else if (body.subclass == undefined) {
        console.log("Error: No subclass parameter found");
    } else if (body.background == undefined) {
        console.log("Error: No background parameter found");
    } else if (body.name == undefined) {
        console.log("Error: No name parameter found");
    }

    let details = { 
        name: body.name,
        race: body.race,
        subrace: body.subrace,
        class: body.class,
        subclass: body.subclass,
        background: body.background
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

        res.render('index', { title: 'Character Details', characterId: req.params["characterId"], user: user, static: ".." });
    } else {
        //Otherwise, if the user hasn't logged in, then send them to login page
        res.redirect('/user/login');
    }
});

// User Routes
app.use('/user', userRouter);

userRouter.route('/login').get((req, res) => {
    //If user has already signed in
    if (req.session.user) {
        user = req.session.user;

        //Take them to home page
        res.redirect('/');
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
        res.redirect('/');
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