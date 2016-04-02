//Server requirements
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/app'));

//Database requirements
var mysql = require('mysql');
var dbconfig = require('./databaseConfig');
var pool = mysql.createPool(dbconfig.localConnection);

//Connect to the pool
pool.getConnection(function(error, connection){	
	//Select the database
	connection.query('USE ' + dbconfig.database);
	
	//Basic page loading
	app.get('/', function (req, res) {
		res.sendFile(__dirname + '/app/views/index.html');
	});
	
	//Exchange information through ajax
	app.get('/getInfo', function (req, res) {
		connection.query("SELECT * FROM `users` WHERE `id` = " + req.query.getThisID, function(errorQ1, rowsQ1){	
			if (errorQ1){
				console.log("ERROR: " + errorQ1 + " : " + rowsQ1); return errorQ1;
			}
			else{					 
				res.send(rowsQ1[0].username);
			}
		});
	});
	
	app.listen(3000, function () {
		console.log('Example app listening on port 3000!');
	});
});