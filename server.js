//Server requirements
var express = require('express');
var app = express();

//Database requirements
var mysql = require('mysql');
var dbconfig = require('./databaseConfig');
var pool = mysql.createPool(dbconfig.localConnection);

//Connect to the pool
pool.getConnection(function(error, connection){	
	//Select the database
	connection.query('USE ' + dbconfig.database);
	
	app.get('/', function (req, res) {
		connection.query("SELECT * FROM `users` WHERE `id` = " + 1, function(errorQ1, rowsQ1){	
			if (errorQ1){
				console.log("ERROR: " + errorQ1 + " : " + rowsQ1); return errorQ1;
			}
			else{
				req.query.setThisInfo; 
				res.send("<p>" + rowsQ1[0].username + "</p>");
			}
		});
	});

	app.listen(3000, function () {
		console.log('Example app listening on port 3000!');
	});
});