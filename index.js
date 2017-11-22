const express = require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');

const seeddata = require('./seeddata');
const basic = require('./controllers/basic');

const config = require('./config.json');
const port = process.env.PORT || config.webPort;


const app = express();

//Setup for mongoose
mongoose.Promise = global.Promise;

if(process.env.NODE_ENV !== 'test') {
  mongoose.connect(config.dbServer, config.dbOptions).catch((err) => console.log(err));
}

//Setup for auth & bodyparser
app.set('SECRET_KEY', config.secretkey);
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));

seeddata.seed();

//routes setup
app.use('/api/v1', require('./routes/api_v1'));

//Error handler
app.use((err, req, res, next) => {
  res.status(422).send({ name: err.name, code: err.code, message: err.message, status: err.status });
});

app.all('*', basic.notFound);

app.listen(config.webPort, () => {
  console.log('Running on port:'+ config.webPort);
});

module.exports = app;
