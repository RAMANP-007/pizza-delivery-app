const express = require('express');
const router = express.Router();

const { getPizzas, getPizzaOptions, createPizza } = require('../controllers/pizzaController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getPizzas).post(protect, admin, createPizza);
router.route('/options').get(getPizzaOptions);

module.exports = router;
