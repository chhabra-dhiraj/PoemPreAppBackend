const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const db = require('../controllers/user_queries')

router.use(bodyParser.json())
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

router.get('/users/:id', db.getUserById)
router.post('/users', db.createUser)
router.delete('/users/:id', db.deleteUser)

module.exports = router