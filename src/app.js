const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    passport = require('passport'),
    passportSetup = require('./config/passport-setup'),
    keys = require('./config/keys'),
    { v4: uuidv4 } = require('uuid'),
    session = require('express-session'),
    FileStore = require('session-file-store')(session);

// Set up the express app
const app = express();

// Setting up the basic configuration.
app.use('/', express.static(path.join(__dirname, '../public')));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    genid: (req) => {
        return uuidv4(); // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: keys.session.secret,
    resave: false,
    saveUninitialized: true
}
)
)

app.use(passport.initialize())
app.use(passport.session())

// Setting up the api routes
app.use(require('./api/index'));

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});