$(document).ready(function(){
	init();
	getTracks();
	
	//Set up soundcloud secret
	SC.initialize({
	  client_id: '58479d90aaeccef837849be331f895ca'
	});
	
	var currentSelectedID;
	$(document).on('click', '.track', function(){	
	
		var scContainer = $(this).find(".soundcloudContainer");
		
		//If it doesn't exist
		if(currentSelectedID === undefined){
			//Set initial value
			currentSelectedID = this.id;
			
			scContainer.show();
			scContainer.html(
				getEmbeddedPlayer(this.id, scContainer)
			);
		}
		else{
			if(this.id == currentSelectedID){
				if(scContainer.css("display") === "none"){
					scContainer.show();
					scContainer.html(
						getEmbeddedPlayer(this.id, scContainer)
					);
				}
				else{
					scContainer.hide();
					scContainer.empty();
				}
			}
			else{
				//Hide old one
				$("#" + currentSelectedID).find(".soundcloudContainer").hide();
				$("#" + currentSelectedID).find(".soundcloudContainer").empty();
				
				//Show the new one
				scContainer.show();
				scContainer.html(
					getEmbeddedPlayer(this.id, scContainer)
				);
				
				currentSelectedID = this.id; 
			}
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
							"<div class='trackInfo'>" + data[i].name + "</div>" + 
							"<div class='soundcloudContainer'></div><script>$('.soundcloudContainer').hide();</script>" + 
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
		SC.oEmbed(data.url, { auto_play: false, maxheight: 166, show_comments: false}).then(function(oEmbed) {
			$(divID).html(oEmbed.html);
			$(divID).children[0].focus();
		});
	}).fail(function(xhr, status, error){
		console.log("Status: " + status + " Error: " + error);
		console.log(xhr);
	});
}