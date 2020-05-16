// Importing the required npm modules
const express = require('express'),
    router = express.Router(),
    { v4: uuidv4 } = require('uuid');
    session = require('express-session'),
    FileStore = require('session-file-store')(session);

// add & configure middleware
router.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log(req.sessionID)
    return uuidv4(); // use UUIDs for session IDs
  },
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

module.exports = router;