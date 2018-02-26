
//returns array of all selected strategies
function get_selected_strats() {

	var strat_id = [];
	
	//get all selected strat ids
	$("#strat_list").each(function(){
		strat_id.push($(this).val());
	});
	
	//print all strats	
	// for (i=0; i<strat_id.length; i++) {
		// console.log(strat_id[i]);
	// }
	
	return strat_id;
}

function upload_zips(strat, callback){
	
	//check if adding or removing technologies
	var add_remove = $('input[name=add_remove]:checked', '#add_remove').val();
	console.log("add_remove:", add_remove);	
	
	var include_exclude = $('input[name=include_exclude]:checked', '#include_exclude').val();
	console.log("include_exclude:", include_exclude);	
	

	//if no supply source targeting selected, end function 
	if (typeof add_remove === 'undefined') { return; }
	if (typeof include_exclude === 'undefined') { return; }
	
	

    var fileUpload = document.getElementById("fileSelect");
    if (fileUpload.value != null) {
		var uploadFile = new FormData();
        var files = $("#fileSelect").get(0).files;
        // Add the uploaded file content to the form data collection
        if (files.length > 0) {

		if(add_remove == 'add'){
			if(include_exclude == 'include'){uploadFile.append("restriction", "INCLUDE");}
			if(include_exclude == 'exclude'){uploadFile.append("restriction", "EXCLUDE");}
			uploadFile.append("validate_only", "0");
			uploadFile.append("ignore_errors", "1");
			uploadFile.append("active", "true");
			uploadFile.append("file", files[0]);
		}			
		
		if(add_remove == 'remove'){
			uploadFile.append("restriction", "INCLUDE");
			uploadFile.append("validate_only", "0");
			uploadFile.append("ignore_errors", "1");
			uploadFile.append("active", "true");
			uploadFile.append("file", "");
		}
				
			$.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/" + strat +"/target_postcodes",
			contentType: false,
			processData: false,
			data: uploadFile,
			type: 'POST',
			success: function(data,textStatus, jqXHR) { 
			success = 1;
			callback(success, strat);
			console.log("success", success);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR, textStatus, errorThrown)
				success = 0;
				callback(success, strat);
				//alert("Wrong file!");
			}
            });
		}
	}
	
}

function move(width) {
console.log(width);
  var elem = document.getElementById("myBar");
  elem.style.width = width + '%';
}

$("#punch").click(function() {
	//console.log("hit!");
	var strats = get_selected_strats();
	strats = strats[0]; 
	feedback="";
	var count = 0;
	
	for(var i=0; i<strats.length; i++) {
		
		 //get list of current supplies attached to camp
		console.log("updating this camp:",strats[i]);
		var current_strat = strats[i];
		console.log(current_strat);
			upload_zips(current_strat, function(success, strat){
				if (success == 1) {
				count = count +1;
				$("#counter").html(count + "/" + strats.length);
				
				move(Math.round((count/strats.length)*100));
				feedback = feedback + "<p> Zipcode file uploaded for strategy "+strat+". Check changes <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ strat+"/targeting/location\">here</a></p>";									
				$("#feedback").html(feedback); 
				}
				if (success == 0) {
				var error = "ERROR: ";
				feedback = feedback + "<p>"+ error.fontcolor("red")+strat+". Check changes <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ strat+"/targeting/location\">here</a></p>";								
				$("#feedback").html(feedback);
				}

			
			})
	}
});




