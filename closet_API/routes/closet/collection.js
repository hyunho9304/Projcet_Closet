/*
	URL : /closet/collection
	Description : 새옷 등록
	Content-type : x-www-form-urlencoded
	method : GET - query
	query = /?member_email={ 유저 이메일 }&closet_type={ 카테고리 }
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

			let selectClosetCollectionQuery = 'SELECT * FROM Closet WHERE member_email = ? AND closet_type = ? ORDER BY closet_uploadtime DESC' ;
			let queryArr = [ member_email , closet_type ] ;

			connection.query( selectClosetCollectionQuery , queryArr , function(err , result) {
				if( err ) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "selectClosetCollectionQuery err") ;
				} else {

					let list = [] ;

					for( var i = 0 ; i < result.length ; i++ ) {


						let data = {
							closet_index : result[i].closet_index ,
							closet_image : result[i].closet_image ,
							closet_uploadtime : moment(result[i].closet_uploadtime).format('YYYY.MM.DD') ,
							closet_memo : result[i].closet_memo
						}
						list.push( data ) ;
					}
					connection.release() ;
					callback( null , list ) ;
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













