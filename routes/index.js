var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // res.render('index', { title: '' });
  res.render('index', { title: 'User' });
});

module.exports = router;
