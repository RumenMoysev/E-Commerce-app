const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
})

const Event = mongoose.model('Event', EventSchema)

module.exports = Event