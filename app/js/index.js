$(document).ready(function(){
	getTracks();
	
	//Set up soundcloud secret
	SC.initialize({
	  client_id: '58479d90aaeccef837849be331f895ca'
	});

	$(document).on('click', '.track', function(){		
		var scContainer = $(this).find(".soundcloudContainer");
	
		if(scContainer.css("display") === "none"){
			scContainer.html(
				getEmbeddedPlayer(this.id, scContainer)
			);
		
			scContainer.show();
		}
		else{
			scContainer.hide();
			scContainer.empty();
		}
	});
	
	//Admin only
	//setTrack({name: "testName", genre: "Rap"});
});

//Loads info about track
function getTracks(){
	$.ajax({
		url: "/getTracks"
	}).done(function(data) {
		for(var i = 0; i < data.length; i++){
			$('#trackContainer').append(
				"<ul>" +
					"<li>" + 
						"<div class='track' id=" + data[i].id + ">" +
							"<div class='trackInfo'>" + data[i] + "</div>" + 
							"<div class='soundcloudContainer'></div>" + 
						"</div>" +
					"</li>" +
				"</ul>"
			);
		}
	}).fail(function(xhr, status, error){
		console.log("Status: " + status + " Error: " + error);
		console.log(xhr);
	});
}

/*
	Format of trackToSet:
	{name: x, artist: x, length: x, genre: x, url: x, rating: x}
*/
function setTrack(trackToSet){
	$.ajax({
		url: "/setTrack",
		data: {
			trackData: trackToSet
		}
	}).done(function(data) {
		//Track has been added to database
	}).fail(function(xhr, status, error){
		console.log("Status: " + status + " Error: " + error);
		console.log(xhr);
	});
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
		SC.oEmbed(data.url, { auto_play: false }).then(function(oEmbed) {
			$(divID).html(oEmbed.html);
		});
	}).fail(function(xhr, status, error){
		console.log("Status: " + status + " Error: " + error);
		console.log(xhr);
	});
}