var express = require("express")
var mongoose = require('mongoose')
var morgan = require("morgan") // For logging HTTP req's
var bodyParser = require("body-parser") // For pulling JSON from POST req

var app = express()

// Setup ==============

var db = require('./config/db');

app.use(express.static(__dirname + '/public')) // Sets "/public/*" to "/*"
app.use(morgan('dev')) // Morgan only works while in development
app.use(bodyParser.urlencoded({'extended':'true'}))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

// Routes ============
require('./app/routes')(app) 
mongoose.connect(db.url)

// Start App =========

app.listen(8080);
console.log("You'll find magic happening on port 8080");

