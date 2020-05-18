// Importing the required npm modules
const express = require('express'),
    router = express.Router();

// Setting up the suthentication api routes
router.use("/api", require('./authentication'));

// Setting up the poetry api routes
router.use("/api", require('./poetry'));

// Setting up the users api routes
router.use("/api", require('./users'));

module.exports = router;