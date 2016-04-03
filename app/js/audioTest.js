function init(){
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();	
    var audio = new Audio();
    var source;
	
    // `stream_url` you'd get from 
    // requesting http://api.soundcloud.com/tracks/239485245.json
    url = 'http://api.soundcloud.com/tracks/253797891/stream' +
          '?client_id=58479d90aaeccef837849be331f895ca';

	audio.src = url;
	audio.crossOrigin = "anonymous";
	source = audioCtx.createMediaElementSource(audio);
	
	//Create new analyser
	var analyser = audioCtx.createAnalyser();
	analyser.fftSize = 64;
	
	source.connect(analyser);
	analyser.connect(audioCtx.destination);
	
	//Set up buffer
	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);
	
	//Play track
	source.mediaElement.play();
	
	//Set up canvas
	var canvas = document.getElementById("mainCanvas");
	var canvasCtx = canvas.getContext("2d");
	canvas.style.width ='100%';
	canvas.style.height ='100%';
	canvas.width  = canvas.offsetWidth;
	canvas.height  = canvas.offsetHeight;

	//Clear canvas
	var WIDTH = canvas.width;
	var HEIGHT = canvas.height;
	canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
	
	var e = 0;
	var buffer = [];
	var counter = 0;
	var hit = false;
	var bufferSize = 10;
	
	
	//Time function
	var lastTime, currentTime;
	var timePassed = 0;
	var timeThreshold = 1000;
	lastTime = (new Date()).getTime();
	
	//Empty enemies list
	var enemiesList = [];
	
	//Set up character
	var player = {	color: 'rgb(50, 0, 0)',
					position: 
						{
							X: canvas.width / 2, 
							Y: canvas.height / 2
						},
					speed: 10
				};
	
	handleMovement(player);
	
	function draw() {
		
		//Begin animation
		requestAnimationFrame(draw);
		
		//Get the actual byte data
		analyser.getByteFrequencyData(dataArray);
		
		
		var volume =  avgVolume(dataArray);
		if(counter < bufferSize){
			if(volume > Math.max.apply(null, buffer)){
				hit = true;
			}
			
			if(buffer.length  < bufferSize){
				buffer.push(volume);
			}
			else{
				buffer[counter] = volume;
			}
			
			counter ++;
		}
		else{
			counter = 0;
		}
		
		
		//Clear screen
		canvasCtx.fillStyle = 'rgb(0, 0, 0)';
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
		
		if(hit){
			canvasCtx.fillStyle = 'rgb(255, 0, 0)';
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
			hit = !hit;
		}
		
		
		//Check time
		currentTime = (new Date()).getTime();
		timePassed = currentTime - lastTime;
				
		if(timePassed >= timeThreshold){
			//Restart the timer and spawn
			lastTime = currentTime;
			
			//Gather enemy data
			var bigRange = 64;
			var med1Range = 128;
			var med2Range = 192;
			var smallRange = 256;
			
			var bufferArea = 100;
			
			for(var i = 0; i < bufferLength; i++) {
				//Create spawn point based on random
				var direction = Math.floor((Math.random() * 4) + 1);
				var randomPosition;
				
				switch(direction){
					//Top
					case 1: randomPosition = {X: Math.floor((Math.random() * canvas.width) + 1), Y: canvas.height + bufferArea}; break;
					//Right
					case 2: randomPosition = {X: canvas.width + bufferArea, Y: Math.floor((Math.random() * canvas.height) + 1)}; break;
					//Bottom
					case 3: randomPosition = {X: Math.floor((Math.random() * canvas.width) + 1), Y: -bufferArea}; break;
					//Left
					case 4: randomPosition = {X: -bufferArea, Y: Math.floor((Math.random() * canvas.height) + 1)}; break;
				}
				
				if(dataArray[i] < bigRange){
					enemiesList.push({id: enemiesList.length,
							color: 'rgb(50, 50, 50)',
							position: randomPosition});
				}
				else if(dataArray[i] > bigRange && dataArray[i] < med1Range){
					enemiesList.push({id: enemiesList.length,
							color: 'rgb(100, 100, 100)',
							position: randomPosition});
				}
				else if(dataArray[i] > med1Range && dataArray[i] < med2Range){
					enemiesList.push({id: enemiesList.length,
							color: 'rgb(150, 150, 150)',
							position: randomPosition});
				}
				else if(dataArray[i] > med2Range && dataArray[i] < smallRange){
					enemiesList.push({id: enemiesList.length,
							color: 'rgb(0, 0, 0)',
							position: randomPosition});
				}
			}
		}
		
		//Draw all the enemies in the enemy list
		for(var i = 0; i < enemiesList.length; i++) {
			updateMovement(enemiesList[i], {X: player.position.X, Y: player.position.Y});
			canvasCtx.fillStyle = enemiesList[i].color;
			canvasCtx.fillRect(enemiesList[i].position.X,  enemiesList[i].position.Y, 50, 50);
		}
		
		//Draw the player
		canvasCtx.fillStyle = player.color;
		canvasCtx.fillRect(player.position.X,  player.position.Y, 50, 50);
	};
	
	draw();
}


function avgVolume(array){
	var values = 0;
	for(var i = 0; i < array.length; i++){
		values += array[i];
	}
	return values / array.length;
}

function updateMovement(enemy, position){
	// Calculate direction towards player
    var toPlayerX = position.X - enemy.position.X;
    var toPlayerY = position.Y - enemy.position.Y;

    // Normalize
    var toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY);
    toPlayerX = toPlayerX / toPlayerLength;
    toPlayerY = toPlayerY / toPlayerLength;

    // Move towards the player
    enemy.position.X += toPlayerX;
    enemy.position.Y += toPlayerY;

    // Rotate us to face the player
    enemy.rotation = Math.atan2(toPlayerY, toPlayerX);
}

function handleMovement(player){
	document.addEventListener('keydown', function(event) {
		if(event.keyCode == 37) {
			//Left
			player.position.X -= player.speed;
		}
		if(event.keyCode == 39) {
			//Right
			player.position.X += player.speed;
		}
		if(event.keyCode == 38) {
			//Up
			player.position.Y -= player.speed;
		}
		if(event.keyCode == 40) {
			//Down
			player.position.Y += player.speed;
		}
	});
}