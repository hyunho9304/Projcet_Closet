/*
	URL : /closet/drop
	Description : 옷 삭제
	Content-type : x-www-form-urlencoded
	method : POST - Body
	Body = {
		closet_index : Int
	}
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../config/dbPool' ) ;	
const async = require( 'async' ) ;
const moment = require( 'moment' ) ;

router.delete( '/' , function( req , res ) {

	let closet_index = req.body.closet_index

	let task = [

		function( callback ) {
			pool.getConnection(function(err , connection ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					});
					callback( "getConnection err" );
				} else {
					callback( null , connection ) ;
				}
			});
		} ,

		function( connection , callback ) {

			let deleteClosetQuery = 'DELETE FROM Closet WHERE closet_index = ?' ;

			connection.query( deleteClosetQuery , closet_index , function( err , result ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "deleteClosetQuery err" ) ;
				} else {
					res.status(201).send({
						status : "success" ,
						message : "successful closet delete"
					}) ;
					connection.release() ;
					callback( null , "successful closet delete")
				}
			});	//	connection query
		}
	] ;

	async.waterfall(task, function(err, result) {

        let logtime = moment().format('MMMM Do YYYY, h:mm:ss a');

        if (err)
            console.log(' [ ' + logtime + ' ] ' + err);
        else
            console.log(' [ ' + logtime + ' ] ' + result);
    }); //async.waterfall
}) ;

module.exports = router;
