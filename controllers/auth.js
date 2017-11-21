const bcrypt = require('bcryptjs');
const auth = require('../auth/auth');

const User = require('../models/user');

module.exports = {

  //Register
  register(req, res, next) {
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
  },

  //Login
  login(req, res, next) {
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
  },


  //Authentication
  authenticate(req, res, next) {
    let token = req.header('W-Access-Token') || '';

    auth.decodeToken(token, (err, payload) => {
      if(err) {
        res.status(err.status || 401).json({error: new Error("Not authorised").message });
      } else {
        next();
      }
    });
  }

}
