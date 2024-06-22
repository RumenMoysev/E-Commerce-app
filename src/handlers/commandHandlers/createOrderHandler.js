const { v4: uuidv4 } = require('uuid')

const eventManager = require('../../managers/eventManager.js')
const OrderCreated = require('../../events/orderCreated.js')
const OrderRepository = require('../../repositories/orderRepository.js')

exports.createOrder = async ({userId, items}) => {
    const orderId = uuidv4()
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0)
    const order = {
        id: orderId,
        userId: userId,
        items,
        totalAmount,
        status: 'Pending'
    }

    const orderCreatedEvent = new OrderCreated(orderId, userId, items, totalAmount)
    await eventManager.saveEvent(orderCreatedEvent)

    const createdOrder = await OrderRepository.save(order)
    
    return createdOrder
}