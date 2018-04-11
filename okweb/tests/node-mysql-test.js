var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'javauser',
  password : 'javadude',
  database : 'javatest'
});

connection.connect();

connection.query('SELECT * from photo', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0]);
});

connection.end();