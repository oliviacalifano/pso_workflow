var strat_list = [];

function get_selected_strats() {

	var strat_id = [];
	
	//get all selected strat ids
	$("#strat_list").each(function(){
		strat_id.push($(this).val());
	});
	 
	return strat_id;
}

function get_con(strat,d,callback){
	var audience = new FormData();

	if(d.con_id != undefined && d.con_id != ""){
		var aud = d.con_id;
		aud = aud.split(';');
		for (i=0; i<aud.length; i++) {
		audience.append('concepts.'+(i+1).toString()+'.id', aud[i]);
		}

	}
	callback(strat,audience);
}

function add_con(s,audience,callback){
	//c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/concepts",
	contentType: false,
	processData: false,
	data: audience,
	type: 'POST',
	success: function(data,textStatus, jqXHR) { 
	success = 1;
	console.log("success", success,data,textStatus, jqXHR);
	callback(success);
	},
	error: function(xml,jqXHR, textStatus, errorThrown) {
		//var err = xhr.responseXML.getElementsByTagName("field-error");
		var err = xml.responseXML.getElementsByTagName("field-error")[0].getAttribute('error');
		console.log(err);
		var error = "Concept Error on Row " + s + ": " + err;
		callback(error);
	}
	});
}

function get(strat, callback){
	var con = "";
	var con_name = "";
	console.log(con);
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/concepts",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var array = [];
			var array_name = [];
			var entry = $(xml).find("entity");
			console.log(entry);
			entry.each(function(){
			//var aud_id = $(this).find("entity").attr('id');
			var aud_id = $(this).attr('id');
			var aud_name = $(this).attr('name');
			if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
			array.push(aud_id);
			array_name.push(aud_name);
			}
			});
			
			con = con + array.join(";") + ",";
			con_name = con_name + array_name.join(";") + ",";
			console.log(con);
			
			callback(strat,con,con_name);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}

function upload_button(d){
	feedback = "";
	var strat = d.strat_id;
	console.log(strat);

 	get_con(strat,d,function(strat,concepts){
		add_con(strat,concepts,function(concept_success){
		if (concept_success == 1) {
		feedback = feedback + "Success on " + strat + ": Concepts Added</p>";								
		$("#feedback").html(feedback); 
		}
		else {
		feedback = feedback + concept_success.fontcolor("red") + "<br>";							
		$("#feedback").html(feedback); 
		}
		})
	}) 

};

var strat_list = []; 

function get_button(d,numRows){
	var strat = d.strat_id;
	strat_list.push(strat);
	console.log(strat);
	console.log(numRows);

	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "strat_id,con_id,con_name";
 	if(strat_list.length == numRows){
	//console.log("starting to loop through strats and update geo");
	for(var i=0; i<strat_list.length; i++) {

	var current_strat = strat_list[i];
	//console.log(current_strat);
	var counter = 0;
		
		get(current_strat, function(current_strat,audience,con_name){
					counter++;

					if(counter == strat_list.length){
						info = header +info+ "\n"+ current_strat  + "," + audience + con_name;
						downloadCSV(info, { filename: "Strategy_Audience_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ current_strat  + "," + audience + con_name;
					} 
					//});
					})

		}
		} 

};

$("#get_dropdown").click(function() {
	console.log("hit!");
	var strat_list_drop = [];
	strat_list_drop = get_selected_strats();
	strat_list_drop = strat_list_drop[0]; 
	dropdown(strat_list_drop); 	
})

function dropdown(strat_list){
	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "strat_id,con_id,con_name";
	//console.log("starting to loop through strats and update geo");
	for(var i=0; i<strat_list.length; i++) {

	var current_strat = strat_list[i];
	//console.log(current_strat);
	var counter = 0;
		
		get(current_strat, function(current_strat,audience,con_name){
					counter++;

					if(counter == strat_list.length){
						info = header +info+ "\n"+ current_strat  + "," + audience + con_name;
						downloadCSV(info, { filename: "Strategy_Audience_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ current_strat  + "," + audience + con_name;
					} 
					//});
					})

		}
		 

};

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