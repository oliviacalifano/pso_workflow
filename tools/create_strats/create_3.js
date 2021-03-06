//concept,geo,supply,aud,tech,contextual(new)

function upload_zips(d,callback){
    var uploadFile = new FormData();
	var geo = new FormData();
	var concept = new FormData();
	var supply = new FormData();
	var audience = new FormData();
	var contextual = new FormData();
	var technology = new FormData();
			//required
			console.log(d.status);
			uploadFile.append("name",d.name);
			uploadFile.append("campaign_id",d.campaign_id);
			uploadFile.append("budget",d.budget);
			uploadFile.append("type",d.type);
			uploadFile.append("use_campaign_start",d.use_campaign_start);
			uploadFile.append("use_campaign_end",d.use_campaign_end);			
			uploadFile.append("frequency_type",d.frequency_type);
			uploadFile.append("goal_type",d.goal_type);
			uploadFile.append("goal_value",d.goal_value);
			uploadFile.append("max_bid",d.max_bid);
			uploadFile.append("pacing_amount",d.pacing_amount);
			uploadFile.append("version",d.version);
			
			//conditional
			if(d.status != ""){
			uploadFile.append("status",d.status);
			}
			if(d.media_type != ""){
			uploadFile.append("media_type",d.media_type);
			}
			if(d.description != ""){
			uploadFile.append("description",d.description);
			}
			
			if(d.start_date != ""){
			uploadFile.append("start_date",d.start_date);
			}
			
			if(d.end_date != ""){
			uploadFile.append("end_date",d.end_date);			
			}
			
			if(d.bid_price_is_media_only != ""){
			uploadFile.append("bid_price_is_media_only",d.bid_price_is_media_only);
			}
			if(d.frequency_amount != ""){
			uploadFile.append("frequency_amount",d.frequency_amount);
			}
			if(d.frequency_interval != ""){
			uploadFile.append("frequency_interval",d.frequency_interval);
			}
			if(d.use_optimization != ""){
			uploadFile.append("use_optimization",d.use_optimization);
			}
			if(d.pacing_type != ""){
			uploadFile.append("pacing_type",d.pacing_type);
			}
			if(d.pacing_interval != ""){
			uploadFile.append("pacing_interval",d.pacing_interval);
			}
			if(d.pixel_target_expr != ""){
			uploadFile.append("pixel_target_expr",d.pixel_target_expr);
			}
			if(d.roi_target != ""){
			uploadFile.append("roi_target",d.roi_target);
			}
			
			//supply
			if(d.run_on_all_exchanges != ""){
			uploadFile.append("run_on_all_exchanges", d.run_on_all_exchanges);
			}
			if(d.run_on_all_exchanges == "off"){
				var supplies = d.supply_source_id;
				supplies = supplies.split(';');
				for (i=0; i<supplies.length; i++) {
				supply.append('supply_source.'+(i+1).toString()+'.id', supplies[i]);
				}
			}			
			
			//geo
			if(d.geo_region != ""){
				var geos = d.geo_region;
				geos = geos.split(';');
				for (i=0; i<geos.length; i++) {	
				geo.append('include', geos[i]);
				}
			}
			
			//concept
			if(d.concept_id != undefined || d.concept_id != ""){
				var concepts = d.concept_id;
				concepts = concepts.split(';');
				for (i=0; i<concepts.length; i++) {
				concept.append('concepts.'+(i+1).toString()+'.id', concepts[i]);
				}
			}
			
			//audience
			if(d.aud_id != undefined || d.aud_id != ""){
				var aud = d.aud_id;
				aud = aud.split(';');
				for (i=0; i<aud.length; i++) {
				audience.append('segments.'+(i+1).toString()+'.id', aud[i]);
				audience.append('segments.'+(i+1).toString()+'.restriction', "INCLUDE");
				}
				audience.append('exclude_op', "OR");
				audience.append('include_op', "OR");
			}
			
			//contextual
			if(d.contextual_id != undefined || d.contextual_id != ""){
				var con = d.contextual_id;
				con = con.split(';');
				for (i=0; i<con.length; i++) {
				contextual.append('segments.'+(i+1).toString()+'.id', con[i]);
				contextual.append('segments.'+(i+1).toString()+'.restriction', "INCLUDE");
				contextual.append('segments.'+(i+1).toString()+'.operator', "AND");
				}
				contextual.append('exclude_op', "OR");
				contextual.append('include_op', "OR");
			}
			
			//technology
			if(d.tech_id != undefined || d.tech_id != ""){
				var tech = d.tech_id;
				tech = tech.split(';');
				for (i=0; i<tech.length; i++) {
				technology.append('include', tech[i]);
				//technology.append('exclude', "");
				}
			}
			
			console.log(d.name,d.campaign_id,d.status,d.budget,d.description,d.type,d.use_campaign_start,d.use_campaign_end,d.start_date,d.end_date,d.bid_price_is_media_only,d.frequency_type,d.frequency_amount,d.frequency_interval,d.use_optimization,d.goal_type,d.goal_value,d.max_bid,d.pacing_type,d.pacing_amount,d.pacing_interval,d.pixel_target_expr,d.roi_target,d.version,d.geo_region,d.concept_id);
			
	callback(uploadFile,geo,concept,supply,audience,technology,contextual,d.concept_id,d.geo_region,d.supply_source_id,d.aud_id,d.tech_id,d.contextual_id,d.name);
}

