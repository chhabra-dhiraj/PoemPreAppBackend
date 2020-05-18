const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    authenticationController = require('../controllers/authentication'),
    { check } = require('express-validator');

router.post('/email', authenticationController.checkEmailPresent)

router.post('/login', passport.authenticate('local'), authenticationController.login)

router.post('/register', authenticationController.register)

router.post('/forgot', authenticationController.forgot)

router.post('/otp', authenticationController.otpVerify)

router.post('/changepass', authenticationController.changePass)

router.get('/logout', authenticationController.logout)

module.exports = router;