const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    companyName: {
		type: String,
		required: [true, 'Please provide a company name'],
		minlength: 3,
		maxlength: 50,
	},
    position: {
		type: String,
		required: [true, 'Please provide a job title'],
	},
    location: {
		type: String,
		required: [true, 'Please provide a location'],

	},
	salary: {
		type: Number,
		required: false,
	},
    description: {
		type: String,
	},
    postedAt: { 
		type: Date,
		default: Date.now },
	appliedAt: {
		type: Date,
		default: null,
	},
	applied: {
		type: Boolean,
		default: false,
	},
	status:{
		type: String,
		enum: ['pending', 'interview', 'rejected', 'accepted'],
		default: 'pending',
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}
});

module.exports = mongoose.model('Job', JobSchema);
