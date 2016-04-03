function init(){
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();	
    var audio = new Audio();
    var source;
	
    url = 'http://api.soundcloud.com/tracks/239485245/stream' +
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
	var timeThreshold = 200;
	lastTime = (new Date()).getTime();
	
	//Empty enemies list
	var enemiesList = [];
	
	//Set up character
	var player = {	color: 'rgb(50, 0, 0)',
					position: 
						{
							X: canvas.width / 2, 
							Y: (canvas.height / 4) * 3
						},
					speed: 10
				};
	
	handleMovement(player);
	
	var backgroundAlpha = 1;
	var hue = 0;
	
	draw();
	
	function draw() {
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
		
		var delta = -0.1;
		
		if(hit){	
			//backgroundAlpha =  Math.floor(volume);
			backgroundAlpha = 1;
			delta = -0.1;
		
			//Check time
			currentTime = (new Date()).getTime();
			timePassed = currentTime - lastTime;
					
			if(timePassed >= timeThreshold){
				//Restart the timer and spawn
				lastTime = currentTime;
				spawnEnemy(enemiesList, canvas, dataArray);
			}
			
			hit = !hit;
		}
		
		backgroundAlpha += delta;
		if(backgroundAlpha <= 0){
			backgroundAlpha = 0;
		}
		
		if(hue <= 360){
			hue += 1;
		}
		else{
			hue = 0;
		}

		canvasCtx.fillStyle = 'hsla(' + hue + ', 100%, 50%, ' + backgroundAlpha + ')';
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
				
		//Draw and update all the enemies in the enemy list
		for(var i = 0; i < enemiesList.length; i++) {
			canvasCtx.fillStyle = enemiesList[i].color;
			canvasCtx.fillRect(enemiesList[i].position.X,  enemiesList[i].position.Y, enemiesList[i].width, enemiesList[i].height);
			
			updateEnemy(enemiesList, canvas, i);
		}
				
		//Draw the player
		canvasCtx.fillStyle = player.color;
		canvasCtx.fillRect(player.position.X,  player.position.Y, 50, 50);
		
		//Fix tearing
		handle = window.requestAnimationFrame(draw);
	};
}

function updateEnemy(enemiesList, canvas, index){
	moveEnemyDownward(enemiesList[index]);
	
	if(enemiesList[index].position.Y > canvas.height){
		removeEnemy(enemiesList, index);
	}
}

function avgVolume(array){
	var values = 0;
	for(var i = 0; i < array.length; i++){
		values += array[i];
	}
	return values / array.length;
}

function spawnEnemy(enemiesList, canvas, dataArray){	
	//Gather enemy data
	var enemySize = 64;
	var spawnBuffer = 400;
	var randomPosition = {X: (canvas.width / 2) + ((Math.random() * 2) - 1) * spawnBuffer, Y: -enemySize};
	
	enemiesList.push({id: enemiesList.length,
			color: 'rgb(0, 0, 0)',
			position: randomPosition,
			speed: 4,
			width: enemySize,
			height: enemySize});
}

function removeEnemy(enemiesList, index){
	enemiesList.splice(index, 1);
}

function moveEnemyDownward(enemy){
	enemy.position.Y += enemy.speed; 
}

function moveEnemyTowardPosition(enemy, position){
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
	});
}