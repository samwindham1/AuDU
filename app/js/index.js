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
	var value = $("#textInput").val();
	console.log("String value: " + value);
	
	$.get(('http://api.soundcloud.com/resolve?url=' + value + '&client_id=58479d90aaeccef837849be331f895ca'), function (result) {
		console.log("Result - 1: " + result.stream_url);
		init(result.stream_url);
	}, "json");
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