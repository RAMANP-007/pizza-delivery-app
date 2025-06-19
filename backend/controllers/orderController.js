const Order = require('../models/Order');
const Pizza = require('../models/Pizza');
const Inventory = require('../models/Inventory');
const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('express-async-handler');

const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Fetch pizza details and calculate prices on the server
    const itemsWithPrices = await Promise.all(
        orderItems.map(async (item) => {
            const pizza = await Pizza.findById(item.pizza);
            if (!pizza) {
                res.status(404);
                throw new Error(`Pizza not found: ${item.pizza}`);
            }

            const variant = pizza.variants.find(v => v.name === item.varient);
            if (!variant) {
                res.status(400);
                throw new Error(`Variant '${item.varient}' not found for pizza '${pizza.name}'`);
            }
            const price = variant.price;
            if (price === undefined) {
                res.status(400);
                throw new Error(`Price for varient '${item.varient}' not found for pizza '${pizza.name}'`);
            }

            return {
                name: pizza.name,
                image: pizza.image,
                price: price,
                pizza: item.pizza,
                quantity: item.quantity,
                varient: item.varient,
            };
        })
    );

    // Calculate total price on the server
    const totalPrice = itemsWithPrices.reduce((acc, item) => acc + item.quantity * item.price, 0);

    // Check inventory and update stock
    const inventory = await Inventory.findOne({});
    if (!inventory) {
        res.status(500);
        throw new Error('Inventory not found. Cannot process order.');
    }

    // First, check if all items are available
    for (const item of itemsWithPrices) {
        const pizzaInInventory = inventory.pizzas.find(p => p.pizzaId.toString() === item.pizza.toString());
        if (!pizzaInInventory || pizzaInInventory.stock < item.quantity) {
            res.status(400);
            throw new Error(`Not enough stock for ${item.name} (${item.varient}). Available: ${pizzaInInventory ? pizzaInInventory.stock : 0}.`);
        }
    }

    // If all items are available, proceed to create order and decrement stock
    for (const item of itemsWithPrices) {
        const pizzaInInventory = inventory.pizzas.find(p => p.pizzaId.toString() === item.pizza.toString());
        if (pizzaInInventory) {
            pizzaInInventory.stock -= item.quantity;

            // Low stock alert
            if (pizzaInInventory.stock <= 10 && process.env.ADMIN_EMAIL) {
                try {
                    await sendEmail({
                        to: process.env.ADMIN_EMAIL,
                        subject: 'Low Stock Alert!',
                        text: `The stock for pizza "${item.name}" is low. Current stock: ${pizzaInInventory.stock}.`,
                    });
                } catch (emailError) {
                    console.error('Failed to send low stock email:', emailError);
                }
            }
        }
    }

    const order = new Order({
        user: req.user._id,
        orderItems: itemsWithPrices.map(i => ({
            name: i.name,
            quantity: i.quantity,
            image: i.image,
            price: i.price,
            pizza: i.pizza,
        })),
        shippingAddress,
        paymentMethod,
        totalPrice,
    });

    await inventory.save();
    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
});


const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

module.exports = { createOrder, updateOrderStatus };
