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

	function draw() {	
		//Begin animation
		requestAnimationFrame(draw);
		
		//Get the actual byte data
		analyser.getByteFrequencyData(dataArray);
		
		//Clear screen
		canvasCtx.fillStyle = 'rgb(0, 0, 0)';
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

		var barWidth = (WIDTH / bufferLength);
		var barHeight;
		var x = 0;

		for(var i = 0; i < bufferLength; i++) {
			barHeight = dataArray[i];

			//Draw individual bar
			canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)';
			canvasCtx.fillRect(x,  HEIGHT - barHeight, barWidth, barHeight);

			x += barWidth + 1;
		}
	};

	draw();
}