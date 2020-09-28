const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    pool = require("../../postgresconfig"),
    bcrypt = require("bcrypt");

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
    done(null, user.userId);
});

passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM public."user" WHERE "userId" = $1', [id])
        .then(results => done(null, results.rows[0]))
        .catch(error => done(error, false))
});

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
        pool.query('SELECT * FROM public."user" WHERE "email" = $1', [email])
            .then(async (results) => {
                const user = results.rows[0]
                if (!user) {
                    return done(null, false, { message: 'No user found with this email' })
                } else {
                    try {
                        const result = await doLogin(password, user.password)
                        if (result.isSuccessfull) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: result.message })
                        }
                    } catch (e) {
                        return done(e)
                    }

                }
                // }
            })
            .catch(error => done(error));

    }
));

const doLogin = async (password, hashedPassword) => {
    try {
        const result = await bcrypt.compare(password, hashedPassword)
        if (!result) {
            return {
                isSuccessfull: false,
                message: 'Invalid Password'
            }
        }
        return {
            isSuccessfull: true,
            message: 'User Successfully Authenticated'
        }
    } catch (error) {
        return {
            isSuccessfull: false,
            message: 'Server Error'
        }
    }
}