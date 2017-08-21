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
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {

			var i = $(xml);
			var a = [];
			
			//console.log(i.find("prop[name=campaign_id]").attr("value"));

			//required
			a.push(i.find("entity").attr("id"));
			var strat_name = i.find("entity").attr("name");
			strat_name = strat_name.replace(/,/g, ';');
			a.push(strat_name);
			a.push(i.find("prop[name=campaign_id]").attr("value"));
			a.push(i.find("prop[name=status]").attr("value"));
			a.push(i.find("prop[name=media_type]").attr("value"));
			a.push(i.find("prop[name=budget]").attr("value"));
			var description = i.find("prop[name=description]").attr("value");
			if(description != undefined)
			{description = description.replace(/\n/g, " ");}
			a.push(description);
			a.push(i.find("prop[name=type]").attr("value"));
			a.push(i.find("prop[name=use_campaign_start]").attr("value"));
			a.push(i.find("prop[name=use_campaign_end]").attr("value"));	
			a.push(i.find("prop[name=start_date]").attr("value"));
			a.push(i.find("prop[name=end_date]").attr("value"));	
			a.push(i.find("prop[name=bid_price_is_media_only]").attr("value"));
			a.push(i.find("prop[name=run_on_all_exchanges]").attr("value"));
			a.push("");
			a.push(i.find("prop[name=frequency_type]").attr("value"));
			a.push(i.find("prop[name=frequency_amount]").attr("value"));
			a.push(i.find("prop[name=frequency_interval]").attr("value"));
			a.push(i.find("prop[name=use_optimization]").attr("value"));
			a.push(i.find("prop[name=goal_type]").attr("value"));
			a.push(i.find("prop[name=goal_value]").attr("value"));
			a.push(i.find("prop[name=max_bid]").attr("value"));
			a.push(i.find("prop[name=pacing_type]").attr("value"));
			a.push(i.find("prop[name=pacing_amount]").attr("value"));
			a.push(i.find("prop[name=pacing_interval]").attr("value"));
			a.push(i.find("prop[name=pixel_target_expr]").attr("value"));
			a.push(i.find("prop[name=roi_target]").attr("value"));
			a.push(i.find("entity").attr("version"));			
			
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

function get_concepts(strat, s, callback){
	var con = s;

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/concepts?q=status%3D%3D1",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var entry = $(xml).find('entity');
			var array = [];
			entry.each(function(){
			var concept_id = $(this).attr('id');
			array.push(concept_id);		
			});
			
			con = con + array.join(";")+",";
			//console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

function get_aud(strat, s, callback){
	var con = s;
	console.log(con);
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/audience_segments?full=*",
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
				var aud_id = $(this).find("prop[name=audience_segment_id]").attr("value");
				if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
				inc_array.push(aud_id);
				}
			}
			if($(this).find("prop[name=restriction]").attr("value") == "EXCLUDE"){
				var aud_id = $(this).find("prop[name=audience_segment_id]").attr("value");
				if(aud_id != undefined && aud_id != "" && aud_id != "undefined"){
				exc_array.push(aud_id);
				}
			}
			});
			
			con = con + inc_array.join(";") + ","+ exc_array.join(";") + ",";
			console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}

function get_ctx(strat, s, callback){
	//console.log(strat);
	var con = s;

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/targeting_segments?full=*&q=restriction%3D%3DINCLUDE",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var entry = $(xml).find('entity');
			var array = [];
			entry.each(function(){
			//console.log($(this));
			var ctx_id = $(this).find("prop[name=targeting_segment_id]").attr('value');
			//console.log(ctx_id);
			if(ctx_id != undefined && ctx_id != "" && ctx_id != "undefined"){
			array.push(ctx_id);
			
			}
			});
			
			con = con + array.join(";") +",";
			//console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}

function get_tech(strat, s, callback){
	var con = s;
	console.log(con);
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/target_dimensions/24",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var include = [];
			var exclude = [];
			var inc = $(xml).find("include").find("entity");
			inc.each(function(){
			var inc_aud_id = $(this).attr('id');
			include.push(inc_aud_id);
			});
			
			var exc = $(xml).find("exclude").find("entity");
			exc.each(function(){
			var exc_aud_id = $(this).attr('id');
			exclude.push(exc_aud_id);
			});
			
			con = con + include.join(";") + "," + exclude.join(";") + ",";
			console.log(con);
			
			callback(strat,con);
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}		

function get_geos(strat, s, callback){
	
	var geo = s;

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/target_dimensions/7",
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
			
			var entry = $(xml).find('entity');
			entry.each(function(){
			var geo_id = $(this).attr('id');
			//console.log(geo_id);
			geo = geo + geo_id+";"
			
			});
			
			geo = geo.slice(0, -1);
			geo = geo + ",";
			//console.log(geo);
			
			callback(strat,geo);
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
	var header = "strat_id,name,campaign_id,status,media_type,budget,description,type,use_campaign_start,use_campaign_end,start_date,end_date,bid_price_is_media_only,run_on_all_exchanges,supply_source_id,frequency_type,frequency_amount,frequency_interval,use_optimization,goal_type,goal_value,max_bid,pacing_type,pacing_amount,pacing_interval,pixel_target_expr,roi_target,version,geo_region,concept_id,aud_inc_id,aud_exc_id,contextual_id,tech_id_inc,tech_id_exc";
	
	//console.log("starting to loop through strats and update geo");
	for(var i=0; i<strat_list.length; i++) {

	var current_strat = strat_list[i];
	//console.log(current_strat);
	var counter = 0;

	get_strat_info(current_strat,function(current_strat,str){
		get_geos(current_strat, str, function(current_strat,str_geo){
			get_concepts(current_strat, str_geo, function(current_strat,str_geo_con){
				get_aud(current_strat, str_geo_con, function(current_strat,str_geo_con_aud){
					get_ctx(current_strat, str_geo_con_aud, function(current_strat,str_geo_con_aud_ctx){
						get_tech(current_strat, str_geo_con_aud_ctx, function(current_strat,str_geo_con_aud_ctx_tech){
				//get_supplies(function(str_con_geo_sup){	
					counter++;
					
					//console.log(str_geo_con);
					if(counter == strat_list.length){
						info = header +info+ "\n"+ str_geo_con_aud_ctx_tech;
						downloadCSV(info, { filename: "Strategy_Template.csv" });
					}
					else{
						//console.log(info);
						info = info +"\n"+ str_geo_con_aud_ctx_tech;
					} 
					//});
					})
					})
					})
			})
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