// Importing the required npm modules
const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    uuid = require('uuid'),
    LocalStrategy = require('passport-local').Strategy;

router.use(passport.initialize());
router.use(passport.session());

// Setting up the suthentication api routes
router.use("/api", require('./authentication'));

// Setting up the poetry api routes
router.use("/api", require('./poetry'));

// Setting up the users api routes
router.use("/api", require('./users'));

module.exports = router;