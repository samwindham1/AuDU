$(document).ready(function(){
	getPosts();
		
	SC.initialize({
	  client_id: '58479d90aaeccef837849be331f895ca'
	});

	var track_url = 'http://soundcloud.com/forss/flickermood';
	SC.oEmbed(track_url, { auto_play: false }).then(function(oEmbed) {
	  console.log('oEmbed response: ', oEmbed);
	  $('#trackContainer').append(oEmbed.html);
	});
	
});

function getPosts(){
	$.ajax({
		url: "/getPosts"
	}).done(function(data) {
		for(var i = 0; i < data.length; i++){
			$('#trackContainer').append(
				"<ul>" +
					"<li class='track'>" +
						data[i] +
					"</li>" +
				"</ul>"
			);
		}
	}).fail(function(xhr, status, error){
		console.log("Status: " + status + " Error: " + error);
		console.log(xhr);
	});
}