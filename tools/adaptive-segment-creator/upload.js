function upload_zips(d,p_id,p_name,adv_id,attr,callback){
	console.log("yes");
    var uploadFile = new FormData();
			var pixel_id = d.id;
			uploadFile.append("name",d.name);
			uploadFile.append("owner_type","advertiser");
			uploadFile.append("owner_id",adv_id);
			
			var expression = "{\"behaviors\":{\"id_new_1\":{\"name\":\"" + String(p_name) + "\",\"owner\":[{\"entity_type\":\"advertiser\",\"id\":" + adv_id + "}],\"recency\":{\"op\":\"within\",\"count\":30,\"unit\":\"days\"},\"frequency\":{\"min\":1,\"max\":null,\"op\":\"between\"},\"filter_by\":{\"op\":\"and\",\"values\":[{\"attr_id\":"+attr+",\"op\":\"contains\",\"value\":\"" + String(d.url) + "\"},{\"op\":\"=\",\"left\":{\"op\":\"attribute\",\"attr_id\":1},\"right\":" + String(p_id) + "}]}}},\"expression\":\"id_new_1\"}\r\n";
			
			//jet product name attr = 3356
			//ibm referrer attr = 2308
			
			expression = expression.replace(/\s+/g, '');
			console.log(expression);
			
			uploadFile.append("expression",expression);

			console.log(d.name,d.url);
			
	callback(d.name,uploadFile);
}

function post(upload,pixel,callback){
		$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/dmp/v2.0/segments",
	contentType: false,
	processData: false,
	data: upload,
	type: 'POST',
	success: function(data,textStatus, jqXHR) { 
	success = 1;
	
	var as_pixel_id = data["data"].pixel_id;
	callback(pixel,as_pixel_id,success);
	console.log("success", success,data,textStatus, jqXHR);
	},
	error: function(xml,jqXHR, textStatus, errorThrown) {

	}
	});
}

function upload_button(data){
	var adv_id = $("#adv_list").multipleSelect('getSelects');
	console.log(adv_id[0]);
	
	var pixel_id = $("#dataPixels_list").multipleSelect('getSelects');
	console.log(pixel_id[0]);
	
	var pixel_name = $("#dataPixels_list").multipleSelect('getSelects', 'text');
	console.log(pixel_name[0]);

	var attr = $("#attr_list").multipleSelect('getSelects');
	console.log(attr[0]);	
	
	feedback="";
	upload_zips(data,pixel_id, pixel_name,adv_id,attr,function(as_name,upload){
			post(upload,as_name,function(name,as_p_id,strat_success){
				
				if (strat_success == 1) {

					feedback = feedback + "Success on Adaptive Segment: " + name + ", pixel_id = " + as_p_id + "</p>";							
					$("#feedback").html(feedback); 
				}
				else {
					feedback = feedback + strat_success.fontcolor("red") + "<br>";							
					$("#feedback").html(feedback); 
				}
			}) 
		})	
}




