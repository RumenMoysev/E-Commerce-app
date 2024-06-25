const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const commandHandler = require('../src/handlers/commandHandler.js')
const queryHandler = require('../src/handlers/queryHandler.js')
const eventManager = require('../src/managers/eventManager.js')

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

const userId = '652d7b6b5a6b514a8d2fb3c7';
const items = [
    {
        id: "1",
        name: "GPU",
        price: 1000,
        quantity: 1
    }
]
const totalAmount = 1000

describe('OrderHandler correct behaviour tests', () => {
    it('Should create an OrderCreated event, an order and save them', async () => {
        const createdOrder = await commandHandler.createOrder({userId, items})
        
        expect(createdOrder).toMatchObject({items, totalAmount})
        expect(createdOrder.userId == userId).toBe(true)

        const savedOrder = await queryHandler.findByUserId(userId)
        const orderId = savedOrder[0].orderId

        expect(savedOrder[0].userId == userId).toBe(true)
        expect(savedOrder[0].items[0]).toHaveProperty('id', items[0].id)
        expect(savedOrder[0].items[0]).toHaveProperty('name', items[0].name)
        expect(savedOrder[0].items[0]).toHaveProperty('price', items[0].price)
        expect(savedOrder[0].items[0]).toHaveProperty('quantity', items[0].quantity)
        expect(savedOrder[0]).toHaveProperty('totalAmount', totalAmount);
        expect(savedOrder[0]).toHaveProperty('status', 'Pending');

        const events = await eventManager.getEvents()

        expect(events).toHaveLength(1)
        expect(events[0].type).toBe('OrderCreated')
        expect(events[0].data).toMatchObject({ orderId, userId, items, totalAmount })
    })

    it('Should create an OrderPaid event, pay an order, and save them', async () => {
        const orders = await queryHandler.findByUserId(userId)

        const orderId = orders[0].orderId
        const paymentDetails = {
            paymentType: "card",
            hasEnoughMoney: true,
            streetForDelivery: "ul. Nqkoq si"
        }

        const paidOrder = await commandHandler.payOrder(orderId, totalAmount, paymentDetails)

        expect(paidOrder).toHaveProperty('status', 'Waiting for confirmation')
        expect(paidOrder.paymentDetails).toMatchObject(paymentDetails)

        const savedOrder = await queryHandler.findByUserId(userId)

        expect(savedOrder[0]).toHaveProperty('status', 'Waiting for confirmation');

        const events = await eventManager.getEvents()

        expect(events).toHaveLength(2)
        expect(events[1].type).toBe('OrderPaid')
        expect(events[1].data).toMatchObject({ orderId, totalAmount, paymentDetails })
    })

    it('Should create an OrderConfirmed event, confirm an order, and save them', async () => {
        const orders = await queryHandler.findByUserId(userId)

        const orderId = orders[0].orderId
        const streetForDelivery = "ul. Nqkoq si"
        
        const confirmedOrder = await commandHandler.confirmOrder(orderId)

        expect(confirmedOrder).toHaveProperty('status', 'Confirmed')

        const savedOrder = await queryHandler.findByUserId(userId)

        expect(savedOrder[0]).toHaveProperty('status', 'Confirmed');

        const events = await eventManager.getEvents()

        expect(events).toHaveLength(3)
        expect(events[2].type).toBe('OrderConfirmed')
        expect(events[2].data).toMatchObject({ orderId, streetForDelivery })
    })

    it('Should create an OrderDelivered event, deliver an order, and save them', async () => {
        const orders = await queryHandler.findByUserId(userId)

        const orderId = orders[0].orderId
        const streetForDelivery = "ul. Nqkoq si"
        
        const deliveredOrder = await commandHandler.deliverOrder(orderId)

        expect(deliveredOrder).toHaveProperty('status', 'Delivered')

        const savedOrder = await queryHandler.findByUserId(userId)

        expect(savedOrder[0]).toHaveProperty('status', 'Delivered');

        const events = await eventManager.getEvents()

        expect(events).toHaveLength(4)
        expect(events[3].type).toBe('OrderDelivered')
        expect(events[3].data).toMatchObject({ orderId, streetForDelivery })
    })
})

async function createOrder() {
    await commandHandler.createOrder({ userId, items })
}

