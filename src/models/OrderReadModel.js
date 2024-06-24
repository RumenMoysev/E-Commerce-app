const mongoose = require('mongoose')
const {OrderItemSchema} = require('./Order.js')

const OrderReadModelSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: {
        type: [OrderItemSchema],
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    paymentDetails: Object
})

const OrderReadModel = mongoose.model('OrderReadModel', OrderReadModelSchema)

module.exports = OrderReadModel