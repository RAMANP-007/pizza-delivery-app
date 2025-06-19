const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    pizzas: [{
        pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
        stock: { type: Number, required: true, default: 0 }
    }],
    ingredients: {
        bases: [{ name: String, stock: Number }],
        sauces: [{ name: String, stock: Number }],
        cheeses: [{ name: String, stock: Number }],
        veggies: [{ name: String, stock: Number }],
        meats: [{ name: String, stock: Number }],
    }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
