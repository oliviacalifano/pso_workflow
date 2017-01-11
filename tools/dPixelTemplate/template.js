'use strict' 

var csv = ""; 

function get_selected_dPixels() {

	var pixel_id = [];
	
	//get all selected strat ids
	$("#dataPixels_list").each(function(){
		pixel_id.push($(this).val());
	});
	
	//print all strats	
	// for (i=0; i<strat_id.length; i++) {
		// console.log(strat_id[i]);
	// }
	 
	return pixel_id;
}

function get_strat_info(strat,callback){
	
	
	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/api/v2.0/pixel_bundles/"+strat,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {

			var i = $(xml);
			var a = [];
			
			//console.log(i.find("prop[name=campaign_id]").attr("value"));

			//required
			a.push(i.find("entity").attr("id"));
			a.push(i.find("entity").attr("name"));
			a.push(i.find("entity").attr("version"));
			a.push(i.find("prop[name=cost_cpm]").attr("value"));
			a.push(i.find("prop[name=eligible]").attr("value"));
			a.push(i.find("prop[name=pixel_type]").attr("value"));
			a.push(i.find("prop[name=tag_type]").attr("value"));
				
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
	var pixel_list = [];
	var feedback = "";
	var success = 0; 
	var info = "";
	pixel_list = get_selected_dPixels();
	pixel_list = pixel_list[0]; 
	var header = "id,name,version,cost_cpm,eligible,pixel_type,tag_type";
	
	console.log("starting to loop through strats and update geo");
	for(var i=0; i<pixel_list.length; i++) {

	var current_pixel = pixel_list[i];
	console.log(current_pixel);
	var counter = 0;

	get_strat_info(current_pixel,function(current_pixel,str){
					counter++;
					//console.log(counter);
 					//console.log(head);
					//if(header.length > head.length){head = header;}
					
					//console.log(str_geo_con);
					if(counter == pixel_list.length){
						info = header +info+ "\n"+ str;
						downloadCSV(info, { filename: "Data_Pixel_Template.csv" });
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