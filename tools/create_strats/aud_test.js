//remove strategies with no audiences
// upload broadband_audiences.csv
var strat_list = [];

function get_selected_strats() {

	var strat_id = [];
	
	//get all selected strat ids
	$("#strat_list").each(function(){
		strat_id.push($(this).val());
	});
	 
	return strat_id;
}

function get_aud(strat,d,callback){
	var audience = new FormData();

		var aud_inc = d.aud_inc_id;
		var aud_exc = d.aud_exc_id;
		aud_inc = aud_inc.split(';');
		aud_exc = aud_exc.split(';');
		
		var index_inc = aud_inc.indexOf("");
		var index_exc = aud_exc.indexOf("");
		
		if (index_inc > -1) {
			aud_inc.splice(index_inc, 1);
			}
		if (index_exc > -1) {
			aud_exc.splice(index_exc, 1);
			}
		
		var inc_length = aud_inc.length;
		console.log(inc_length);
		var exc_length = aud_exc.length;
		console.log(exc_length);
		var total_length = inc_length + exc_length;
		console.log(total_length);
		
		if(inc_length != 0 || exc_length != 0){
		for (i=0; i<inc_length; i++) {
		audience.append('segments.'+(i+1).toString()+'.id', aud_inc[i]);
		audience.append('segments.'+(i+1).toString()+'.restriction', "INCLUDE");
		console.log("entered loop");
		}
		for (i=inc_length; i<total_length; i++) {
		audience.append('segments.'+(i+1).toString()+'.id', aud_exc[i-inc_length]);
		audience.append('segments.'+(i+1).toString()+'.restriction', "EXCLUDE");
		//console.log(audience);
		}
}
		audience.append('exclude_op', "OR");
		audience.append('include_op', "AND");
			
	callback(strat,audience);
}


function add_aud(s,audience,callback){
	//c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/audience_segments",
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
		var error = "Audience Error on Row " + s + ": " + err;
		callback(error);
	}
	});
}

function get(strat, type, callback){
	var con = "";
	var prop = "prop[name=" + type.slice(0, -1) + "_id]";

	console.log(con);
	var request = $.ajax({
		//url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/retired_audience_segments?full=*",
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/" + type + "?full=*",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var inc_array = [];
			var exc_array = [];
			var entry = $(xml).find("entity");
			console.log(entry);
			entry.each(function(){
			//var aud_id = $(this).find("entity").attr('id');
			if($(this).find("prop[name=restriction]").attr("value") == "INCLUDE"){
				//var aud_id = $(this).find("prop[name=retired_audience_segment_id]").attr("value");
				var aud_id = $(this).find(prop).attr("value");
				if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
				inc_array.push(aud_id);
				}
			}
			if($(this).find("prop[name=restriction]").attr("value") == "EXCLUDE"){
				//var aud_id = $(this).find("prop[name=retired_audience_segment_id]").attr("value");
				var aud_id = $(this).find(prop).attr("value");
				if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
				exc_array.push(aud_id);
				}
			}
			});
			
			con = con + inc_array.join(";") + ","+ exc_array.join(";");
			console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}

$("#get_dropdown").click(function() {
	console.log("hit!");
	var strat_list_drop = [];
	strat_list_drop = get_selected_strats();
	strat_list_drop = strat_list_drop[0]; 
	dropdown(strat_list_drop); 	
})

function dropdown(strat_list){
	var type = "";
	if($("input[name=toggle]:checked").val() == 'audience_segments'){
		type = "audience_segments";
	}
		if($("input[name=toggle]:checked").val() == 'retired_audience_segments'){
		type = "retired_audience_segments";
	}
	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "strat_id,aud_inc_id,aud_exc_id";

	for(var i=0; i<strat_list.length; i++) {

	var current_strat = strat_list[i];
	//console.log(current_strat);
	var counter = 0;
		
		get(current_strat, type, function(current_strat,audience){
					counter++;

					if(counter == strat_list.length){
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
		

};


function get_button(d,numRows){
	var strat = d.strat_id;
	strat_list.push(strat);
	console.log(strat);
	console.log(numRows);

	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "strat_id,aud_inc_id,aud_exc_id";
	console.log(strat_list.length);
	console.log(numRows);
 	if(strat_list.length == numRows){
		dropdown(strat_list);
		} 

};

function upload_button(d){
	feedback = "";
	var strat = d.strat_id;
	console.log(strat);

 	get_aud(strat,d,function(strat,audience){
		add_aud(strat,audience,function(audience_success){
		if (audience_success == 1) {
		feedback = feedback + "Success on " + strat + ": Audiences Added</p>";								
		$("#feedback").html(feedback); 
		}
		else {
		feedback = feedback + audience_success.fontcolor("red") + "<br>";							
		$("#feedback").html(feedback); 
		}
		})
	}) 

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