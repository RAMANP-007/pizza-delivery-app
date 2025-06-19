const Inventory = require('../models/Inventory');
const Pizza = require('../models/Pizza');
const asyncHandler = require('express-async-handler');

const getPizzas = asyncHandler(async (req, res) => {
    const pizzas = await Pizza.find({});
    res.json(pizzas);
});

const getPizzaOptions = asyncHandler(async (req, res) => {
    const inventory = await Inventory.findOne({});
    if (inventory && inventory.ingredients) {
        res.json(inventory.ingredients);
    } else {
        res.status(404);
        throw new Error('Pizza options not found');
    }
});

const createPizza = asyncHandler(async (req, res) => {
    const { name, variants, description, category, image } = req.body;

    const pizza = new Pizza({
        name,
        variants,
        description,
        category,
        image,
    });

    const createdPizza = await pizza.save();
    res.status(201).json(createdPizza);
});

module.exports = { getPizzas, getPizzaOptions, createPizza };