const razorpay = require('../utils/razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');

const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    if (order.isPaid) {
        res.status(400);
        throw new Error('Order already paid');
    }

    const options = {
        amount: order.totalPrice * 100, // amount in the smallest currency unit
        currency: 'INR',
        receipt: order._id.toString(),
    };

    try {
        const razorpayOrder = await razorpay.orders.create(options);
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();
        res.json(razorpayOrder);
    } catch (error) {
        res.status(500);
        throw new Error('Could not create Razorpay order');
    }
});

const verifyPayment = asyncHandler(async (req, res) => {
    const { order_id, payment_id, signature, orderId } = req.body;

    const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(order_id + '|' + payment_id)
        .digest('hex');

    if (generated_signature === signature) {
        const order = await Order.findById(orderId);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: payment_id,
                status: 'completed',
                update_time: new Date().toISOString(),
                email_address: req.user.email,
            };

            await order.save();
            res.json({ message: 'Payment verified successfully' });
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } else {
        res.status(400);
        throw new Error('Payment verification failed');
    }
});

const getRazorpayKey = asyncHandler(async (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
});

module.exports = { createRazorpayOrder, verifyPayment, getRazorpayKey };
