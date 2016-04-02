$(document).ready(function(){
	$("#clickThisDiv").click(function(){	
		getInfo();
	});
});

function getInfo(){
	$.ajax({
		url: "/getInfo/",
		data: {
			getThisID: 1
		}
	}).done(function(data) {		
		$('body').append("<p>" + data + "</p>");
	}).fail(function(xhr, status, error){
		console.log("Status: " + status + " Error: " + error);
		console.log(xhr);
	});
}