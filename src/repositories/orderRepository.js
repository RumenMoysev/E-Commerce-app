const Order = require('../models/Order.js')

class OrderQueryRepository {
    async update(event) {
        switch(event.type) {
            case 'OrderCreated': {
                return await Order.create({...event.data, status: 'Pending'})
            }
            case 'OrderPaid': {
                return await Order.findOneAndUpdate({orderId: event.data.orderId}, {status: 'Waiting for confirmation', paymentDetails: event.data.paymentDetails}, {new: true})
            }
        }
    }

    async findById(orderId) {
        return await Order.findOne({orderId})
    }

    async findByUserId(userId) {
        return await Order.find({userId})
    }
}

module.exports = new OrderQueryRepository()