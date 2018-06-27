var express = require('express');
var router = express.Router();

const member = require( './member/index' ) ;
router.use( '/member' , member ) ;

const closet = require( './closet/index') ;
router.use( '/closet' , closet ) ;

module.exports = router;
