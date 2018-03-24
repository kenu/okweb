var express = require('express');
var router = express.Router();
var fn = require('./common/fn');

router.get('/', fn.list);

module.exports = router;