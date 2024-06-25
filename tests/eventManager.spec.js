const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const eventManager = require('../src/managers/eventManager.js')
const OrderCreated = require('../src/events/orderCreated.js');
const OrderPaid = require('../src/events/orderPaid.js');
const OrderConfirmed = require('../src/events/orderConfirmed.js');
const OrderDelivered = require('../src/events/orderDelivered.js');
const OrderCancelled = require('../src/events/orderCancelled.js');

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

const orderId = '123'

describe('Event Manager test', () => {
    it('should create OrderCreated event with correct properties', async () => {
        const userId = '456'
        const items = [
            {
                id: "1",
                name: "GPU",
                price: 1000,
                quantity: 1
            }
        ]
        const totalAmount = 1000

        const event = new OrderCreated(orderId, userId, items, totalAmount)
        await eventManager.saveEvent(event)
        
        const events = await eventManager.getEvents()

        expect(events).toHaveLength(1)
        expect(events[0].type).toBe('OrderCreated')
        expect(events[0].data).toMatchObject({orderId, userId, items, totalAmount})
    })

    it('should create OrderPaid event with correct properties', async () => {
        const totalAmount = 1000
        const paymentDetails = {
            paymentType: "card",
            hasEnoughMoney: true,
            streetForDelivery: "ul. Nqkoq si"
        }

        const event = new OrderPaid(orderId, totalAmount, paymentDetails)
        await eventManager.saveEvent(event)

        const events = await eventManager.getEvents()

        expect(events).toHaveLength(2)
        expect(events[1].type).toBe('OrderPaid')
        expect(events[1].data).toMatchObject({ orderId, totalAmount, paymentDetails })
    })

    it('should create OrderConfirmed event with correct properties', async () => {
        const streetForDelivery = "ul. Nqkoq si"

        const event = new OrderConfirmed(orderId, streetForDelivery)
        await eventManager.saveEvent(event)

        const events = await eventManager.getEvents()

        expect(events).toHaveLength(3)
        expect(events[2].type).toBe('OrderConfirmed')
        expect(events[2].data).toMatchObject({ orderId, streetForDelivery })
    })

    it('should create OrderDelivered event with correct properties', async () => {
        const streetForDelivery = "ul. Nqkoq si"

        const event = new OrderDelivered(orderId, streetForDelivery)
        await eventManager.saveEvent(event)

        const events = await eventManager.getEvents()

        expect(events).toHaveLength(4)
        expect(events[3].type).toBe('OrderDelivered')
        expect(events[3].data).toMatchObject({ orderId, streetForDelivery })
    })

    it('should create OrderCancelled event with correct properties', async () => {
        const userId = '456'
        const items = [
            {
                id: "1",
                name: "GPU",
                price: 1000,
                quantity: 1
            }
        ]
        const totalAmount = 1000

        const event = new OrderCancelled(orderId, userId, items, totalAmount)
        await eventManager.saveEvent(event)

        const events = await eventManager.getEvents()

        expect(events).toHaveLength(5)
        expect(events[4].type).toBe('OrderCancelled')
        expect(events[4].data).toMatchObject({ orderId, userId, items, totalAmount })
    })
})