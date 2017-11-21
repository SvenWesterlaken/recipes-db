const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  name: String,
  amount: Number
});

const RecipeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  ingredients: {
    type: [IngredientSchema],
    required: true,
  }
});

const Recipe = mongoose.model('recipe', RecipeSchema);

module.exports = Recipe;