describe('Order hanlder incorrect behaviour tests', () => {
    it('Should create an order and cancel it, and create appropriate events', async () => {
        await createOrder()

        const savedOrders = await queryHandler.findByUserId(userId)
        const savedOrder = savedOrders[1]
        const orderId = savedOrder.orderId

        await commandHandler.cancelOrder(savedOrder, orderId)

        const savedOrdersAfterCancellation = await queryHandler.findByUserId(userId)

        expect(savedOrdersAfterCancellation).toHaveLength(1)

        const events = await eventManager.getEvents()

        expect(events).toHaveLength(6)
        expect(events[4].type).toBe('OrderCreated')
        expect(events[4].data).toMatchObject({ orderId, userId, items, totalAmount })
        expect(events[5].data).toMatchObject({ orderId, items, totalAmount })
        expect(events[5].data.userId == userId).toBe(true)
    })

    it('Should create an order, pay it and cancel it, and create appropriate events', async () => {
        await createOrder()

        const totalAmount = 1000
        const paymentDetails = {
            paymentType: "card",
            hasEnoughMoney: true,
            streetForDelivery: "ul. Nqkoq si"
        }

        const savedOrders = await queryHandler.findByUserId(userId)
        const savedOrder = savedOrders[1]
        const orderId = savedOrder.orderId

        await commandHandler.payOrder(orderId, totalAmount, paymentDetails)
        await commandHandler.cancelOrder(savedOrder, orderId)

        const savedOrdersAfterCancellation = await queryHandler.findByUserId(userId)

        expect(savedOrdersAfterCancellation).toHaveLength(1)

        const events = await eventManager.getEvents()

        expect(events).toHaveLength(9)
        expect(events[6].type).toBe('OrderCreated')
        expect(events[6].data).toMatchObject({ orderId, userId, items, totalAmount })
        expect(events[7].type).toBe('OrderPaid')
        expect(events[7].data).toMatchObject({ orderId, totalAmount, paymentDetails })
        expect(events[8].data).toMatchObject({ orderId, items, totalAmount })
        expect(events[8].data.userId == userId).toBe(true)
    })

    it('Should create an order, pay it, confirm it and try to cancel it, and create appropriate events', async () => {
        await createOrder()

        const totalAmount = 1000
        const paymentDetails = {
            paymentType: "card",
            hasEnoughMoney: true,
            streetForDelivery: "ul. Nqkoq si"
        }

        const savedOrders = await queryHandler.findByUserId(userId)
        const savedOrder = savedOrders[1]
        const orderId = savedOrder.orderId

        await commandHandler.payOrder(orderId, totalAmount, paymentDetails)
        await commandHandler.confirmOrder(orderId)

        const updatedOrders = await queryHandler.findByUserId(userId)
        const updatedOrder = updatedOrders[1]

        await expect(commandHandler.cancelOrder(updatedOrder, orderId)).rejects.toThrow("You can't cancel this order");

        const savedOrdersAfterCancellation = await queryHandler.findByUserId(userId)

        expect(savedOrdersAfterCancellation).toHaveLength(2)

        const events = await eventManager.getEvents()

        expect(events).toHaveLength(12)
        expect(events[9].type).toBe('OrderCreated')
        expect(events[9].data).toMatchObject({ orderId, userId, items, totalAmount })
        expect(events[10].type).toBe('OrderPaid')
        expect(events[10].data).toMatchObject({ orderId, totalAmount, paymentDetails })
        expect(events[11].type).toBe('OrderConfirmed')
        expect(events[11].data).toMatchObject({ orderId, streetForDelivery: paymentDetails.streetForDelivery })
    })

    it('Should create an order, pay it, confirm it, deliver it and try to cancel it, and create appropriate events', async () => {
        await createOrder()

        const totalAmount = 1000
        const paymentDetails = {
            paymentType: "card",
            hasEnoughMoney: true,
            streetForDelivery: "ul. Nqkoq si"
        }

        const savedOrders = await queryHandler.findByUserId(userId)
        const savedOrder = savedOrders[2]
        const orderId = savedOrder.orderId

        await commandHandler.payOrder(orderId, totalAmount, paymentDetails)
        await commandHandler.confirmOrder(orderId)
        await commandHandler.deliverOrder(orderId)

        const updatedOrders = await queryHandler.findByUserId(userId)
        const updatedOrder = updatedOrders[2]

        await expect(commandHandler.cancelOrder(updatedOrder, orderId)).rejects.toThrow("You can't cancel this order");

        const savedOrdersAfterCancellation = await queryHandler.findByUserId(userId)

        expect(savedOrdersAfterCancellation).toHaveLength(3)

        const events = await eventManager.getEvents()

        expect(events).toHaveLength(16)
        expect(events[12].type).toBe('OrderCreated')
        expect(events[12].data).toMatchObject({ orderId, userId, items, totalAmount })
        expect(events[13].type).toBe('OrderPaid')
        expect(events[13].data).toMatchObject({ orderId, totalAmount, paymentDetails })
        expect(events[14].type).toBe('OrderConfirmed')
        expect(events[14].data).toMatchObject({ orderId, streetForDelivery: paymentDetails.streetForDelivery })
        expect(events[15].type).toBe('OrderDelivered')
        expect(events[15].data).toMatchObject({ orderId, streetForDelivery: paymentDetails.streetForDelivery })
    })
})