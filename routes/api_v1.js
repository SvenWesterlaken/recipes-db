const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../auth/auth');
const Recipe = require('../models/recipe');


router.get('/recipes', (req, res, next) => {
  Recipe.find({}).then((recipes) => {
    res.send(recipes);
  }).catch(() => next());
});

router.get('*', (req, res) => {
  res.status(404);
  res.json({"msg": "Api endpoint not available"});
});

module.exports = router;
