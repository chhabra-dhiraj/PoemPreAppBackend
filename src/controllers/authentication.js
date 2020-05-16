//npm modules
const express = require('express');
const uuid = require('uuid');
const pool = require("../../postgresconfig");
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const userController = require("./user_queries")

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    done(null, user);
  });
  
passport.deserializeUser((user, done) => {
      pool.query('SELECT * FROM public."user" WHERE "userId" = $1', [user.userId])
      .then(results => done(null, results.rows[0]) )
      .catch(error =>{ 
          done(error, false)
    })
});

// configure passport.js to use the local strategy
passport.use('local', new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
        pool.query('SELECT * FROM public."user" WHERE "email" = $1', [email])
        .then(results => {
            const user = results.rows[0]
            if (!user) {
            return done(null, false, { message: 'Invalid credentials.\n' });
            }
            if (!bcrypt.compare(password, user.password)) {
            return done(null, false, { message: 'Invalid credentials.\n' });
            }
            return done(null, user);
        })
        .catch(error => done(error));

    }
));

const checkEmailPresent = async (request, response) => {
    try {

        const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }

        const { email } = request.body

        const results = await pool.query('SELECT * FROM public."user" WHERE "email" = $1', [email])
        const user = results.rows[0]

        if (!user) {
            response.status(200).json({
                emailPresent: false
            })   
        } else {
            response.status(200).json({
                emailPresent: true
            })
        }

    } catch (e) {
        response.status(500).send("Internal Server Error")
    }
}

const login = (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if(info) {return res.status(500).send(info.message)}
        if (err) { return next(err); }
        if (!user) { return res.status(200).json({
             message: 'Invalid credentials.\n' 
        }); }
        req.login(user, (err) => {
        if (err) { return next(err); }
        return res.status(200).json("authenticated");
        })
    })(req, res, next);

}

const register = (req, res, next) => {

    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    userController.createUser(req)
    .then(userId => {


        console.log(userId)        
        if(userId) {
            passport.authenticate('local', (err, user, info) => {
                if(info) {return res.status(500).send(info.message)}
                if (err) { return next(err); }
                if (!user) { return res.status(401).json({
                    isUserRegistered: true,
                    isUserAuthenticated: false
                }); }
                req.login(user, (err) => {
                  if (err) { return next(err); }
                  return res.status(401).json({
                      isUserRegistered: true,
                      isUserAuthenticated: false
                  });
                })
              })(req, res, next);
    
        } else {
            console.log("Dhiraj Chhabra")
            res.status(500).send('Internal Server Error')
        }
    })
    .catch(err => {
        throw err
        res.status(500).json({
            message: "Internal Server Error"
        })
    })
  
}

module.exports = { checkEmailPresent, login, register }