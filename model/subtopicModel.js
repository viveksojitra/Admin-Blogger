const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema({
    subtopic: {
        type: String,
        required: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subtopic', subtopicSchema);
