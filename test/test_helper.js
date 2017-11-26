const mongoose = require('mongoose');
const mongodb = require('../config/mongo.db');
const config = require('../config/env');

before((done) => {
  mongodb.connect(config.dbUrl, config.dbOptions).once('open', () => done() ).on('error', (err) => console.warn('Warning', err));
});

beforeEach((done) => {
  const { recipes, users } = mongoose.connection.collections;
  Promise.all([recipes.drop(), users.drop()]).then(() => done()).catch(() => done());
});
