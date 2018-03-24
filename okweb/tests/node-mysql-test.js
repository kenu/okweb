var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'devuser',
  password : 'devpass',
  database : 'devdb'
});

connection.connect();

connection.query('SELECT * from user', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].userid);
});

connection.end();