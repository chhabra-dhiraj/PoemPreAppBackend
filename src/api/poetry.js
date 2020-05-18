const express = require('express'),
    router = express.Router(),
    ps = require('python-shell'),
    db = require('../controllers/poetry_queries');

router.get("/poems", async function (req, res) {
    if (req.isAuthenticated) {

        let options = {
            scriptPath: "public",
            args:
                [
                    req.query.word,
                    req.query.genre
                ]
        };

        console.log(req.query.word);
        console.log(req.query.genre);

        ps.PythonShell.run('poem.py', options, async function (err, data) {
            console.log(data)
            if (err) {
                res.status(500).json({
                    isSuccessfull: false,
                    message: 'Server Error'
                })
                return
            };
            let jsonString = JSON.parse(data);
            // console.log(data);
            console.log(jsonString);
            res.status(200).json(jsonString);
        });
    } else {
        res.status(401).send('User is not logged in')
    }
});

router.post('/poetries', db.createPoetries)
router.put('/poetries/:id', db.updatePoetry)
router.delete('/poetries/:id', db.deletePoetry)

module.exports = router;