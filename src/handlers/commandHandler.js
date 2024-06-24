const { v4: uuidv4 } = require('uuid')

const eventManager = require('../managers/eventManager.js')
const OrderCreated = require('../events/orderCreated.js')
const OrderCommandRepository = require('../repositories/orderCommandRepository.js')

exports.createOrder = async ({userId, items}) => {
    const orderId = uuidv4()
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0)
    const order = {
        orderId: orderId,
        userId: userId,
        items,
        totalAmount,
        status: 'Pending'
    }

    const orderCreatedEvent = new OrderCreated(orderId, userId, items, totalAmount)
    await eventManager.saveEvent(orderCreatedEvent)

    const createdOrder = await OrderCommandRepository.save(order)
    
    return createdOrder
}