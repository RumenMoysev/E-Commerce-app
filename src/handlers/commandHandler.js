const { v4: uuidv4 } = require('uuid')

const eventManager = require('../managers/eventManager.js')
const OrderCreated = require('../events/orderCreated.js')
const OrderRepository = require('../repositories/orderRepository.js')
const OrderPaid = require('../events/orderPaid.js')

async function saveEventAndUpdateReadModel(event) {
    const newEvent = await eventManager.saveEvent(event)

    return await OrderRepository.update(newEvent)
}

exports.createOrder = async ({userId, items}) => {
    const orderId = uuidv4()
    const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0)

    const orderCreatedEvent = new OrderCreated(orderId, userId, items, totalAmount)
    const createdOrder = await saveEventAndUpdateReadModel(orderCreatedEvent)
    
    return createdOrder
}

exports.payOrder = async (orderId, totalAmount, paymentDetails) => {
    if(paymentDetails.hasEnoughMoney) {
        const orderPaidEvent = new OrderPaid(orderId, totalAmount, paymentDetails)
        const paidOrder = saveEventAndUpdateReadModel(orderPaidEvent)

        return await paidOrder
    } else {
        throw new Error("You don't have enough money")
    }
}