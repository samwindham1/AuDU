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
	app.get('/getTracks', function (req, res) {	
		
		
		
		
		function(result){
			res.send(result);
		}
		
		
		
		return;
	});
	
	app.listen(3000, function () {
		console.log('Listening on port 3000');
	});
});