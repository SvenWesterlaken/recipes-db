const express = require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config.json');
const port = process.env.PORT || config.webPort;

const app = express();

//Setup for mongoose
mongoose.Promise = global.Promise;

if(process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://' + config.dbServer + '/' + config.dbName);
}

//Setup for auth & bodyparser
app.set('SECRET_KEY', config.secretkey);
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));


//routes setup
app.use('/api/v1', require('./routes/api_v1'));

app.all('*', function(req, res) {
  res.contentType('application/json');
  res.status(404);
  res.json({"error": "Request endpoint not found"});
});

app.listen(8080, () => {
  console.log('Running on port 8080');
});