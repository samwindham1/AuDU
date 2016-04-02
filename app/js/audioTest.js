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
	source.connect(audioCtx.destination);
	source.mediaElement.play();
}