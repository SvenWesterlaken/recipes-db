const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../auth/auth');

const Recipe = require('../models/recipe');
const User = require('../models/user');

router.post('/register', (req, res) => {
  const saltRounds = 10;

  let email = req.body.email || '';
  let password = req.body.password || '';

  if(email != '' || password != '') {
    User.findOne({ email: email }).then((user) => {

      if(!user) {

        let user = new User({ email: email, password: bcrypt.hashSync(password) });
        user.save();
        res.status(200).json({ msg: "User succesfully registered"});

      } else {
        res.status(401).json({error: "User already exists"});
      }

    }).catch((err) => {
      console.log(err);
      res.status(402).json({error: "Oops, something went wrong"});
    });

  } else {
    res.status(401).json({error: "Invalid Registration Credentials"});
  }



});

router.post('/login', (req, res) => {
  let email = req.body.email || '';
  let password = req.body.password || '';

  if(email != '' || password != '') {

    User.findOne({ email: email }).then((user) => {

      if(user) {

        if(bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ token: auth.encodeToken(email) });
        } else {
          res.status(401).json({ error: "Invalid password"});
        }

      } else {
        res.status(401).json({error: "User not found"});
      }

    }).catch((err) => {
      console.log(err);
      res.status(402).json({error: "Oops, something went wrong"});
    });

  } else {
    res.status(401).json({error: "Invalid Registration Credentials"});
  }

});

router.all('/recipes/*', (req, res, next) => {
  let token = req.header('W-Access-Token') || '';

  auth.decodeToken(token, (err, payload) => {
    if(err) {
      res.status(err.status || 401).json({error: new Error("Not authorised").message });
    } else {
      next();
    }
  });
})

router.get('/recipes', (req, res) => {
  Recipe.find({}).then((recipes) => {
    res.send(recipes);
  }).catch(() => next());
});

router.get('*', (req, res) => {
  res.status(404);
  res.json({"msg": "Api endpoint not available"});
});

module.exports = router;
