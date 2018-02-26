
var strat_list = []; 

function get_dvce(strat,d,callback){
	var device = new FormData();

		var dvce_inc = d.dvce_inc_id;
		var dvce_exc = d.dvce_exc_id;
		dvce_inc = dvce_inc.split(';');
		dvce_exc = dvce_exc.split(';');
		
		var index_inc = dvce_inc.indexOf("");
		var index_exc = dvce_exc.indexOf("");
		
		if (index_inc > -1) {
			dvce_inc.splice(index_inc, 1);
			}
		if (index_exc > -1) {
			dvce_exc.splice(index_exc, 1);
			}
		
		var inc_length = dvce_inc.length;
		console.log(inc_length);
		var exc_length = dvce_exc.length;
		console.log(exc_length);
		var total_length = inc_length + exc_length;
		console.log(total_length);
		
		if(inc_length != 0 || exc_length != 0){
		for (i=0; i<inc_length; i++) {
		device.append('include', dvce_inc[i]);
		console.log("entered loop");
		}
		for (i=0; i<exc_length; i++) {
		device.append('exclude', dvce_exc[i]);
		}
}
		device.append('include_op', "OR");
		device.append('exclude_op', "OR");
			
	callback(strat,device);
}


function add_dvce(s,dvce,callback){
	//c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/target_dimensions/24",
	contentType: false,
	processData: false,
	data: dvce,
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
		var error = "Device Error on Row " + s + ": " + err;
		callback(error);
	}
	});
}

function upload_button(d){
	feedback = "";
	var strat = d.strat_id;
	console.log(strat);

 	get_dvce(strat,d,function(strat,dvce){
		add_dvce(strat,dvce,function(dvce_success){
		if (dvce_success == 1) {
		feedback = feedback + "Success on " + strat + ": Audiences Added</p>";								
		$("#feedback").html(feedback); 
		}
		else {
		feedback = feedback + dvce_success.fontcolor("red") + "<br>";							
		$("#feedback").html(feedback); 
		}
		})
	}) 

};

function get(strat, callback){
	var con = "";
	console.log(con);
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/target_dimensions/24",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var inc_array = [];
			var exc_array = [];
			var entry_inc = $(xml).find("include").find("entity");
			var entry_exc = $(xml).find("exclude").find("entity");
			entry_inc.each(function(){	
				var inc = $(this).attr("id");
				//if(inc != undefined && inc != "" && inc != "undefined"){
				inc_array.push(inc);
				//}
			});
			entry_exc.each(function(){	
				var exc = $(this).attr("id");
				//if(exc != undefined && exc != "" && exc != "undefined"){
				exc_array.push(exc);
				//}
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

function get_button(d,numRows){
	var strat = d.strat_id;
	strat_list.push(strat);
	console.log(strat);
	console.log(numRows);

	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "strat_id,dvce_inc_id,dvce_exc_id";
 	if(strat_list.length == numRows){
	for(var i=0; i<strat_list.length; i++) {

	var current_strat = strat_list[i];
	var counter = 0;
		
		get(current_strat, function(current_strat,dvce){
					counter++;

					if(counter == strat_list.length){
						info = header +info+ "\n"+ current_strat  + "," + dvce;
						downloadCSV(info, { filename: "Strategy_Device_Template.csv" });
					}
					else{	
						info = info +"\n"+ current_strat  + "," + dvce;
					} 
					})

		}
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