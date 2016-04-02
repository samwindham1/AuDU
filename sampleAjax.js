function setInfo(){
	$.ajax({
		url: "/setInfo/",
		data: {
			setThisInfo: myData
		}
	}).done(function(data) {		
		//Whatever you want with data
	}).fail(function(xhr, status, error){
		console.log("Status: " + status + " Error: " + error);
		console.log(xhr);
	});
}