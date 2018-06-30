/*
	URL : /closet/codyroom
	Description : 등록된 전체 나의 옷들
	Content-type : x-www-form-urlencoded
	method : GET - query
	query = /?member_email={ 유저 이메일 }
*/

const express = require('express');
const router = express.Router();
const pool = require( '../../config/dbPool' ) ;	//	경로하나하나
const async = require( 'async' ) ;		//	install
const moment = require( 'moment' ) ;

router.get( '/' , function( req , res ) {

	let member_email = req.query.member_email ;
	let closet_type = req.query.closet_type ;

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

			let selectClosetCodyRoomQuery = 'SELECT * FROM Closet WHERE member_email = ? AND closet_type = ? ORDER BY closet_uploadtime DESC' ;
			let queryArr = [ member_email , closet_type ] ;

			connection.query( selectClosetCodyRoomQuery , queryArr , function(err , result) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectClosetCodyRoomQuery err") ;
				} else {

					let list = [] ;

					if( closet_type === "OUTER" ){
						list.push( "https://hyunho9304.s3.ap-northeast-2.amazonaws.com/1530319864829.png" ) ;
					} else if( closet_type === "KNIT" ) {
						list.push( ) ;
					} else if( closet_type === "TOP" ) {
						list.push() ;
					} else if( closet_type === "BLOUSE" ) {
						list.push() ;
					} else if( closet_type === "DRESS" ) {
						list.push() ;
					} else if( closet_type === "SKIRT" ) {
						list.push() ;
					} else if( closet_type === "PANTS" ) {
						list.push() ;
					} else if( closet_type === "SHOES" ) {
						list.push() ;
					} else if( closet_type === "BAG" ) {
						list.push() ;
					} else {
						list.push() ;
					}

					for( var i = 0 ; i < result.length ; i++ ) {
						list.push( result[i].closet_image ) ;
					}
					connection.release() ;
					callback( null , list) ;
				}
			}) ;
		} ,

		function( list , callback ) {

			res.status(200).send({
				status : "success" ,
				data : list ,
				message : "successful get closet collection list"
			}) ;
			callback( null , "successful get closet collection list") ;
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
