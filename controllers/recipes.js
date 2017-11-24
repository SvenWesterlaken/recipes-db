const Recipe = require('../models/recipe');
const mongoose = require('mongoose');
const _ = require('lodash');

module.exports = {

  create(req, res, next) {
    let recipes = req.body;

    console.log(recipes);

    if(_.isEmpty(recipes) || !_.isArray(recipes)) {
      res.status(422).json({ error: "Invalid recipes in body" });
    } else {
      mongoose.connection.collections.recipes.drop();
      Recipe.create(recipes).then((recipes) => res.send(recipes)).catch((err) => next());
    }
  },

  read(req, res, next) {

    Recipe.find({}).then((recipes) => {
      res.send(recipes);
    }).catch(() => next());

  }

}
