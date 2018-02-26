
var strat_list = []; 

function get_dvce(strat,d,callback){
	var device = new FormData();

		device.append('include_op', "OR");
		device.append('exclude_op', "OR");
			
	callback(strat,device);
}


function add_dvce(s,dvce,callback){
	//c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/target_dimensions/15",
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
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/target_dimensions/15",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var inc_array = [];
			
			var entry_inc = $(xml).find("include").find("entity");
			
			entry_inc.each(function(){	
				var inc = $(this).attr("id");
				//if(inc != undefined && inc != "" && inc != "undefined"){
				inc_array.push(inc);
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
	var header = "strat_id,fold_id";
 	if(strat_list.length == numRows){
	for(var i=0; i<strat_list.length; i++) {

	var current_strat = strat_list[i];
	var counter = 0;
		
		get(current_strat, function(current_strat,fold){
					counter++;

					if(counter == strat_list.length){
						info = header +info+ "\n"+ current_strat  + "," + fold;
						downloadCSV(info, { filename: "Strategy_Device_Template.csv" });
					}
					else{	
						info = info +"\n"+ current_strat  + "," + fold;
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