const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path');

// Set up the express app
const app = express();

// Setting up the basic configuration.
app.use('/', express.static(path.join(__dirname, '../public')));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setting up the api routes
app.use(require('./api/index'));

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});