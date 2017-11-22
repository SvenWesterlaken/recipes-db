const mongoose = require('mongoose');
const config = require('./env');

function connect() {
  mongoose.Promise = global.Promise;

  mongoose.connect(config.dburl, config.dbOptions);
  return mongoose.connection;
}

module.exports = {
  connect
};