function post(upload,callback){
		$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies",
	contentType: false,
	processData: false,
	data: upload,
	type: 'POST',
	success: function(data,textStatus, jqXHR) { 
	success = 1;
	var strat = $(data).find('entity').attr('id');
	console.log(strat);
	callback(strat,success);
	console.log("success", success,data,textStatus, jqXHR);
	},
	error: function(xml,jqXHR, textStatus, errorThrown) {
		//var err = xhr.responseXML.getElementsByTagName("field-error");
		var err = xml.responseXML.getElementsByTagName("field-error")[0].getAttribute('error');
		console.log(err);
		var error = "Error on Row: " + err;
		callback("",error);
	}
	});
}

function update_geo(s,g,callback){
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/target_dimensions/7",
	contentType: false,
	processData: false,
	data: g,
	type: 'POST',
	success: function(data,textStatus, jqXHR) { 
	success = 1;
	console.log("success", success,data,textStatus, jqXHR);
	callback(s,success);
	},
	error: function(xml,jqXHR, textStatus, errorThrown) {
		//var err = xhr.responseXML.getElementsByTagName("field-error");
		var err = xml.responseXML.getElementsByTagName("field-error")[0].getAttribute('error');
		console.log(err);
		var error = "Geo Error on Row " + s + ": " + err;
		callback("",error);
	}
	});
}

function add_concept(s,c,callback){
	//c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/concepts",
	contentType: false,
	processData: false,
	data: c,
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

function add_aud(s,c,callback){
	//c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/audience_segments",
	contentType: false,
	processData: false,
	data: c,
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

function add_contextual(s,c,callback){
	//c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/targeting_segments",
	contentType: false,
	processData: false,
	data: c,
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
		var error = "Contextual Error on Row " + s + ": " + err;
		callback(error);
	}
	});
}

function add_tech(s,c,callback){
	//c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+s+"/target_dimensions/24",
	contentType: false,
	processData: false,
	data: c,
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
		var error = "Tech Error on Row " + s + ": " + err;
		callback(error);
	}
	});
}

function add_supply(strat,s,callback){
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategies/"+strat+"/supplies",
	contentType: false,
	processData: false,
	data: s,
	type: 'POST',
	success: function(data,textStatus, jqXHR) { 
	success = 1;
	console.log("success", success,data,textStatus, jqXHR);
	callback(success);
	},
	error: function(xml,jqXHR, textStatus, errorThrown) {
		//var err = xhr.responseXML.getElementsByTagName("field-error");
		var err = xml.responseXML.getElementsByTagName("status")[0].getAttribute('error');
		console.log(err);
		var error = "Supply Error on Row " + strat + ": " + err;
		callback(error);
	}
	});
}

