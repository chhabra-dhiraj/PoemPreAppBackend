const pool = require("../../postgresconfig");
const bodyParser = require('body-parser');

const createPoetries = (request, response) => {
    const userId = parseInt(request.query.userId, 10);
    const { title, genre, body } = request.body

    pool.query('INSERT INTO public."poetry" ("title", "genre", "body", "userId") VALUES ($1, $2, $3, $4) RETURNING *', [title, genre, body, userId], (error, results) => {
        if (error) {
            throw error
        }

        response.status(200).json(`${results.rows[0].poetryId}`)
    })
}

const updatePoetry = (request, response) => {
    const id = parseInt(request.params.id, 10)
    console.log(id)
    const { title, genre, body } = request.body


    console.log(title)
    pool.query('UPDATE public."poetry" SET "title"=$1, "genre"=$2, "body"=$3 WHERE "poetryId" = $4',
        [title, genre, body, id],
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

    pool.query('DELETE FROM public."poetry" WHERE "poetryId" = $1', [id], (error, results) => {
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