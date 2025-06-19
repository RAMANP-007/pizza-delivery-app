const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    razorpayOrderId: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        pizza: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
    }],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: { type: String, required: true, default: 'Received', enum: ['Received', 'In Kitchen', 'Sent for Delivery', 'Delivered'] },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
