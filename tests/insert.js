var connection = require('../config/db');

connection.connect();

connection.query(`insert into user (id, userid, passwd, nickname)
values (null, ?, password(?), ?)`, ['3abcd', '123123', ''],
function (error, results, fields) {
  if (error) throw error;
  console.log('The result is: ', results);
});

connection.end();
