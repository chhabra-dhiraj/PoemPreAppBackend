import pool from "../../postgresconfig";

const createPoetries = (userId) => {
    const { title, genre, body, bold, fontColor, fontStyle, fontSize, italic, underline } = request.body

    pool.query('INSERT INTO poetry (title, genre, body, bold, fontColor, fontStyle, fontSize, italic, underline, userId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [title, genre, body, bold, fontColor, fontStyle, fontSize, italic, underline, userId], (error, results) => {
        if (error) {
            throw error
        }

        response.status(201).send(`Poetry added with ID: ${results.insertId}`)
    })
}

const updatePoetry = (request, response) => {
    const id = parseInt(request.params.id)
    const { title, genre, body, bold, fontColor, fontStyle, fontSize, italic, underline } = request.body

    pool.query(
        'UPDATE poetry SET (title, genre, body, bold, fontColor, fontStyle, fontSize, italic, underline) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) WHERE id = $10',
        [title, genre, body, bold, fontColor, fontStyle, fontSize, italic, underline, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Poetry modified with ID: ${id}`)
        }
    )
}

const deletePoetry = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM poetry WHERE userId = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Poetry deleted with ID: ${id}`)
    })
}

module.exports = {
    createPoetries,
    updatePoetry,
    deletePoetry
}