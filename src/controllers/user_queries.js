import pool from "../../postgresconfig";

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
        const results = await pool.query('SELECT * FROM public."user" WHERE "userId" = $1', [id])
        const user = results.rows[0]
        const poetries = await getPoetries(results.rows.userId)

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
    const poetries = await pool.query('SELECT * FROM public."poetry" WHERE "userId" = $1', [userId]);
    return poetries.rows
}

const createUser = (request, response) => {
    const {name, email, imageUrl} = request.body

    pool.query('INSERT INTO public."user" (name, email, imageUrl) VALUES ($1, $2, $3)', [name, email, imageUrl], (error, results) => {
        if (error) {
            throw error
        }

        response.status(201).send(`User added with ID: ${results.insertId}`)
    })
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM public."user" WHERE "userId" = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getUserById,
    createUser,
    deleteUser,
}