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
	
	$.get(('http://api.soundcloud.com/resolve?url=' + value + '&client_id=58479d90aaeccef837849be331f895ca'), function (result) {
		getEmbeddedPlayer(result.id, value, "#soundcloudContainer");
		init(result.stream_url);
	}, "json");
}

//Loads embedded track (media)
function getEmbeddedPlayer(id, url, divID){
	SC.oEmbed(url, { auto_play: false, maxheight: 50, show_comments: false}).then(function(oEmbed) {
		$(divID).html(oEmbed.html);
		$(divID).children[0].focus();
	});
}