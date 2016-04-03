//Server requirements
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/app'));

//Basic page loading
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/app/views/index.html');
});

app.listen(3000, function () {
	console.log('Listening on port 3000');
});