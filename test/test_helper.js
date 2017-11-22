const mongoose = require('mongoose');
const config = require('../config/env');

before((done) => {
  mongoose.connect(config.test.dbTestServer, config.test.dbOptions);
  mongoose.connection.once('open', () => done() ).on('error', (err) => {
    console.warn('Warning', error);
  });
});

beforeEach((done) => {
  const { recipes, users } = mongoose.connection.collections;
  Promise.all([recipes.drop(), users.drop()]).then(() => done()).catch(() => done());
});
