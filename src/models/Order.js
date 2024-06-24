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

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
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
        default: 'Pending',
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentDetails: {
        type: {
            paymentType: {
                type: String,
                required: true
            },
            hasEnoughMoney: {
                type: Boolean,
                required: true
            },
            streetForDelivery: {
                type: String,
                required: true
            }
        }
    }
})

const Order = mongoose.model('Order', OrderSchema)

module.exports = Order