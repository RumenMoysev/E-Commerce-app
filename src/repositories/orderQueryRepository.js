const OrderReadModel = require('../models/OrderReadModel.js')

class OrderQueryRepository {
    async update(event) {
        switch(event.type) {
            case 'OrderCreated': {
                return await OrderReadModel.create({...event.data, status: 'Pending'})
            }
        }
    }

    async findById(orderId) {
        return await OrderReadModel.findOne({orderId})
    }

    async findByUserId(userId) {
        return await OrderReadModel.findOne({userId})
    }
}

module.exports = new OrderQueryRepository()