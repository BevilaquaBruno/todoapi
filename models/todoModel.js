const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
	name: { type: String, default: 'Unknow' },
	description: { type: String },
	done: { type: Boolean, default: false },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' }
}, {
	timestamps: true
});

module.exports = mongoose.model('Todo', TodoSchema);