var express = require('express');
var router = express.Router();
var connection = require('../config/db');


/* GET users listing. */
router.get('/', function (req, res, next) {
    connection.connect();

    connection.query('SELECT * from user', function (error, results, fields) {
        if (error) throw error;
        var html = '<ul>';
        results.forEach(element => {
            html += '<li>' + element.userid + '</li>'
        });
        html += '</ul>'

        res.send('result:' + html);
    });

    connection.end();
});

module.exports = router;
