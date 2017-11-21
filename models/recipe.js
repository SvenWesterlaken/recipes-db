const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  name: String,
  amount: Number
});

const RecipeSchema = new Schema({
  name: String,
  description: String,
  imagePath: String,
  ingredients: [IngredientSchema]
});

const Recipe = mongoose.model('recipe', RecipeSchema);

module.exports = Recipe;
