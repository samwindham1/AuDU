$(document).ready(function(){
	
	//Set up soundcloud secret
	SC.initialize({
	  client_id: '58479d90aaeccef837849be331f895ca'
	});
	
	$("#playButton").click(function(){
		getTracks();
	});
	
	//Admin only
	//setTrack({name: "testName", genre: "Rap"});
});

//Loads info about track
function getTracks(){
	console.log('http://api.soundcloud.com/resolve?url=' + $("#textInput").val() +'&client_id=58479d90aaeccef837849be331f895ca');
	
	/*
	$.get('http://api.soundcloud.com/resolve?url=' + $("#textInput").val().trim() + '&client_id=58479d90aaeccef837849be331f895ca', function (result) {
	  console.log(result);
	});
	*/
	
	SC.resolve($("#textInput").val()).then(function(track){
		console.log("tas");
	});
	
	/*$.ajax({
		type: "GET",
		url: 'http://api.soundcloud.com/resolve?url=' + $("#textInput").val() +'&client_id=58479d90aaeccef837849be331f895ca',
		success: function(result){
			console.log('Track Id: ' + result.stream_url);
			setAudioSource(result.stream_url);
		},
	}).done(function(data) {
		//Get information about track back here in data
		
		init();
	}).fail(function(xhr, status, error){
		console.log("Status: " + status + " Error: " + error);
		console.log(xhr);
	});*/
}

//Loads embedded track (media)
function getEmbeddedPlayer(id, divID){
	$.ajax({
		url: "/getTrackByID",
		data: {
			trackID: id
		}
	}).done(function(data) {
		//All info about track returned in data
		SC.oEmbed(data.url, { auto_play: false, maxheight: 166, show_comments: false}).then(function(oEmbed) {
			$(divID).html(oEmbed.html);
			$(divID).children[0].focus();
		});
	}).fail(function(xhr, status, error){
		console.log("Status: " + status + " Error: " + error);
		console.log(xhr);
	});
}