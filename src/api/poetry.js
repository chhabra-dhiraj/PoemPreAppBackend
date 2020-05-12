const express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    ps = require('python-shell'),
    db = require('../controllers/poetry_queries');

// Parse incoming requests data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/poems", async function (req, res) {

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
        if (err) throw err;
        let jsonString = JSON.parse(data);
        // console.log(data);
        console.log(jsonString);
        res.status(200).json(jsonString);
    });

    // res.status(200).json({
    //     beforeWords: ["hello", "dhiraj", "how", "are", "you"],
    //     afterWords: ["hi", "daman", "I", "am", "fine"]
    // });
});

router.post('/poetries', db.createPoetries)
router.put('/poetries/:id', db.updatePoetry)
router.delete('/poetries/:id', db.deletePoetry)

module.exports = router;