const pool = require("../../postgresconfig"),
    bcrypt = require("bcrypt"),
    saltRounds = 10;

const getUserById = async (req, res) => {
    if (req.isAuthenticated()) {
    try {
        const id = req.user.userId
        const results = await pool.query('SELECT * FROM public."user" WHERE "userId" = $1', [id])
        const user = results.rows[0]
        const poetries = await getPoetries(results.rows[0].userId)
        res.status(200).json({
            isSuccessfull: true,
            message: "Request Successful",
            user: user,
            poems: poetries
        })

    } catch (e) {
        res.status(500).json({
            isSuccessfull: false,
            message: 'Server Error'
        })
    }
    } else {
        res.status(401).json({
            isSuccessfull: false,
            message: 'User not logged in'
        })
    }
}

const getPoetries = async (userId) => {
    userId = parseInt(userId, 10)
    const poetries = await pool.query('SELECT * FROM public."poetry" WHERE "userId" = $1', [userId]);
    return poetries.rows
}

const updateUser = async (req, res) => {
    if (req.isAuthenticated()) {
    try {
        const id = req.user.userId
        const { email, firstname, lastname, imageUrl } = req.body
        const results = await pool.query('SELECT * FROM public."user" WHERE "email" = $1', [email])
        const user = results.rows[0]

        if (!user) {

            const results = await pool.query('UPDATE public."user" SET "email"=$1, "firstname"=$2, "lastname"=$3, "imageUrl"=$4 WHERE "userId" = $5 returning *'
                , [email, firstname, lastname, imageUrl, id])

            if (results.rows[0]) {
                res.status(200).json({
                    isSuccessfull: true,
                    message: "Successfully updated user data",
                    user: req.user,
                })
            }
        } else {
            const results = await pool.query('UPDATE public."user" SET "firstname"=$1, "lastname"=$2, "imageUrl"=$3 WHERE "userId" = $4 returning *'
                , [firstname, lastname, imageUrl, id])

            if (results.rows[0]) {
                res.status(200).json({
                    isSuccessfull: true,
                    message: "Successfully updated user data except email as user with same email present",
                    user: req.user,
                })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccessfull: false,
            message: "Server Error"
        })
    }
    } else {
        res.status(401).json({
            isSuccessfull: false,
            message: "User not logged in"
        })
    }
}

const deleteUser = async (req, res) => {
    if (req.isAuthenticated()) {
    try {
        const id = req.user.userId
        pool.query('DELETE FROM public."poetry" WHERE "userId" = $1', [id])

        pool.query('DELETE FROM public."user" WHERE "userId" = $1', [id], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).json({
                    isSuccessfull: false,
                    message: 'Server Error'
                })
            }
            req.logout()
            res.status(200).json({
                isSuccessfull: true,
                message: 'User successfully deleted and logged out'
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            isSuccessfull: false,
            message: "Server Error"
        })
    }
    } else {
        res.status(401).json({
            isSuccessfull: false,
            message: "User not logged in"
        })
    }
}

module.exports = {
    getUserById,
    updateUser,
    deleteUser,
}