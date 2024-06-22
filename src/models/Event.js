const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    type: String,
    data: Object,
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

const Event = mongoose.model('Event', EventSchema)

module.exports = Event