const express = require('express'),
    router = express.Router(),
    ps = require('python-shell'),
    db = require('../controllers/poetry_queries');

router.get("/poems", async function (req, res) {

    let options = {
        pythonPath: "/usr/bin/python3",
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
        if (err) throw err;
        let jsonString = JSON.parse(data);
        console.log(data);
        console.log(jsonString);
        res.status(200).json(jsonString);
    });

    // res.status(200).json({
    //     beforeResults: ["hello", "dhiraj", "how", "are", "you"],
    //     afterResults: ["hi", "daman", "I", "am", "fine"]
    // });
});

router.post('/poetries', db.createPoetries)
router.put('/poetries/:id', db.updatePoetry)
router.delete('/poetries/:id', db.deletePoetry)

module.exports = router;