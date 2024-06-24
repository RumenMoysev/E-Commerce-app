const mongoose = require('mongoose')

const OrderItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})

const OrderCommandSchema = new mongoose.Schema({
    items: {
        type: [OrderItemSchema],
        required: true
    },
    status: {
        type: String,
        default: 'Pending',
        required: true
    },
    totalAmount: Number,
    payment: {
        amount: Number,
        method: String
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const OrderCommandModel = mongoose.model('OrderCommandModel', OrderCommandSchema)

module.exports = {
    OrderCommandModel,
    OrderItemSchema
}