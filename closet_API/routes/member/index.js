var express = require('express');
var router = express.Router();

const signup = require( './signup' ) ;
router.use( '/signup' , signup ) ;

module.exports = router;