const pool = require("../../postgresconfig");

const createPoetries = (req, res) => {
    // if (req.isAuthenticated()) {
        const userId = req.session.passport.user
        const { title, genre, body } = req.body

        pool.query('INSERT INTO public."poetry" ("title", "genre", "body", "userId") VALUES ($1, $2, $3, $4) RETURNING *', [title, genre, body, userId], (error, results) => {
            if (error) {
                console.log("hi error" + error)
                res.status(500).json({
                    isSuccessfull: false,
                    message: 'Server Error'
                })
                return
            }

            res.status(200).json({
                isSuccessfull: true,
                message: 'Successfully created poetry'
            })
        })
    // } else {
    //     res.status(401).json({
    //         isSuccessfull: false,
    //         message: 'User not logged in'
    //     })
    // }
}

const updatePoetry = (req, res) => {
    // if (req.isAuthenticated()) {
        const id = parseInt(req.params.id, 10)
        const { title, genre, body } = req.body

        pool.query('UPDATE public."poetry" SET "title"=$1, "genre"=$2, "body"=$3 WHERE "poetryId" = $4 returning *',
            [title, genre, body, id],
            (error, results) => {
                if (error) {
                    res.status(500).json({
                        isSuccessfull: false,
                        message: 'Server Error'
                    })
                    return
                }
                res.status(200).json({
                    isSuccessfull: true,
                    message: 'Successfully updated poetry'
                })
            }
        )
    // } else {
    //     res.status(401).json({
    //         isSuccessfull: false,
    //         message: 'User not logged in'
    //     })
    // }
}

const deletePoetry = (req, res) => {
    // if (req.isAuthenticated()) {
        const id = parseInt(req.params.id, 10)

        pool.query('DELETE FROM public."poetry" WHERE "poetryId" = $1', [id], (error, results) => {
            if (error) {
                res.status(500).json({
                    isSuccessfull: false,
                    message: 'Server Error'
                })
                return
            }
            res.status(200).json({
                isSuccessfull: true,
                message: 'Successfully deleted poetry'
            })
        })
    // } else {
    //     res.status(401).json({
    //         isSuccessfull: false,
    //         message: 'User not logged in'
    //     })
    // }
}

module.exports = {
    createPoetries,
    updatePoetry,
    deletePoetry
}