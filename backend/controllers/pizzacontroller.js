const Inventory = require('../models/Inventory');
const Pizza = require('../models/Pizza');
const asyncHandler = require('express-async-handler');

const getPizzas = asyncHandler(async (req, res) => {
    try {
        console.log('Attempting to fetch pizzas...');
        const pizzas = await Pizza.find({});
        console.log(`Found ${pizzas.length} pizzas.`);
        if (pizzas.length === 0) {
            console.log('The Pizza collection is empty.');
        }
        res.json(pizzas);
    } catch (error) {
        console.error('Error in getPizzas controller:', error);
        res.status(500).json({ message: 'Failed to fetch pizzas due to a server error.' });
    }
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