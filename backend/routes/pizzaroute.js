const express = require('express');
const Router = express.Router();
const {getPizzas} = require("../controllers/pizzaController.js");

Router.get("/getallpizza", getPizzas);


module.exports = Router;