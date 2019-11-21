const pool = require("../../postgresconfig");

const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()

router.use(bodyParser.json())
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const getUserById = async (request, response) => {
    const id = parseInt(request.params.id)
    console.log(id)

    try {
        const results = await pool.query('SELECT * FROM public."user" WHERE "userId" = $1', [parseInt(id, 10)])
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
        throw e
    }
}

const getPoetries = async (userId) => {
    userId = parseInt(userId, 10)
    const poetries = await pool.query('SELECT * FROM public."poetry" WHERE "userId" = $1', [userId]);
    return poetries.rows
}

const createUser = async (request, response) => {
    const {firebaseId, name, email, imageUrl} = request.body
    console.log(imageUrl)

    const results = await pool.query('SELECT * FROM public."user" WHERE "firebaseId" = $1', [firebaseId])
    user = results.rows[0]

    if (!user) {
        pool.query('INSERT INTO public."user" ("name", "email", "imageUrl", "firebaseId") VALUES ($1, $2, $3, $4) RETURNING *', [name, email, imageUrl, firebaseId], (error, results) => {
            if (error) {
                throw error
            }

            console.log(results)

            response.status(200).json(`${results.rows[0].userId}`)
        })
    } else {
        response.status(200).json(user.userId)
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