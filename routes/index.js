var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // res.render('index', { title: '' });
  res.render('user/index', { title: 'User' });
});

module.exports = router;
