'use strict' 

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
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/"+strat,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {

			var i = $(xml);
			var a = [];
			
			//console.log(i.find("prop[name=campaign_id]").attr("value"));

			//required
			a.push(i.find("prop[name=status]").attr("value"));
			a.push(i.find("prop[name=name]").attr("value"));
			a.push(i.find("prop[name=advertiser_id]").attr("value"));
			a.push(i.find("prop[name=service_type]").attr("value"));
			a.push(i.find("prop[name=start_date]").attr("value"));
			a.push(i.find("prop[name=end_date]").attr("value"));
			a.push(i.find("prop[name=zone_name]").attr("value"));
			a.push(i.find("prop[name=total_budget]").attr("value"));
			a.push(i.find("prop[name=margin_pct]").attr("value"));
			a.push(i.find("prop[name=goal_type]").attr("value"));
			a.push(i.find("prop[name=goal_value]").attr("value"));
			a.push(i.find("prop[name=ad_server_id]").attr("value"));
			a.push(i.find("prop[name=use_mm_freq]").attr("value"));
			a.push(i.find("prop[name=frequency_amount]").attr("value"));
			a.push(i.find("prop[name=frequency_interval]").attr("value"));
			a.push(i.find("prop[name=frequency_type]").attr("value"));
			a.push(i.find("prop[name=conversion_type]").attr("value"));
			a.push(i.find("prop[name=conversion_variable_minutes]").attr("value"));
			a.push(i.find("prop[name=io_name]").attr("value"));
			a.push(i.find("prop[name=io_reference_num]").attr("value"));
			a.push(i.find("prop[name=merit_pixel_id]").attr("value"));
			a.push(i.find("prop[name=pc_window_minutes]").attr("value"));
			a.push(i.find("prop[name=pv_pct]").attr("value"));
			a.push(i.find("prop[name=pv_window_minutes]").attr("value"));
			a.push(i.find("prop[name=spend_cap_type]").attr("value"));
			a.push(i.find("prop[name=spend_cap_automatic]").attr("value"));
			a.push(i.find("prop[name=spend_cap_amount]").attr("value"));	
			
		console.log(a);

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
		
		console.log(string);
		callback(strat,string)
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function download() {
	var info = "";
	var camp_list = [329781,329704];
	var header = "status,name,advertiser_id,service_type,start_date,end_date,zone_name,total_budget,margin_pct,goal_type,goal_value,ad_server_id,use_mm_freq,frequency_amount,frequency_interval,frequency_type,conversion_type,conversion_variable_minutes,io_name,io_reference_num,merit_pixel_id,pc_window_minutes,pv_pct,pv_window_minutes,spend_cap_type,spend_cap_automatic,spend_cap_amount";
	
	console.log("starting to loop through strats and update geo");
	for(var i=0; i<camp_list.length; i++) {

	var current_strat = camp_list[i];
	console.log(current_strat);
	var counter = 0;

	get_strat_info(current_strat,function(current_strat,str){
					counter++;
					if(counter == camp_list.length){
						info = header +info+ "\n"+ str;
						downloadCSV(info, { filename: "Strategy_Template.csv" });
					}
					else{
						console.log(info);
						info = info +"\n"+ str;
					} 	
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