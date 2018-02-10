var express = require('express');
var https = require('https');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  var animals = {};

  https.get(process.env.AAC_URL, function (fetched) {
    fetched.setEncoding('utf8');
    let body = '';
    fetched.on('data', function (data) {
      body += data;
    });
    fetched.on('end', function () {
      body = JSON.parse(body);
      console.log(body);
      animals = body;
      console.log(animals);
      res.json(animals);
    });
  });
});

module.exports = router;
