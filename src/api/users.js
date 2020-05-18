const express = require('express')
const router = express.Router()
const db = require('../controllers/user_queries')

router.get('/users', db.getUserById)
router.patch('/users', db.updateUser)
router.delete('/users', db.deleteUser)

module.exports = router