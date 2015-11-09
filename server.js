var express = require("express")
var mongoose = require("mongoose")
var morgan = require("morgan") // For logging HTTP req's
var bodyParser = require("body-parser") // For pulling JSON from POST req

var app = express()

// Setup ==============

mongoose.connect('mongodb://localhost:27017')

app.use(express.static(__dirname + '/public')) // Sets "/public/*" to "/*"
app.use(morgan('dev')) // Morgan only works while in development
app.use(bodyParser.urlencoded({'extended':'true'}))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

app.listen(8080);
console.log("You'll find magic happening on port 8080");

// Models

var Job = mongoose.model('Job', {
	location: String,
	description: String,
	schedule: Date,
	assigned: Boolean,
	completed: Boolean,
	assigned_to: String,
	altered: Date
})


// Routes ===============


// API ------------

if (!Date.now) { // DateTime shim for < IE8
	Date.now = function() { 
		return Math.floor(new Date().getTime() / 1000) 
	}
}

app.get('/api/jobs', function(req, res){
	Job.find(function(err, jobs){
		if (err) res.send(err);
		// else 
		res.json(jobs)

	})
})

app.post('/api/jobs', function(req, res) {
	Job.create({
	location: req.body.loc,
	description: req.body.desc,
	schedule: req.body.schedule,
	completed: false,
	assigned_to: req.body.assigned_to || null,
	altered: Date.now(),
	}, function(err, job){
		if (err) res.send(err);
		// Respond w/ an error, or return full list of jobs
		Job.find(function(err, jobs){
			if (err) res.send(err);

			res.json(jobs);
		})
	})
})



app.put('/api/jobs/:job_id', function(req, res){
	Job.findById(req.params.job_id, function(err, job){
		if (!job) res.send(err);

		job.location = req.body.loc
		job.description = req.body.desc,
		job.schedule =  req.body.schedule,
		job.assigned = req.body.assigned || false,
		job.completed = false,
		job.assigned_to = req.body.assigned_to || null,
		job.altered = Date.now(),
		

		job.save(function(err){
		    if(err) res.send(err);
		})

		Job.find(function(err, jobs){
			if (err) res.send(err);

			res.json(jobs)
		})
	})
})


app.delete('/api/jobs/:job_id', function(req, res){
	Job.remove({
		_id : req.params.job_id 
	}, function(err, job){
		if (err) res.send(err);
		// else
		Job.find(function(err, jobs){
			if (err) res.send(err);

			res.json(jobs)
		})

	})
})

// Front end ------
 app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });







