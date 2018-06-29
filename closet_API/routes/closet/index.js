var express = require('express');
var router = express.Router();

//	새옷 업로드
const upload = require( './upload' ) ;
router.use( '/upload' , upload ) ;

const collection = require( './collection' ) ;
router.use( '/collection' , collection ) ;

// 옷 삭제
const drop = require( './drop' ) ;
router.use( '/drop' , drop ) ;

//	코디룸
const codyroom = require( './codyroom' ) ;
router.use( '/codyroom' , codyroom ) ;


module.exports = router;