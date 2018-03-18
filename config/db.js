var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'devuser',
    password : 'devpass',
    database : 'devdb'
  });
module.exports = connection;