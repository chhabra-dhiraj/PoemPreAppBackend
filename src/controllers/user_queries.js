import pool from "../../postgresconfig";

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM user WHERE userId = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json({
            userId: results.rows.userId,
            name: results.rows.name,
            email: results.rows.email,
            imageUrl: results.rows.imageUrl,
            poetries: getPoetries(results.rows.userId)
        })
    })
}

const getPoetries = (userId) => {
    let poetries = null
    pool.query('SELECT * FROM poetry WHERE userId = $1', [userId], (error, results) => {
        if (error) {
            throw error
        }

        poetries = results.rows
    })

    return poetries;
}

const createUser = (request, response) => {
    const { name, email, imageUrl } = request.body

    pool.query('INSERT INTO user (name, email, imageUrl) VALUES ($1, $2, $3)', [name, email, imageUrl], (error, results) => {
        if (error) {
            throw error
        }

        response.status(201).send(`User added with ID: ${results.insertId}`)
    })
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM user WHERE userId = $1', [id], (error, results) => {
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