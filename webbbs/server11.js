var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'devdb',
    user: 'devuser',
    password: 'devpass'
});
connection.connect();

// 서버
var app = express();

// request 파서
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// 정적인 파일 경로 public
app.use(express.static(path.join(__dirname, 'public')));


// 루트 경로 처리
app.get('/', defaultPage);
app.get('/write', defaultPage);
app.get('/list/*', defaultPage);
app.get('/view/*', defaultPage);

function defaultPage(req, res) {
    res.sendFile(__dirname + '/public/webform11.html');
}

// 저장 
app.post('/save.json', function (req, res) {
    var message = {};
    message.name = req.param('name');
    message.email = req.param('email');
    message.message = req.param('msg');
    save(message, res);
});

// 상세보기
app.get('/view.json', function(req, res) {
    var id = req.param('id');
    view(id, res);
});

// 목록보기
app.get('/list.json', function(req, res) {
    var pageNo = req.param('pageNo');
    list(pageNo, res);
});

// 저장하기
function save(message, res) {
    var query = connection.query('INSERT INTO board SET ?', message, function (err, result) {
        var resultObj = {};
        if (err) {
            resultObj.success = false;
            console.log(err);
        } else {
            resultObj.success = true;
            resultObj.id = result.insertId;
        }
        res.send(JSON.stringify(resultObj));
    });
    console.log(query.sql);
}

// 상세보기
function view(id, res) {
    console.log(id);
    var query = connection.query('select * from board where id = ' +
                                 connection.escape(id), function (err, result) {
        var resultObj = {};
        if (err) {
            resultObj.success = false;
            console.log(err);
        } else {
            res.json(result);
            return;
        }
        res.send(JSON.stringify(resultObj));
    });
    console.log(query.sql);
}

// 목록보기
function list(pageNo, res) {
    console.log(pageNo);
    var num = parseInt(pageNo) - 1;
    if (num < 0) {
        num = 0;
    }
    var query = connection.query('select * from board order by id desc limit ?, ?'
                                 , [num * 3, 3]
                                 , function (err, results) {
        var resultObj = {};
        if (err) {
            resultObj.success = false;
            console.log(err);
        } else {
            count(res, results);
            return;
        }
        res.send(resultObj);
    });
    console.log(query.sql);
}

// 전체 게시물 수
function count(res, list) {
    var query = connection.query('select count(*) as count from board'
                                 , function (err, results) {
        var resultObj = {};
        if (err) {
            resultObj.success = false;
            console.log(err);
        } else {
            resultObj.count = results[0].count;
            resultObj.perpage = 3;
            resultObj.list = list;
            res.json(resultObj);
            return;
        }
        res.send(resultObj);
    });
}
// 포트 지정
app.set('port', process.env.PORT || 4000);
// 서버 시작
app.listen(app.get('port'), function () {
    console.log('Server running at http://127.0.0.1:' + app.get('port'));
});

process.on('uncaughtException', function (err) {
    console.log(err);
}); 