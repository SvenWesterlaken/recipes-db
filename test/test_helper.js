const mongoose = require('mongoose');
const mongodb = require('../config/mongo.db');

before((done) => {
  mongodb.connect(config.dbUrl, config.dbOptions).once('open', () => done() ).on('error', (err) => console.warn('Warning', error));
});

beforeEach((done) => {
  const { recipes, users } = mongoose.connection.collections;
  Promise.all([recipes.drop(), users.drop()]).then(() => done()).catch(() => done());
});
