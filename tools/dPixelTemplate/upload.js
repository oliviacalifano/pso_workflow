//concept,geo,supply

function upload_zips(d,callback){
    var uploadFile = new FormData();
			var pixel_id = d.id;
			uploadFile.append("name",d.name);
			uploadFile.append("version",d.version);
			uploadFile.append("cost_cpm",d.cost_cpm);
			uploadFile.append("eligible",d.eligible);
			uploadFile.append("pixel_type",d.pixel_type);			
			uploadFile.append("tag_type",d.tag_type);

			console.log(d.id,d.name,d.version,d.cost_cpm,d.eligible,d.pixel_type,d.tag_type);
			
	callback(pixel_id,uploadFile);
}

function post(upload,pixel,callback){
		$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/pixel_bundels/" + pixel,
	contentType: false,
	processData: false,
	data: upload,
	type: 'POST',
	success: function(data,textStatus, jqXHR) { 
	success = 1;

	callback(pixel,success);
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


function upload_button(data){
	console.log(data);
	feedback="";

}


function upload_button2(data){
	console.log(data);
	feedback="";
	upload_zips(data,function(p_id,upload){
			post(p_id,upload,function(strat,strat_success){
				
				if (strat_success == 1) {

					feedback = feedback + "Success on pixel:" +strat +	"</p>";							
					$("#feedback").html(feedback); 
				}
				else {
					feedback = feedback + strat_success.fontcolor("red") + "<br>";							
					$("#feedback").html(feedback); 
				}
			}) 
		})	
}




