
//returns array of all selected strategies
function get_selected_strats() {
	var strat_id = [];
	$("#strat_list").each(function(){
		if(!strat_id.includes($(this).val())){
			strat_id.push($(this).val());
		}
	});
	return strat_id;
}

//upload ip addresses and get corresponding target_ids
function upload_file(callback){
    var fileUpload = document.getElementById("fileSelect");
    if (fileUpload.value != null) {
		var uploadFile = new FormData();
        var files = $("#fileSelect").get(0).files;
      
        if (files.length > 0) {

			uploadFile.append("target_inet", files[0]);
			
			$.ajax({
			url: "https://adroit-tools.mediamath.com/t1/api/v2.0/nemo/target",
			contentType: false,
			processData: false,
			data: uploadFile,
			type: 'POST',
			success: function(data,textStatus, jqXHR) { 
			success = 1;
			console.log("success", success);
			console.log(data)
			var targets = data["data"]["targets"]
			callback(targets);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR, textStatus, errorThrown)
				success = 0;
				var error_text = jqXHR["responseJSON"]["meta"]["code"];
				alert("Invalid IPv4 Format (Octet values must be numeric)");
			}
            });
		}
	}
	
}

//add the ip list
function update(strat,targets,callback){
	var include_exclude = $('input[name=include_exclude]:checked', '#include_exclude').val();
	
	var sendInfo = {
		"operator": "OR",
		"restriction": include_exclude,
		"strategy_id": strat,
		"target.id": targets  
    };
	
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/nemo/attachment",
	contentType: "application/json; charset=utf-8",
	processData: false,
	data: JSON.stringify(sendInfo),
	type: 'POST',
	success: function(data,textStatus, jqXHR) { 
	success = 1;
	callback(success, strat);
	console.log("success", success);
	console.log(data)
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		success = 0;
		callback(success, strat);
	}
	});
	}
	
//remove the ip list	
function remove(strat,callback){
	
	sendInfo = "dimension=IPTA&dimension_code=IPTA&strategy_id="+ strat;

	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/nemo/attachment?"+sendInfo,
	contentType: false,
	processData: false,
	type: 'DELETE',
	success: function(data,textStatus, jqXHR) { 
	success = 1;
	callback(success, strat);
	console.log("success", success);
	console.log(data)
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		success = 0;
		callback(success, strat);
	}
	});
}

//get the ip list
function get(strat,callback){
	var targets = [];
	sendInfo = "dimension=IPTA&dimension_code=IPTA&strategy_id="+ strat;

	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/nemo/attachment?"+sendInfo,
	contentType: false,
	processData: false,
	type: 'GET',
	success: function(data,textStatus, jqXHR) { 
	success = 1;
	console.log(data);
	var elem = data["data"];
	console.log(elem);
	var target_id = "";
	for(item in elem){
		console.log(elem[item]);
		targets.push(elem[item]["target_id"]);
	}
	
	target_id = targets.join(";");
	callback(strat, target_id);
	console.log("success", success);
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		success = 0;
		//callback(success, strat, target_id);
	}
	});
}

function move(width) {
console.log(width);
  var elem = document.getElementById("myBar");
  elem.style.width = width + '%';
}

$("#punch").click(function() {
	var strats = get_selected_strats();
	strats = strats[0]; 
	feedback="";
	var count = 0;
	upload_file(function(response){
		for(var i=0; i<strats.length; i++) {
			var current_strat = strats[i];
			update(current_strat, response, function(success, strat){
				if (success == 1) {
					count = count +1;
					$("#counter").html(count + "/" + strats.length);
					move(Math.round((count/strats.length)*100));
					feedback = feedback + "<p> IP List assigned to strategy "+strat+". Check changes <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ strat+"/targeting/location\">here</a></p>";									
					$("#feedback").html(feedback); 
				}
				if (success == 0) {
					var error = "Error on strategy "+ strat;
					feedback = feedback + "<p>"+ error.fontcolor("red")+strat+". Check changes <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ strat+"/targeting/location\">here</a></p>";								
					$("#feedback").html(feedback);
				}
				})
				}
				})
});

$("#remove").click(function() {
	var strats = get_selected_strats();
	strats = strats[0]; 
	feedback="";
	var count = 0;
		for(var i=0; i<strats.length; i++) {
			var current_strat = strats[i];
			remove(current_strat, function(success, strat){
				if (success == 1) {
					count = count +1;
					$("#counter").html(count + "/" + strats.length);
					move(Math.round((count/strats.length)*100));
					feedback = feedback + "<p> IP List assigned to strategy "+strat+". Check changes <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ strat+"/targeting/location\">here</a></p>";									
					$("#feedback").html(feedback); 
				}
				if (success == 0) {
					var error = "Error on strategy "+ strat;
					feedback = feedback + "<p>"+ error.fontcolor("red")+strat+". Check changes <a target=\"_blank\" href=\"https://t1.mediamath.com/app/#strategy/edit/"+ strat+"/targeting/location\">here</a></p>";								
					$("#feedback").html(feedback);
				}
				})
				}
				
});

$("#get").click(function() {
	var success = 0; 
	var info = "";
	var header = "strat_id,ip_targets";
	var strats = get_selected_strats();
	strats = strats[0]; 
	feedback="";
	var count = 0;

		for(var i=0; i<strats.length; i++) {
			var current_strat = strats[i];
			var counter = 0;
		
		get(current_strat, function(current_strat,audience){
					counter++;
					count = count +1;
					$("#counter").html(count + "/" + strats.length);
					move(Math.round((count/strats.length)*100));
					if(counter == strats.length){
						info = header +info+ "\n"+ current_strat  + "," + audience;
						downloadCSV(info, { filename: "Strategy_Audience_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ current_strat  + "," + audience;
					} 
					//});
					})
				}
				
});

function downloadCSV(csv, args) {  
        var data = "";
		var filename = "";
		var link = "";

        if (csv == null) return;	

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
		link.click();
		//window.alert("Download Complete.");
    };




