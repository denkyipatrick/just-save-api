'use strict';

module.exports = {
  development: {
    username: 'root',
    password: 'Tjnqmf%root2018',
    database: 'justsave_db_2',
    // database: 'just_save_dev_db_1',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    operatorsAliases: false,
  },
  test: {
    username: 'root',
    password: 'Tjnqmf%root2018',
    database: 'just_save_test_db_1',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    operatorsAliases: false,
  },
  production: {
    username: 'root',
    password: null,
    database: 'just_save_db',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    operatorsAliases: false,
  },
};
