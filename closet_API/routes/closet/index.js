var express = require('express');
var router = express.Router();

//	새옷 업로드
const upload = require( './upload' ) ;
router.use( '/upload' , upload ) ;

// 옷 삭제
/*
const drop = require( './drop' ) ;
router.use( '/drop' , drop ) ;
*/
module.exports = router;