$("#geo_button").click(function() {
$("#feedback_geo").clear;
var id = $("#geo_dropdown").val();
var geo = $("#geo_dropdown").multipleSelect('getSelects', 'text');


feedback = geo + ": " + id;							
$("#feedback_geo").html(feedback); 

});

$("#sup_button").click(function() {
$("#feedback_sup").clear;
var id = $("#supply_list").val();
var sup = $("#supply_list").multipleSelect('getSelects', 'text');


feedback = sup + ": " + id;							
$("#feedback_sup").html(feedback); 

});



function upload_button(data){
	feedback="";
/*  	var fileUpload = document.getElementById("fileSelect");
    if (fileUpload.value != null) {
		var uploadFile = new FormData();
        var files = $("#fileSelect").get(0).files;		
		var f = files[0];  */
		
			console.log(data);
			
 			//for (var i = 0; i < data.length; i++){
			//var count = i +1;			
			upload_zips(data,function(upload,geo,concept,supply,aud,tech,contextual,c_id,g_id,s_id,a_id,t_id,contextual_id,name){
 					post(upload,function(strat,strat_success){
						
						if (strat_success == 1) {
							feedback = feedback + "Success on Row " + name + ": Strategy Added</p>";							
							$("#feedback").html(feedback); 
						}
						else {
							feedback = feedback + strat_success.fontcolor("red") + "<br>";							
							$("#feedback").html(feedback); 
						}
						
						if(g_id != undefined && g_id != ""){
						update_geo(strat,geo,function(strat, geo_success){
							
						if (geo_success == 1) {
							feedback = feedback + "Success on Row " + name + ": Regions Added</p>";							
							$("#feedback").html(feedback); 
						
						}
						else {
							feedback = feedback + geo_success.fontcolor("red") + "<br>";							
							$("#feedback").html(feedback); 
						}
						
						})
						}
						
						if(c_id != undefined && c_id != ""){
							add_concept(strat,concept,function(concept_success){
							if (concept_success == 1) {
							feedback = feedback + "Success on Row " + name + ": Concepts Added</p>";								
							$("#feedback").html(feedback); 
							}
							else {
							feedback = feedback + concept_success.fontcolor("red") + "<br>";							
							$("#feedback").html(feedback); 
							}
							})
						}
						if(a_id != undefined && a_id != ""){
							add_aud(strat,aud,function(audience_success){
							if (audience_success == 1) {
							feedback = feedback + "Success on Row " + name + ": Audiences Added</p>";								
							$("#feedback").html(feedback); 
							}
							else {
							feedback = feedback + audience_success.fontcolor("red") + "<br>";							
							$("#feedback").html(feedback); 
							}
							})
						}
						if(contextual_id != undefined && contextual_id != ""){
							add_contextual(strat,contextual,function(contextual_success){
							if (contextual_success == 1) {
							feedback = feedback + "Success on Row " + name + ": Contextual Added</p>";								
							$("#feedback").html(feedback); 
							}
							else {
							feedback = feedback + contextual_success.fontcolor("red") + "<br>";							
							$("#feedback").html(feedback); 
							}
							})
						}
						if(t_id != undefined && t_id != ""){
							add_tech(strat,tech,function(technology_success){
							if (technology_success == 1) {
							feedback = feedback + "Success on Row " + name + ": Technologies Added</p>";								
							$("#feedback").html(feedback); 
							}
							else {
							feedback = feedback + technology_success.fontcolor("red") + "<br>";							
							$("#feedback").html(feedback); 
							}
							})
						}
						if(s_id != undefined && s_id != ""){
							add_supply(strat,supply,function(supply_success){
							if (supply_success == 1) {
							feedback = feedback + "Success on Row " + name + ": Supplies Added</p>";								
							$("#feedback").html(feedback); 
							}
							else {
							feedback = feedback + supply_success.fontcolor("red") + "<br>";							
							$("#feedback").html(feedback); 
							}
							})
						}
						
					}) 
			})
			//} 
		
	// add bracket
};




