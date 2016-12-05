var express = require('express');
var router = express.Router();

var wechat_cfg = require('../config/wechat.cfg');
var signature = require('../sign/signature');

/* GET home page. */
router.get('/', function (req, res) {
    var url = req.protocol + '://' + req.host + req.originalUrl; //获取当前url
    signature.sign(url, function (signatureMap) {
        signatureMap.appId = wechat_cfg.appid;
        res.render('wx', signatureMap);
    });
});

module.exports = router;