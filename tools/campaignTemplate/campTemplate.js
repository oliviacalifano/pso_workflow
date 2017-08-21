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
		
			//var i = $(xml).find("prop");
			//console.log(i);
			//a.push(i.find("entity").attr("name"));
			//i.each(function(result){
				//a.push($(this).attr("name"));
			//})
			
			//console.log(i.find("prop[name=campaign_id]").attr("value"));

			//required
 			a.push(i.find("entity").attr("id"));
			a.push(i.find("entity").attr("version"));
		
			a.push(i.find("prop[name=status]").attr("value"));
			a.push(i.find("prop[name=name]").attr("value"));
			a.push(i.find("prop[name=service_type]").attr("value"));
			a.push(i.find("prop[name=goal_value]").attr("value"));
			a.push(i.find("prop[name=margin_pct]").attr("value"));
			a.push(i.find("prop[name=currency_code]").attr("value"));
			a.push(i.find("prop[name=spend_cap_type]").attr("value"));
			a.push(i.find("prop[name=impression_cap_type]").attr("value"));
			a.push(i.find("prop[name=spend_cap_automatic]").attr("value"));
			a.push(i.find("prop[name=impression_cap_automatic]").attr("value"));
			a.push(i.find("prop[name=frequency_type]").attr("value"));
			a.push(i.find("prop[name=frequency_amount]").attr("value"));
			a.push(i.find("prop[name=frequency_interval]").attr("value"));
			a.push(i.find("prop[name=minimize_multi_ads]").attr("value"));
			a.push(i.find("prop[name=merit_pixel_id]").attr("value"));
			a.push(i.find("prop[name=pc_window_minutes]").attr("value"));
			a.push(i.find("prop[name=pv_window_minutes]").attr("value"));
			a.push(i.find("prop[name=pv_pct]").attr("value"));
			a.push(i.find("prop[name=conversion_variable_minutes]").attr("value"));
			a.push(i.find("prop[name=has_custom_attribution]").attr("value"));
			a.push(i.find("prop[name=io_name]").attr("value"));
			a.push(i.find("prop[name=io_reference_num]").attr("value"));
			a.push(i.find("prop[name=conversion_type]").attr("value"));
			a.push(i.find("prop[name=zone_name]").attr("value"));
			a.push(i.find("prop[name=frequency_optimization]").attr("value"));
			a.push(i.find("prop[name=goal_type]").attr("value"));
			a.push(i.find("prop[name=restrict_targeting_to_deterministic_id]").attr("value"));
			a.push(i.find("prop[name=restrict_targeting_to_same_device_id]").attr("value"));
			a.push(i.find("prop[name=override_suspicious_traffic_filter]").attr("value"));
			a.push(i.find("prop[name=suspicious_traffic_filter_level]").attr("value")); 
			
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
	var camp_list = [329781,329704,361432,363587,363594,361437,363595,352584,296771,203703,203594,346877,352590,206354,206359,187169,175828,131074,110814,329630,329655,329691,329675,329686,329669,329643,329656,182163,306497,306521,130619,254964,187198,120188,264716,355814,355379,355409,355862,355391,355401,236151,318514,280982,361332,305786,149722,168962,337202,343549,321376,321367,343570,240400,311245,336099,257330,283500,186798,348405,264199,117061,316183,153360,320163,105105,110612,207500,122329,253310,253295,264656,262734,101646,282897,282912,222110,162952,219235,219189,144488,129155,308252,149530,237321,191915,188567,204563,118378,109517,187201,280242,187902,334818,127943,174936,204127,208349,171156,344769,361988,362006,264905,351354,250900,189313,271641,216953,157076,355114,354776,362716,354807,354765,362748,354825,354772,108563,281168,125406,127360,362374,350357,239385,189094,151078,160900,193414,364389,193955,256558,199281,132275,158376,259302,121712,208397,208198,209740,234896,101644,107756,302799,348092,355502,307936,360236,327939,254742,123824,304247,354194,224934,362874,358810,186795,101778,186793,139257,254922,261545,198966,260472,352290,352290,228627,142691,305760,306274,318148,146331,229597,352600,165354,189379,189391,199145,199044,248042,172124,283017,349219,165582,159758,155207,182152,228481,245070,132837,145387,182135,155218,182141,157075,129751,352602,282587,367478,302783,185785,339258,339368,339461,339373,292055,181117,364257,364245,156489,154200,260660,241090,104616,185160,209743,259628,186329,180965,293068,351939,192345,192535,169853,228159,183874,354172,307579,323250,140770,102363,344869,309197,309188,164560,221979,113297,131287,344718,278557,110834,152045,323954,223841,139406,179298,209949,209746,367530,367533,359615,367531,251499,250610,246838,210123,256408,230930,257502,179332,297856,309215,309214,249496,144052,276546,290166,195374,107757,190075,187164,364169,367543,266905,203702,186185,185985,215590,187172,320856,311798,327258,271728,145223,248962,367714,250587,366193,282854,321380,361833,361836,340744,340748,349256,264661,103403,131061,308567,186129,178645,190877,346346,360820,326088,360812,305280,180272,313431,312974,298893,110666,367550,259304,165587,227545,268521,356711];
	var header = "camp_id,version,status,name,service_type,goal_value,margin_pct,currency_code,spend_cap_type,impression_cap_type,spend_cap_automatic,impression_cap_automatic,frequency_type,frequency_amount,frequency_interval,minimize_multi_ads,merit_pixel_id,pc_window_minutes,pv_window_minutes,pv_pct,conversion_variable_minutes,has_custom_attribution,io_name,io_reference_num,conversion_type,zone_name,frequency_optimization,goal_type,restrict_targeting_to_deterministic_id,restrict_targeting_to_same_device_id,override_suspicious_traffic_filter,suspicious_traffic_filter_level";
	
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