const express = require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');

const seeddata = require('./seeddata');
const basic = require('./controllers/basic');

const config = require('./config/env');
const port = process.env.PORT || config.env.webPort;


const app = express();

//Setup for mongoose
mongoose.Promise = global.Promise;

if(process.env.NODE_ENV !== 'test') {
  mongoose.connect(config.dburl).catch((err) => console.log(err));
}

//Setup for auth & bodyparser
app.set('SECRET_KEY', config.env.secretkey);
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

//Configuring app
app.set('port', (process.env.PORT | config.env.webPort));
app.set('env', (process.env.ENV | 'development'))

// CORS headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || 'http://localhost:8080');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

seeddata.seed();

//routes setup
app.use('/api/v1', require('./routes/api_v1'));

//Error handler
app.use((err, req, res, next) => {
  res.status(422).send({ name: err.name, code: err.code, message: err.message, status: err.status });
});

app.all('*', basic.notFound);

app.listen(port, () => {
  console.log('Running on port:'+ port);
});

module.exports = app;
