/*
	URL : /closet/upload
	Description : 새옷 등록
	Content-type : form_data
	method : POST - Body
	Body = {
		member_email : String ,
		closet_type : String ,
		closet_memo : String ,
		closet_image : file
	}
*/

const express = require('express');
const router = express.Router();
const pool = require('../../config/dbPool');
const async = require('async');
const moment = require( 'moment' ) ;

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
aws.config.loadFromPath('../config/aws_config.json');	//	server 에서는 2개
const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'hyunho9304',
        acl: 'public-read',
        key: function(req, file, callback) {
            callback(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })
});

router.post('/', upload.single('closet_image'), function(req, res) {

	let member_email = req.body.member_email ;
	let closet_type = req.body.closet_type ;
	let closet_memo = req.body.closet_memo ;
	let closet_image = req.file.location ;

	let uploadtime = moment().format( "YYYYMMDDHHmmss" ) ;

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

			let insertClosetQuery = 'INSERT INTO Closet VALUES( ? , ? , ? , ? , ? , ? )' ;
			let queryArr = [ null , closet_type , closet_memo , closet_image , uploadtime , member_email ] ;

			connection.query( insertClosetQuery , queryArr , function( err , result ) {
				if(err) {
					res.status(500).send({
						status : "fail" ,
						message : "internal server err"
					}) ;
					connection.release() ;
					callback( "insertClosetQuery err") ;
				} else {
					res.status(201).send({
						status : "success" , 
						message : "successful closet upload"
					}) ;
					connection.release() ;
					callback( null , "successful closet upload" ) ;
				}
			}) ;
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






















