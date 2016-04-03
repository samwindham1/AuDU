var mouseX;
var url;

function setAudioSource(resultUrl){
	url = resultUrl;
}

function init(url){
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();	
    var audio = new Audio();
    var source;

	audio.src = url + '?client_id=58479d90aaeccef837849be331f895ca';
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
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - 50;
	var canvasCtx = canvas.getContext("2d");
	
	//canvas.width  = canvas.offsetWidth;
	//canvas.height  = canvas.offsetHeight;

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
	var player = {	color: 'rgb(255, 255, 255)',
					position: 
						{
							X: canvas.width / 2, 
							Y: (canvas.height / 4) * 3
						},
					speed: 10,
					width: 50,
					height: 50,
					health: 100
				};
		
	var backgroundAlpha = 1;
	var hue = 0;
	var paused = false; 
	
	draw();
	
	function draw(){
		if(!paused){
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
					spawnEnemy(enemiesList, canvas, dataArray, volume);
					
				}
				
				hit = !hit;
			}
			
			var volumeScale = 2;
			spawnSideBar(enemiesList, canvas, volume * volumeScale, canvas.height / bufferLength, {X: 0, Y: -(canvas.height / bufferLength)});
			spawnSideBar(enemiesList, canvas, volume * volumeScale, canvas.height / bufferLength, {X: canvas.width - (volume * volumeScale), Y: 0});
			
			backgroundAlpha += delta;
			if(backgroundAlpha <= 0.1){
				backgroundAlpha = 0.1;
			}
			
			if(hue <= 360){
				hue += 1;
			}
			else{
				hue = 0;
			}

			canvasCtx.fillStyle = 'hsla(' + hue + ', 100%, 50%, ' + backgroundAlpha + ')';
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
			
			//Draw and update the player
			player.position.X = mouseX;
			canvasCtx.fillStyle = player.color;
			canvasCtx.fillRect(player.position.X,  player.position.Y, 50, 50);		

			//Draw and update all the enemies in the enemy list
			for(var i = 0; i < enemiesList.length; i++) {		
				canvasCtx.fillStyle = enemiesList[i].color;
				canvasCtx.fillRect(enemiesList[i].position.X,  enemiesList[i].position.Y, enemiesList[i].width, enemiesList[i].height);
				
				updateEnemy(enemiesList, canvas, i);
				updatePlayer(player, enemiesList, canvas, i);
			}
			
			//Draw the health bar
			if(player.health > 0){
				canvasCtx.fillStyle = 'rgb(255, 66, 227)';
				var units = (canvas.width/2) / 100;
				var lostHealth = ((100 - player.health) * units);
				
				canvasCtx.fillRect((canvas.width / 4), canvas.height - 20, (canvas.width / 2) - lostHealth, 20);
			}
			else{
				
				paused = true;
				player.health = 100;
				player.position = {
								X: canvas.width / 2, 
								Y: (canvas.height / 4) * 3
							};
			}
			
			//Draw the side bars
			canvasCtx.fillStyle = 'rgb(0, 0, 0)';
		}
		
		//Fix tearing
		handle = window.requestAnimationFrame(draw);
	};
	
	$(canvas).on('click', function(){
		if(paused){
			paused = false;
		}
		else if(!paused){
			paused = true;
		}
	});
}

function updatePlayer(player, enemiesList, canvas, i){
	//Check for player collision
	
	//If block is in range of player
	if((enemiesList[i].position.Y >= player.position.Y) && (enemiesList[i].position.Y < player.position.Y + enemiesList[i].height)){
		if( player.position.X > enemiesList[i].position.X && player.position.X < enemiesList[i].position.X + enemiesList[i].width ||
			player.position.X + player.width > enemiesList[i].position.X && player.position.X + player.width < enemiesList[i].position.X + enemiesList[i].width){
			player.health -= enemiesList[i].damage;
		}
	}
}	

function updateEnemy(enemiesList, canvas, index){
	var bufferArea = 100;

	moveEnemyDownward(enemiesList[index]);
	
	if(enemiesList[index].position.Y > canvas.height + bufferArea){
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

function spawnSideBar(enemiesList, canvas, barWidth, barHeight, barPosition){
	enemiesList.push({id: enemiesList.length,
			color: 'rgb(0, 0, 0)',
			position: barPosition,
			speed: 4,
			width: barWidth,
			height: barHeight,
			damage: 0.5});
}

function spawnEnemy(enemiesList, canvas, dataArray, volume){	
	//Gather enemy data
	var enemySize = 64;
	var spawnBuffer = (canvas.width - (volume * 2)) / 2;
	console.log(spawnBuffer);
	var randomPosition = {X: (canvas.width / 2) + ((Math.random() * 2) - 1) * spawnBuffer, Y: -enemySize};
	
	enemiesList.push({id: enemiesList.length,
			color: 'rgb(0, 0, 0)',
			position: randomPosition,
			speed: 4,
			width: enemySize,
			height: enemySize,
			damage: 0.5});
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

function getMouseInput(event){
	mouseX = event.clientX;
}