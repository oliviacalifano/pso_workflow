function upload_zips(d,callback){
	console.log("yes");
    var uploadFile = new FormData();
			var pixel_id = d.id;
			uploadFile.append("name",d.name);
			uploadFile.append("version",d.version);
			uploadFile.append("cost_cpm",d.cost_cpm);
			uploadFile.append("eligible",d.eligible);
			uploadFile.append("pixel_type",d.pixel_type);			
			uploadFile.append("tag_type",d.tag_type);

			console.log(pixel_id,d.name,d.version,d.cost_cpm,d.eligible,d.pixel_type,d.tag_type);
			
	callback(pixel_id,uploadFile);
}

function post(upload,pixel,callback){
		$.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/pixel_bundles/" + pixel,
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

	}
	});
}

function upload_button(data){
	console.log(data);
	feedback="";
	upload_zips(data,function(p_id,upload){
			post(upload,p_id,function(strat,strat_success){
				
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




