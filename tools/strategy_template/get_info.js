'use strict' 
//added aud_id
//added tech_id
//pulls in contextual
//pulls in tech_id

var selectedCamps = [];
var csv = ""; 

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

function get_selected_camps() {

	var camp_id = [];
	
	//get all selected strat ids
	$("#campaign_list").each(function(){
		camp_id.push($(this).val());
	});
	
	//print all strats	
	// for (i=0; i<strat_id.length; i++) {
		// console.log(strat_id[i]);
	// }
	 
	return camp_id;
}


function get_camp_info(camp, callback){
	
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/"+camp,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			var entry = $(xml).find('entity').attr('name');
			//console.log(entry);
			callback(camp,entry)
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	



function get_strat_info(strat,callback){
	
	
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"?with=campaign,advertiser",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {

			var i = $(xml);
			var a = [];
			
			//console.log(i.find("prop[name=campaign_id]").attr("value"));

			//required
			
			a.push(i.find("entity").find("entity").attr("id"));
			a.push(i.find("entity").find("entity").attr("name"));
			a.push(i.find("entity").find("entity").find("entity").attr("id"));
			a.push(i.find("entity").find("entity").find("entity").attr("name"));
			a.push(i.find("entity").attr("id"));
			var strat_name = i.find("entity").attr("name");
			strat_name = strat_name.replace(/,/g, ';');
			a.push(strat_name);
			
			
			
		//console.log(a);

		var string = "";
		for (var i = 0; i <a.length; i++){
			if(a[i] == undefined || a[i] == ""){
				string = string + ",";
			}
			else {
				string = string + a[i] +",";
			}	
		}
		//string = string.slice(0, -1);
		
		//console.log(string);
		callback(strat,string)
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	


function get_ctx(strat, callback){
	//console.log(strat);
	var con = "";

	var request = $.ajax({
		//url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/targeting_segments?full=*&q=restriction%3D%3DINCLUDE",
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/retired_targeting_segments?full=*",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var entry = $(xml).find("entity").find("entity");
			var array = [];
			var operator = "";
			entry.each(function(){
			//console.log($(this));
			var ctx_id = $(this).attr('name');
			var dv = $(this).find("prop[name=group_identifier]").attr('value');
			
			if(dv == "tsg1_dv"){
			operator = $(this).find("prop[name=operator]").attr('value');
			}
			//console.log(ctx_id);
			if(ctx_id != undefined && ctx_id != "" && ctx_id != "undefined"){
			array.push(ctx_id);
			
			}
			});
			
			con = con + strat + "," + array.join(";") +",";
			//console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	




function download() {
	var strat_list = [];
	var feedback = "";
	var success = 0; 
	var info = "";
	strat_list = get_selected_strats();
	strat_list = strat_list[0]; 
	var header = "strat_id,ctx";
	
	//console.log("starting to loop through strats and update geo");
	for(var i=0; i<strat_list.length; i++) {

	var current_strat = strat_list[i];
	//console.log(current_strat);
	var counter = 0;

	//get_strat_info(current_strat,function(current_strat,str){
		get_ctx(current_strat, function(current_strat,str_geo){
					counter++;

					if(counter == strat_list.length){
						info = header +info+ "\n"+ str_geo;
						downloadCSV(info, { filename: "Strategy_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ str_geo;
					} 

		//})
		})
		}
		}
	
$("#punch").click(function() {
	console.log("hit!");
	download();

})	

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