const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., 'Small', 'Medium', 'Large'
    price: { type: Number, required: true },
});

const pizzaSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    variants: [variantSchema],
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Pizza', pizzaSchema);
