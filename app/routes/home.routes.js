var express = require('express'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  db2 = require('../../config/config').db2,
  Words = mongoose.model('Words'),
  Searchword = mongoose.model('Searchword'),
  async = require('async'),
  httphelps = require('../helpers/httphelps'),
  qy = require('../controllers/qy.controller');

// 连接到存储抓取数据的数据库
var conn = mongoose.createConnection(db2)
SpidersResultItem = conn.model('Searchdoc', 'SpidersResultItem')
module.exports = function (app) {
  app.use('/', router);
};
  
router.get('/', function(req, res, next) {
  // httphelps.get(apiBaseUri + '/index', function(results) {
  // })
  res.render('index');
})

router.get('/qy/:lcid/loadqydata', qy.loadQyData);

router.get('/wordsmanage', function(req, res, next) {
  // httphelps.get(apiBaseUri + '/index', function(results) {
    Words.find({})
      .exec(function(err, results) {
        console.log(req.locals);
		    res.render('wordsmanage', {results: results});
      })
  // })
})

router.get('/searchwordsmanage', function(req, res, next) {
    var offset = req.query.offset || 0;
    curpage = offset || 0;
    searchword = req.query.searchword
    if(searchword) {
      SpidersResultItem.list({criteria:{kw: searchword}, offset: offset}, function(err, results) {
        res.render('searchdoc', {results: results, curpage: curpage, searchword: searchword})
      })
    } else{
      async.waterfall([
        function(callback) {
          Searchword.find({}, function(err, results) {
            callback(null, results)
          })
        },
        function(searchwords, callback) {
          async.map(searchwords, function(word, cb){
            SpidersResultItem.count({kw: word.kw}, function(err, num){
              var obj = {}
              obj.kw = word.kw
              obj.num = num
              cb(null, obj)
            })
          }, function(err, results) {
            callback(null, results)
          })
        }
      ], function(err, results) {
          res.render('searchwordsmanage', {results: results});
        
      })
    }
    
})

