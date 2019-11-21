const pool = require("../../postgresconfig");
const bodyParser = require('body-parser');

const createPoetries = (request, response) => {
    const userId = parseInt(request.query.userId, 10);
    const { title, genre, body, bold, fontColor, fontStyle, fontSize, italic, underline } = request.body

    pool.query('INSERT INTO public."poetry" ("title", "genre", "body", "bold", "fontColor", "fontStyle", "fontSize", "italic", "underline", "userId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [title, genre, body, bold, fontColor, fontStyle, fontSize, italic, underline, userId], (error, results) => {
        if (error) {
            throw error
        }

        response.status(201).json(`${results.rows[0].poetryId}`)
    })
}

const updatePoetry = (request, response) => {
    const id = parseInt(request.params.id, 10)
    const { title, genre, body, bold, fontColor, fontStyle, fontSize, italic, underline } = request.body

    pool.query(
        'UPDATE public."poetry" SET ("title", "genre", "body", "bold", "fontColor", "fontStyle", "fontSize", "italic", "underline") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) WHERE "userId" = $10',
        [title, genre, body, bold, fontColor, fontStyle, fontSize, italic, underline, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(`${id}`)
        }
    )
}

const deletePoetry = (request, response) => {
    const id = parseInt(request.params.id, 10)

    pool.query('DELETE FROM public."poetry" WHERE "userId" = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(`${id}`)
    })
}

module.exports = {
    createPoetries,
    updatePoetry,
    deletePoetry
}