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

characterRouter.route('/').get((req, res) => {
    //If the user is signed in
    if (req.session.user) {
        user = req.session.user;

        //Get a list of character IDs from the user
        usersService.getCharactersByUser(user)
            .then(characterIds => {
                //Use those character IDs to get the character data
                characterService.getCharacters(characterIds)
                    .then(characters => {
                        //Send that to the page
                        res.render('character_list', { title: 'My Characters', user: user, characters: characters, static: "." });
                    });
            })
            .catch(err => console.log(err));
    } else {
        //Otherwise, if the user hasn't logged in, then send them to login page
        res.redirect('/user/login');
    }
});

characterRouter.route('/create').get((req, res) => {
    //If user has signed in
    if (req.session.user) {
        user = req.session.user;

        res.render('index', { title: 'New Character', user: user, static: ".." });
    } else {
        //Otherwise, if the user hasn't logged in, then send them to login page
        res.redirect('/user/login');
    }
});

characterRouter.route('/:characterId').get((req, res) => {
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
}).post((req, res) => {
    var body = req.body;

    usersService.login({ 'username': body.username, 'password': body.password })
        .then(result => {
            if (!result) {
                console.log("No user found");
                res.render('login', { title: 'Log-in', user: user, error: 'Incorrect username or password.', static: ".." });
            } else {
                user = body.username;
                req.session.user = body.username;
                res.redirect('/');
            }
        })
        .catch(err => console.log(err));
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
}).post((req, res) => {
    var body = req.body;

    if (body.password != body.password_2) {
        res.render('register', { title: 'Register', user: null, error: 'The passwords do not match', static: ".." });
    } else {
        usersService.findUsers({ 'username': body.username })
        .then(result => {
            if (result[0] == null) {
                usersService.register(body.username, body.password)
                    .then(result => {
                        req.session.user = body.username;
                        res.redirect('/');
                    })
                    .catch(err => {
                        console.log(err);
                        res.render('register', { title: 'Register', user: null, error: 'An unexpected error occurred', static: ".." });
                    })
            } else {
                res.render('register', { title: 'Register', user: null, error: 'The username already exists', static: ".." });
            }
        });
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