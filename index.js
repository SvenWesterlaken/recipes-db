const express = require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');

const mongodb = require('./config/mongo.db');
const seeddata = require('./config/seeddata');
const config = require('./config/env');

const basic = require('./controllers/basic');

const app = express();

if(process.env.NODE_ENV !== 'test') {
  mongodb.connect()
    .once('open', () =>  console.log('Connected to Mongo'))
    .on('error', (error) => console.warn('Warning', error.toString()));

  seeddata.seed();
}


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.allowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,W-Access-Token');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if ('OPTIONS' == req.method) {
      res.sendStatus(204);
    }
    else {
      next();
    }
});

app.set('SECRET_KEY', config.secretkey);
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

//routes setup
app.use('/api/v1', require('./routes/api_v1'));

//Error handler
app.use((err, req, res, next) => {
  res.status(422).send({ name: err.name, code: err.code, message: err.message, status: err.status });
});

app.all('*', basic.notFound);

app.listen(config.port, () => {
  console.log(`Running on port: ${config.port}`);
});

module.exports = app;
