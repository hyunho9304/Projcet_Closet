var express = require('express');
var router = express.Router();

const member = require( './member/index' ) ;
router.use( '/member' , member ) ;

module.exports = router;
