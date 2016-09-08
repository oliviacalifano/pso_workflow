
function upload_zips(d,callback){
    var uploadFile = new FormData();
	var geo = new FormData();
	var concept = new FormData();
			console.log(d.name);
			uploadFile.append("name",d.name);
			uploadFile.append("campaign_id",d.campaign_id);
			uploadFile.append("status",d.status);
			uploadFile.append("budget",d.budget);
			uploadFile.append("start_date",d.start_date);
			uploadFile.append("use_campaign_end",d.use_campaign_end);
			uploadFile.append("frequency_type",d.frequency_type);
			uploadFile.append("frequency_amount",d.frequency_amount);
			uploadFile.append("frequency_interval",d.frequency_interval);
			uploadFile.append("goal_type",d.goal_type);
			uploadFile.append("goal_value",d.goal_value);
			uploadFile.append("max_bid",d.max_bid);
			uploadFile.append("pacing_type",d.pacing_type);
			uploadFile.append("pacing_amount",d.pacing_amount);
			uploadFile.append("version",d.version);
			uploadFile.append("pixel_target_expr",d.pixel_target_expr);
			uploadFile.append("type",d.type);
			uploadFile.append("version",d.version);
			geo.append("include", d.geo);
			concept.append("concept_id", d.concept_id);
			concept.append("status", "on");
			concept.append("version", d.version);
			
	callback(uploadFile,geo,concept);
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
	callback(strat);
	console.log("success", success,data,textStatus, jqXHR);
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		alert("Wrong file!");
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
	callback(s);
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		alert("Wrong file!");
	}
	});
}

function add_concept(s,c,callback){
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
	error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		alert("Wrong file!");
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
	var fileUpload = document.getElementById("fileSelect");
    if (fileUpload.value != null) {
		var uploadFile = new FormData();
        var files = $("#fileSelect").get(0).files;		
		
		d3.csv("DX Marketing_Title_Sports Equipment.csv", function(data) {
			console.log(data);
			console.log(data[0]);
			console.log(data.length);
			
			for (var i = 0; i < data.length; i++){
							
			upload_zips(data[i], function(upload,geo,concept){
					post(upload,function(strat){
						update_geo(strat,geo,function(strat){
							add_concept(strat,concept,function(success){
							if (success == 1) {
							feedback = feedback + "<p>Updated</p>";							
							$("#feedback").html(feedback); 
						}
						
						})
						})
					})
			})
			}
		})
	}
});




