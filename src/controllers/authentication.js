const pool = require("../../postgresconfig"),
    bcrypt = require("bcrypt"),
    saltRounds = 10,
    nodemailer = require('nodemailer'),
    keys = require('../config/keys')

const checkEmailPresent = async (request, response) => {
    try {

        // const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

        // if (!errors.isEmpty()) {
        //     res.status(422).json({ errors: errors.array() });
        //     return;
        // }

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
    res.status(200).send("Authenticated")
}

const register = async (req, res, next) => {

    try {

        const { email, firstname, lastname, imageUrl, password } = req.body

        const results = await pool.query('SELECT * FROM public."user" WHERE "email" = $1', [email])
        const user = results.rows[0]
        if (!user) {
            const result = await doRegistration(email, firstname, lastname, imageUrl, password)
            if (result.isSuccessfull) {
                req.login(result.user, (err) => {
                    if (err) {
                        res.status(401).json({
                            isSuccessfull: true,
                            isLoginSuccessFull: false,
                            message: 'User has been registered but not authenticated due to server error'
                        })
                    } else {
                        res.status(201).json({
                            isSuccessfull: true,
                            isLoginSuccessFull: true,
                            message: 'User successfully registered and authenticated'
                        })
                    }
                });
            } else {
                res.status(500).json({
                    isSuccessfull: false,
                    message: result.message
                })
            }
        } else {
            res.status(200).json({
                isSuccessfull: false,
                message: 'User Already Registered'
            })
        }
    } catch (error) {
        res.status(500).json({
            isSuccessfull: false,
            message: 'Server Error'
        })
    }

}

const doRegistration = async (email, firstname, lastname, imageUrl, password) => {

    const isValid = validateRegistrationDetails()

    if (isValid) {
        try {
            const hash = await bcrypt.hash(password, saltRounds)

            const results = await pool.query('INSERT INTO public."user" ("email", "firstname", "lastname", "password", "imageUrl") VALUES ($1, $2, $3, $4, $5) RETURNING *', [email, firstname, lastname, hash, imageUrl])
            if (results.rows[0]) {
                return {
                    isSuccessfull: true,
                    message: 'Registration Successfull',
                    user: results.rows[0]
                }
            }
        } catch (error) {
            return {
                isSuccessfull: false,
                message: 'Server Error'
            }
        }
    } else {
        return {
            isSuccessfull: false,
            message: 'Registration Details do not match the criteria'
        }
    }

}

const validateRegistrationDetails = (email, firstname, lastname, imageUrl, password) => {
    // Handle validation
    return true
}

// For demo. Should be stored in session of a particular user
const savedOtp = '1234'

const forgot = (req, res) => {
    const { email } = req.body
    // send email 
    keys.transporter.sendMail(keys.mailOptions(email, savedOtp), function (err, info) {
        if (err) {
            res.status(500).json({
                isSuccessfull: false,
                message: 'Server Error'
            })
        } else {
            res.status(200).json({
                isSuccessfull: true,
                message: 'Successfully sent verification code on your email'
            })
        }
    });
}

const otpVerify = (req, res) => {
    const { otp } = req.body
    if (otp == savedOtp) {
        res.status(200).json({
            isVerificationSuccessfull: true,
            message: 'Otp Verification Successfull'
        })
    } else {
        res.status(200).json({
            isVerificationSuccessfull: false,
            message: 'Otp Verification Unsuccessfull'
        })
    }
}

// For demo. Should be saved in session of a particular user
const isOtpVerificationSuccessful = true

const changePass = (req, res) => {
    if (isOtpVerificationSuccessful) {
        const { email, newPass } = req.body
        const isPasswordValid = validatePassword(newPass)
        if (isPasswordValid) {

            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({
                        message: 'Internal Server Error'
                    })
                }

                pool.query('UPDATE public."user" SET "password"=$1 WHERE "email" = $2', [hash, email], (error, results) => {
                    if (error) {
                        res.status(500).json({
                            message: 'Internal Server Error'
                        })
                    }

                    res.status(200).json({
                        isSuccessfull: true,
                        message: 'Password change is Successfull'
                    })
                })
            });

        } else {
            res.status(200).json({
                isSuccessfull: false,
                message: 'Password does not match the criteria'
            })
        }
    } else {
        res.status(200).json({
            isSuccessful: false,
            message: 'Password cannot be changed without OTP verification'
        })
    }

}

const logout = (req, res) => {
    if (req.isAuthenticated()) {
        req.logout()
        res.status(200).json({
            message: 'Successfully logged out'
        })
    } else {
        res.status(401).json({
            message: "No user logged in"
        })
    }
}

const validatePassword = (password) => {
    // Validate password here
    return true
}

module.exports = { checkEmailPresent, login, register, forgot, otpVerify, changePass, logout }