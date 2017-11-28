const express = require('express');
const router = express.Router();

const basic = require('../controllers/basic');
const auth = require('../controllers/auth');
const recipes = require('../controllers/recipes');

//Register & Login
router.post('/register', auth.register);
router.post('/login', auth.login);

//Authenticate recipe endpoints
router.all('/recipes/:id?', auth.authenticate);

//Recipe endpoints
router.get('/recipes/:id?', recipes.read);
router.post('/recipes', recipes.create);
router.put('/recipes', recipes.update);
router.delete('/recipes/:id', recipes.delete);

module.exports = router;
