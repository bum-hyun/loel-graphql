require('dotenv').config();

module.exports = {
  development: {
    "username": "loel",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "loel",
    "host": "127.0.0.1",
    "dialect": "mysql",
  },
  test: {
    "username": "loel",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "loel",
    "host": "127.0.0.1",
    "dialect": "mysql",
  },
  production: {
    "username": "loel",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "loel",
    "host": "127.0.0.1",
    "dialect": "mysql",
    logging: false
  }
}
