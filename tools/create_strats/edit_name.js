
var strat_list = []; 

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

function add_ctx(id,name,version,callback){
	var strat_info = new FormData();
	strat_info.append("name", name);
	strat_info.append("version", version);
	
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+id,
	contentType: false,
	processData: false,
	data: strat_info,
	type: 'POST',
	success: function(data,textStatus, jqXHR) { 
	success = 1;
	console.log("success", success,data,textStatus, jqXHR);
	callback(success);
	},
	error: function(xml,jqXHR, textStatus, errorThrown) {
		success = 0;
		var err = xml.responseXML.getElementsByTagName("field-error")[0].getAttribute('error');
		console.log(err);
		var error = "Audience Error on Row " + s + ": " + err;
		callback(error);
	}
	});
}



function upload_button(d){
	feedback = "";
	var strat = d.strat_id;
	var strat_name = d.name;
	var strat_version = d.version;
	console.log(strat);

		add_ctx(strat,strat_name,strat_version,function(ctx_success){
		if (ctx_success == 1) {
		feedback = feedback + "Success on " + strat + ": Names Updated</p>";								
		$("#feedback").html(feedback); 
		}
		else {
		feedback = feedback + ctx_success.fontcolor("red") + "<br>";							
		$("#feedback").html(feedback); 
		}
		})

};

function get(strat, callback){
	console.log(strat);
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {

			var strat_name = $(xml).find("entity").attr("name");
			strat_name = strat_name.replace(",", ";");
			var strat_status = $(xml).find("prop[name=status]").attr("value");
			var strat_version = $(xml).find("entity").attr("version");
			var info = strat_name + "," + strat_status + "," + strat_version;
			console.log(info);
			
			callback(strat,info);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}


$("#get_dropdown").click(function() {

	console.log("hit!");
	dropdown(); 	
})

//get names
function dropdown(){
	var strat_list_drop = [];
	strat_list_drop = get_selected_strats();
	strat_list_drop = strat_list_drop[0]; 

	var feedback = "";
	var success = 0; 
	var info = "";
	var header = "strat_id,name,status,version";
 
	for(var i=0; i<strat_list_drop.length; i++) {

	var current_strat = strat_list_drop[i];
	console.log(current_strat);
	var counter = 0;
		
		get(current_strat, function(current_strat,ctx){
					counter++;
					console.log(current_strat);
					console.log(ctx);
					if(counter == strat_list_drop.length){
						info = header +info+ "\n"+ current_strat  + "," + ctx;
						downloadCSV(info, { filename: "Strategy_Name_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ current_strat  + "," + ctx;
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