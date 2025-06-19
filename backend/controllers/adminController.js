const Pizza = require('../models/Pizza');
const asyncHandler = require('express-async-handler');

// @desc    Fetch all pizzas
// @route   GET /api/admin/pizzas
// @access  Private/Admin
const getAllPizzas = asyncHandler(async (req, res) => {
  const pizzas = await Pizza.find({});
  res.json(pizzas);
});

// @desc    Add a new pizza
// @route   POST /api/admin/add-pizza
// @access  Private/Admin
const addPizza = asyncHandler(async (req, res) => {
  const { name, description, price, base, sauce, cheese, veggies, image } = req.body;

  const pizza = new Pizza({
    name,
    description,
    price,
    base,
    sauce,
    cheese,
    veggies,
    image,
  });

  const createdPizza = await pizza.save();
  res.status(201).json(createdPizza);
});

// @desc    Update a pizza
// @route   PUT /api/admin/pizza/:id
// @access  Private/Admin
const updatePizza = asyncHandler(async (req, res) => {
  const { name, description, price, base, sauce, cheese, veggies, image } = req.body;

  const pizza = await Pizza.findById(req.params.id);

  if (pizza) {
    pizza.name = name || pizza.name;
    pizza.description = description || pizza.description;
    pizza.price = price || pizza.price;
    pizza.base = base || pizza.base;
    pizza.sauce = sauce || pizza.sauce;
    pizza.cheese = cheese || pizza.cheese;
    pizza.veggies = veggies || pizza.veggies;
    pizza.image = image || pizza.image;

    const updatedPizza = await pizza.save();
    res.json(updatedPizza);
  } else {
    res.status(404);
    throw new Error('Pizza not found');
  }
});

// @desc    Delete a pizza
// @route   DELETE /api/admin/pizza/:id
// @access  Private/Admin
const deletePizza = asyncHandler(async (req, res) => {
  const pizza = await Pizza.findByIdAndDelete(req.params.id);

  if (!pizza) {
    res.status(404);
    throw new Error('Pizza not found');
  }

  res.json({ message: 'Pizza removed successfully' });
});

module.exports = {
  getAllPizzas,
  addPizza,
  updatePizza,
  deletePizza,
};
