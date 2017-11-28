const Recipe = require('../models/recipe');
const mongoose = require('mongoose');
const _ = require('lodash');

module.exports = {

  create(req, res, next) {
    let body = req.body

    if(_.isEmpty(body)) {
      res.status(422).json({ error: "Invalid recipes in body" });
    } else if (_.isArray(body)) {
      mongoose.connection.collections.recipes.drop();
      Recipe.create(body).then((recipes) => res.status(201).send(recipes)).catch((err) => next(err));
    } else {
      let recipe = new Recipe(body);
      recipe.save().then(() => res.sendStatus(201)).catch(err => next(err));
    }
  },

  read(req, res, next) {
    let id = req.params.id || '';

    if(id !== '') {
      Recipe.findById(id).then((recipe) => res.send(recipe)).catch((err) => next(err));
    } else {
      Recipe.find({}).then((recipes) => res.send(recipes)).catch((err) => next(err));
    }

  },

  delete(req, res, next) {
    let recipeId = req.params.id;

    Recipe.findByIdAndRemove(recipeId).then((recipe) => res.status(202).send(recipe)).catch((err) => next(err));
  },

  update(req, res, next) {
    let recipe = req.body;

    Recipe.findByIdAndUpdate(recipe._id, recipe).then(() => res.status(202).send(recipe)).catch((err) => next(err));
  }

}
