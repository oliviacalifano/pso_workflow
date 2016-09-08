
function upload_zips(d,callback){
    var uploadFile = new FormData();
	var geo = new FormData();
	var concept = new FormData();
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
			//geo
			
			if(d.geo_region != ""){
			geo.append("include", d.geo_region);
			}
			//concept
			if(d.concept_id != undefined || d.concept_id != ""){
			console.log("HELLLLLO");
			concept.append("concept_id", d.concept_id);
			concept.append("status", "on");
			concept.append("version", d.version);
			}
			console.log(d.name,d.campaign_id,d.status,d.budget,d.description,d.type,d.use_campaign_start,d.use_campaign_end,d.start_date,d.end_date,d.bid_price_is_media_only,d.frequency_type,d.frequency_amount,d.frequency_interval,d.use_optimization,d.goal_type,d.goal_value,d.max_bid,d.pacing_type,d.pacing_amount,d.pacing_interval,d.pixel_target_expr,d.roi_target,d.version,d.geo_region,d.concept_id);
			
	callback(uploadFile,geo,concept, d.concept_id, d.geo_region);
}

function post(upload,row,callback){
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
		var error = "Error on Row " + row + ": " + err;
		callback("",error);
	}
	});
}

function update_geo(s,g,row,callback){
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
		var error = "Error on Row " + row + ": " + err;
		callback("",error);
	}
	});
}

function add_concept(s,c,row,callback){
	c.append("strategy_id", s);
	$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/strategy_concepts",
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
		var error = "Error on Row " + row + ": " + err;
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


$("#punch").click(function() {

	feedback="";
/*  	var fileUpload = document.getElementById("fileSelect");
    if (fileUpload.value != null) {
		var uploadFile = new FormData();
        var files = $("#fileSelect").get(0).files;		
		var f = files[0];  */
		
		d3.csv('royal_create strats_8.1.csv', function(data) {
			console.log(data);
			console.log(data[0]);
			console.log(data.length);
			
			for (var i = 0; i < data.length; i++){
			var count = i +1;			
			upload_zips(data[i],function(upload,geo,concept, c_id, g_id){
 					post(upload,count,function(strat,strat_success){
						
						if (strat_success == 1) {
							feedback = feedback + "Success on Row " + count + ": Strategy Added</p>";							
							$("#feedback").html(feedback); 
						}
						else {
							feedback = feedback + strat_success.fontcolor("red") + "<br>";							
							$("#feedback").html(feedback); 
						}
						
						if(g_id != undefined && g_id != ""){
						update_geo(strat,geo,count,function(strat, geo_success){
							
						if (geo_success == 1) {
							feedback = feedback + "Success on Row " + count + ": Region Added</p>";							
							$("#feedback").html(feedback); 
						
						}
						else {
							feedback = feedback + geo_success.fontcolor("red") + "<br>";							
							$("#feedback").html(feedback); 
						}
						
						})
						}
						
						if(c_id != undefined && c_id != ""){
							add_concept(strat,concept,count,function(concept_success){
							if (concept_success == 1) {
							feedback = feedback + "Success on Row " + count + ": Concept Added</p>";								
							$("#feedback").html(feedback); 
							}
							else {
							feedback = feedback + concept_success.fontcolor("red") + "<br>";							
							$("#feedback").html(feedback); 
							}
							})
						}
						
					}) 
			})
			}
		})
	// add bracket
});




