const mongoose = require('mongoose');
const config = require('../config.json');

before((done) => {
  mongoose.connect('mongodb://' + config.dbServer + '/' + config.dbTestName, config.dbOptions);
  connection.once('open', () => done() ).on('error', (err) => {
    console.warn('Warning', error);
  });
});

beforeEach((done) => {
  const { recipes } = mongoose.connection.collections;
  recipes.drop().then( () => done()).catch(() => done()); 
});
