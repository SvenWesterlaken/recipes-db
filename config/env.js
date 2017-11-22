var env = {
    webPort: process.env.PORT || 8080,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'recipes-db',
    "secretkey": "SecretKeyForRecipesProgram-0287362-"
}

let test = {
    "dbTestServer": "mongodb://sven.westerlaken:83mkU&n5@ds042677.mlab.com:42677/recipes-test-db",
    "dbOptions": {
        "useMongoClient": true,
        "poolSize": 10,
        "user": "admin",
        "pass": "123admin"
    }
};

var dburl = process.env.NODE_ENV === 'production' ?
    'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
    'mongodb://localhost/' + env.dbDatabase

module.exports = {
    env: env,
    test: test,
    dburl: dburl
};