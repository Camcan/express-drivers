var mongoose= require('mongoose')

module.exports = mongoose.model('Job', {
	loc: String,
	desc: String,
	details: String,
	sched: Date,
	assigned: Boolean,
	status: String,
	assigned_to: String,
	altered: Date

})
