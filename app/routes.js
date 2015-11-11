// Routes ===============
var Job = require('./models/job')

// API ------------
module.exports = function(app){

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
		loc: req.body.loc,
		desc: req.body.desc,
		sched: req.body.sched,
		status: req.body.stat || "Incomplete",
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

			job._id = req.body._id
			job.loc = req.body.loc
			job.desc = req.body.desc,
			job.details = req.body.details
			job.sched =  req.body.sched,
			job.assigned = req.body.assigned || false,
			job.status = req.body.assigned,
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

	app.get('/partials/:template', function(req, res){
		res.sendfile('./public/views/partials/' + req.params.template)
	})

	app.get('*', function(req, res) {
	    res.sendfile('./public/views/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

	// app.get('/myjobs', function(req, res){
	// 	res.sendfile('./public/views')
	// })
}