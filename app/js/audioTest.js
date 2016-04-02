function init(){
	var audioCtx = new (window.AudioContext || window.webkitAudioContext)();	
    var audio = new Audio();
    var source;
	
    // `stream_url` you'd get from 
    // requesting http://api.soundcloud.com/tracks/239485245.json
    url = 'http://api.soundcloud.com/tracks/239485245/stream' +
          '?client_id=58479d90aaeccef837849be331f895ca';

	audio.src = url;
	audio.crossOrigin = "anonymous";
	source = audioCtx.createMediaElementSource(audio);
	
	//Create new analyser
	var analyser = audioCtx.createAnalyser();
	analyser.fftSize = 256;
	
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
