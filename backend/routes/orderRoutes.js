const express = require('express');
const router = express.Router();
const { createOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/create').post(protect, createOrder);
router.route('/status/:id').put(protect, admin, updateOrderStatus);

module.exports = router;
