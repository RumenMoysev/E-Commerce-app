const Event = require('../models/Event.js')

exports.saveEvent = async (event) => {
    const newEvent = new Event({
        type: event.constructor.name,
        data: event,
        timestamp: Date.now()
    })

    return await newEvent.save()
}