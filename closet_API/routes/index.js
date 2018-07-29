var express = require('express');
var router = express.Router();

//	member 관련
const member = require( './member/index' ) ;
router.use( '/member' , member ) ;

//	옷장 관련
const closet = require( './closet/index') ;
router.use( '/closet' , closet ) ;

module.exports = router;


