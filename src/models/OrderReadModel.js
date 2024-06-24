const mongoose = require('mongoose')
const {OrderItemSchema} = require('./OrderCommandModel.js')

const OrderReadModelSchema = new mongoose.Schema({
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
        required: true,
        ref: 'User'
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

const OrderReadModel = mongoose.model('QueryModelOrder', OrderReadModelSchema)

module.exports = OrderReadModel