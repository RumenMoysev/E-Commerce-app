const queryHandler = require('../handlers/queryHandler.js')
const Event = require('../models/Event.js')

exports.saveEvent = async (event) => {
    const newEvent = new Event({
        type: event.constructor.name,
        data: event
    })

    await newEvent.save()

    await queryHandler.update(newEvent)
}

exports.getEvents = () => Event.find()