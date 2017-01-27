'use strict' 

var selectedCamps = [];
var csv = ""; 

function get_selected_camps() {

	var camp_id = [];
	
	//get all selected strat ids
	$("#strat_list").each(function(){
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
			console.log(entry);
			callback(camp,entry)
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function get_strat_info(strat,callback){
	
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+ strat +"?with=campaign",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
		
		var camp_id = $(xml).find('entity').find('entity').attr('id');
		console.log(camp_id);
		
		var camp_name = $(xml).find('entity').find('entity').attr('name');
		console.log(camp_name);
		
		var strat_id = $(xml).find('entity').attr('id');
		console.log(strat_id);
		
		var strat_name = $(xml).find('entity').attr('name');
		console.log(strat_name);
		
		var info = camp_id + "," + camp_name + "," + strat_id + "," + strat_name;
		
		callback(strat,info)
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function get_sitelists(strat,callback){
	
	
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+ strat +"/site_lists?q=assigned%3D%3D1&full=*&sort_by=id",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
		
		var site_id = $(xml).find('entity').attr('id');
		console.log(site_id);
		
		var site_name = $(xml).find('entity').attr('name');
		console.log(site_name);
		

		callback(strat,site_id,site_name)
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function download() {
	var camp_list = [];
	var feedback = "";
	var success = 0; 
	var info = "";
	camp_list = get_selected_camps();
	camp_list = camp_list[0];
	
	var header = "campaign_id,campaign_name,strat_id,strat_name,sitelist_id,sitelist_name";
	
	console.log("starting to loop through strats and update geo");
	for(var i=0; i<camp_list.length; i++) {

	var current_camp = camp_list[i];
	console.log(current_camp);
	var counter = 0;

	get_strat_info(current_camp,function(current_camp,ids){	
		get_sitelists(current_camp,function(current_camp,site_id,site_name){	
					counter++;

					if(counter == camp_list.length){
						info = header +info+ "\n"+ ids + "," + site_id + "," + site_name;
						downloadCSV(info, { filename: "strategy_sitelists_assigned.csv" });
					}
					else{
						console.log(info);
						info = info +"\n"+ ids + "," + site_id + "," + site_name;
					} 
	})
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