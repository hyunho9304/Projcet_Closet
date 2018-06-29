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

			let selectClosetCodyRoomQuery = 'SELECT * FROM Closet WHERE member_email = ? ORDER BY closet_uploadtime DESC' ;

			connection.query( selectClosetCodyRoomQuery , member_email , function(err , result) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectClosetCodyRoomQuery err") ;
				} else {

					let summer_list = [] ;
					let outer_list = [] ;
					let knit_list = [] ;
					let top_list = [] ;
					let blouse_list = [] ;
					let dress_list = [] ;
					let skirt_list = [] ;
					let pants_list = [] ;
					let shoes_list = [] ;
					let bag_list = [] ;
					let acc_list = [] ;

					for( var i = 0 ; i < result.length ; i++ ) {

						switch( result[i].closet_type ) {

							case( "SUMMER" ) : {
								summer_list.push( result[i].closet_image ) ;
								break ;
							} ;
							case( "OUTER" ) : {
								outer_list.push( result[i].closet_image ) ;
								break ;
							} ;
							case( "KNIT" ) : {
								knit_list.push( result[i].closet_image ) ;
								break ;
							} ;
							case( "TOP" ) : {
								top_list.push( result[i].closet_image ) ;
								break ;
							} ;
							case( "BLOUSE" ) : {
								blouse_list.push( result[i].closet_image ) ;
								break ;
							} ;
							case( "DRESS" ) : {
								dress_list.push( result[i].closet_image ) ;
								break ;
							} ;
							case( "SKIRT" ) : {
								skirt_list.push( result[i].closet_image ) ;
								break ;
							} ;
							case( "PANTS" ) : {
								pants_list.push( result[i].closet_image ) ;
								break ;
							} ;
							case( "SHOES" ) : {
								shoes_list.push( result[i].closet_image ) ;
								break ;
							} ;
							case( "BAG" ) : {
								bag_list.push( result[i].closet_image ) ;
								break ;
							} ;
							case( "ACC" ) : {
								acc_list.push( result[i].closet_image ) ;
								break ;
							} ;
						}
					}
					connection.release() ;
					callback( null , summer_list , outer_list , knit_list , top_list , blouse_list , dress_list , skirt_list , pants_list , shoes_list , bag_list , acc_list ) ;
				}
			}) ;
		} ,

		function( summer_list , outer_list , knit_list , top_list , blouse_list , dress_list , skirt_list , pants_list , shoes_list , bag_list , acc_list  , callback ) {

			res.status(200).send({
				status : "success" ,
				data : {
					SUMMER : summer_list ,
					OUTER : outer_list ,
					KNIT : knit_list , 
					TOP : top_list ,
					BLOUSE : blouse_list ,
					DRESS : dress_list ,
					SKIRT : skirt_list ,
					PANTS : pants_list ,
					SHOES : shoes_list ,
					BAG : bag_list ,
					ACC : acc_list
				} ,
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
