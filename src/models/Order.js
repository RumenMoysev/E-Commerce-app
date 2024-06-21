const mongoose = require('mongoose')

const OrderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productQuantity: {
        type: Number,
        required: true
    }
})

const OrderSchema = new mongoose.Schema({
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
    }
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order