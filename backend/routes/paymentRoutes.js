const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment, getRazorpayKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/razorpay-key').get(protect, getRazorpayKey);
router.route('/create-order').post(protect, createRazorpayOrder);
router.route('/verify-payment').post(protect, verifyPayment);

module.exports = router;
