//for database connection
var mysql = require('mysql');

config.connection = mysql.createConnection({
  host     : '',
  user     : 'demo',
  password : 'demo',
  database : 'same'
});

module.exports = config;
