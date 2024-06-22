const Event = require('../models/Event.js')

exports.saveEvent = async (event) => {
    const newEvent = new Event({
        type: event.constructor.name,
        data: event
    })

    await newEvent.save()

    //TODO update the readModel
}

exports.getEvents = () => Event.find()