const pool = require("../../postgresconfig");

const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(bodyParser.json())
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const getUserById = async (request, response) => {

    try {
        const id = parseInt(request.params.id)
        const results = await pool.query('SELECT * FROM public."user" WHERE "userId" = $1', [id])
        const user = results.rows[0]
        const poetries = await getPoetries(results.rows[0].userId)

        response.status(200).json({
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            userId: user.userId,
            poetries: poetries
        })

    } catch (e) {
        response.status(400).send("Invalid Body!")
    }
}

const getPoetries = async (userId) => {
    userId = parseInt(userId, 10)
    const poetries = await pool.query('SELECT * FROM public."poetry" WHERE "userId" = $1', [userId]);
    return poetries.rows
}

const createUser = async (request) => {

    const {email, firstname, lastname, password, imageUrl} = request.body
    console.log(email)

    const results = await pool.query('SELECT * FROM public."user" WHERE "email" = $1', [email])
    user = results.rows[0]

    if (!user) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            console.log("hash:- ")
            if(err) {
                console.log(err)
                throw err
            }

            // Now we can store the password hash in db.
            const hashedPassword = hash
            console.log(hash)

            pool.query('INSERT INTO public."user" ("email", "firstname", "lastname", "password", "imageUrl") VALUES ($1, $2, $3, $4, $5) RETURNING *', [email, firstname, lastname, hashedPassword, imageUrl], (error, results) => {
                if (error) {
                    console.log(error)
                    return null
                }
    
                console.log(results)
    
                return results.rows[0].userId
            })
        });

    }
}

const deleteUser = async (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM public."user" WHERE "userId" = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(`${id}`)
    })
}

module.exports = {
    getUserById,
    createUser,
    deleteUser,
}