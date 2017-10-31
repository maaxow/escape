var mongoose = require('mongoose');

module.exports = mongoose.model('History', {
	date: {
		type: Date,
		default: new Date()
	},
	team: {
		type: String,
		default: ''
	},
	time: {
		type: Date,
		default: new Date().getTime()
	},
	comment: {
		type : String,
		default: ''
	}
});
