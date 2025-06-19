const express = require('express');
const router = express.Router();
const {
  getAllPizzas,
  addPizza,
  updatePizza,
  deletePizza,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Pizza management routes
router.route('/pizzas').get(protect, admin, getAllPizzas);
router.route('/add-pizza').post(protect, admin, addPizza);
router
  .route('/pizza/:id')
  .put(protect, admin, updatePizza)
  .delete(protect, admin, deletePizza);

module.exports = router;
