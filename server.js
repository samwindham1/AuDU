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
}

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});