const mongoose = require('mongoose');
const config = require('../config.json');

before((done) => {
  mongoose.connect(config.dbTestServer, config.dbOptions);
  mongoose.connection.once('open', () => done() ).on('error', (err) => {
    console.warn('Warning', error);
  });
});

beforeEach((done) => {
  const { recipes, users } = mongoose.connection.collections;
  Promise.all([recipes.drop(), users.drop()]).then(() => done()).catch(() => done());
});
