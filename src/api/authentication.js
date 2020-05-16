const express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    { check, validationResult } = require('express-validator');
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt-nodejs'),
    uuid = require('uuid'),
    authenticationController = require('../controllers/authentication'),
    emailValidatorMiddlerware = require('../middlewares/validation_middlewares/emailValidator')

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM public."user" WHERE "userId" = $1', [id])
    .then(results => done(null, results.rows[0]) )
    .catch(error => done(error, false))
});

// Parse incoming requests data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/email', [check('email', "Invalid Email").isEmail()], authenticationController.checkEmailPresent)
  
router.post('/login', authenticationController.login)

router.post('/register', 
authenticationController.register)

module.exports = router;