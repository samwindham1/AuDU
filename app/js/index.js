$(document).ready(function(){
	getPosts();
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