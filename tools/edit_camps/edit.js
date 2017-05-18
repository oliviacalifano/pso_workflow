//concept,geo,supply,aud,tech

function upload_zips(d,callback){
    var uploadFile = new FormData();
			//required
			console.log(d.status);
			var camp_id = d.camp_id;

			uploadFile.append("name",d.name);
			uploadFile.append("advertiser_id",d.advertiser_id);
			uploadFile.append("service_type",d.service_type);
			uploadFile.append("start_date",d.start_date);
			uploadFile.append("end_date",d.end_date);
			uploadFile.append("zone_name",d.zone_name);
			uploadFile.append("total_budget",d.total_budget);
			uploadFile.append("margin_pct",d.margin_pct);
			uploadFile.append("goal_type",d.goal_type);
			uploadFile.append("goal_value",d.goal_value);
			uploadFile.append("ad_server_id",d.ad_server_id);
			uploadFile.append("use_mm_freq",d.use_mm_freq);
			uploadFile.append("frequency_amount",d.frequency_amount);
			uploadFile.append("frequency_interval",d.frequency_interval);
			uploadFile.append("frequency_type",d.frequency_type);
			uploadFile.append("conversion_type",d.conversion_type);
			uploadFile.append("conversion_variable_minutes",d.conversion_variable_minutes);
			uploadFile.append("io_name",d.io_name);
			uploadFile.append("io_reference_num",d.io_reference_num);
			uploadFile.append("merit_pixel_id",d.merit_pixel_id);
			uploadFile.append("pc_window_minutes",d.pc_window_minutes);
			uploadFile.append("pv_pct",d.pv_pct);
			uploadFile.append("pv_window_minutes",d.pv_window_minutes);
			uploadFile.append("spend_cap_type",d.spend_cap_type);
			uploadFile.append("spend_cap_automatic",d.spend_cap_automatic);
			uploadFile.append("spend_cap_amount	",d.spend_cap_amount);
				
			//if(d.roi_target != ""){
			//uploadFile.append("roi_target",d.roi_target);
			//}

	callback(camp_id,uploadFile);
}

function post(upload,camp,callback){
	var u = "https://adroit-tools.mediamath.com/t1/api/v2.0/campaigns/"+camp;
		
	$.ajax({
	url: u,
	contentType: false,
	processData: false,
	data: upload,
	type: 'POST',
	success: function(data,textStatus, jqXHR) { 
	success = 1;
	callback(camp,success);
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

function upload_button(data){
	feedback="";
	console.log(data);
			upload_zips(data,function(camp,upload){
 					post(upload,camp,function(camp,strat_success){
						if (strat_success == 1) {
							feedback = feedback + "Success on Row " + name + ": Campaign Edited</p>";							
							$("#feedback").html(feedback); 
						}
						else {
							feedback = feedback + strat_success.fontcolor("red") + "<br>";							
							$("#feedback").html(feedback); 
						}	
					}) 
			})
			//} 
		
	// add bracket
};
