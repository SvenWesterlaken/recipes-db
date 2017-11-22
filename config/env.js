const env = {
    port: process.env.PORT || 8080,
    dbHost: process.env.DB_HOST || 'localhost',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'recipes-db',
    dbTestName: process.env.DB_TEST_NAME || 'recipes-test-db',
    allowOrigin: process.env.ALLOW_ORIGIN || 'http://localhost',
    secretkey: process.env.DB_SECRET_KEY || "SecretKeyForRecipesProgram-0287362-"
}

env.dbAuthentication = process.env.DB_AUTHENTICATION == 'true' ? true : false;

env.dbOptions = env.dbAuthentication ? {
  "useMongoClient": true,
  "poolSize": 10,
  "user": env.dbUser,
  "pass": env.dbPassword
} : {
  "useMongoClient": true,
  "poolSize": 10
}

env.dburl = process.env.NODE_ENV !== 'test' ? `mongodb://${env.dbHost}/${env.dbName}` : `mongodb://${env.dbHost}/${env.dbTestName}`;

module.exports = env;
