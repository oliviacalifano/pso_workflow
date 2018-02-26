'use strict' 

//returns selected ctxlices
function get_selected_pixels() 
{
	var ctxl_id = []; 
	
	//get selected ctxlice ids
	$("#dataPixels_list").each(function() { 
		ctxl_id.push($(this).val()); 
	});
	console.log(ctxl_id);
	
	return ctxl_id[0];
}


function get_dataPixel_targets(id,name,callback){
	
	var p_name = [];
	p_name = name.split(/\s-\s(.*)/g);
	console.log(p_name);
	console.log(name);
	var namespace = $("#fname").val();
	console.log(namespace);
	var pixel = $("#lname").val();
	console.log(typeof pixel);

	var request = $.ajax({
		url: "https://adroit-tools.mediamath.com/t1/uniques/v1/segments/" + namespace + ":"+ id +"/stats/daily",
		type: "GET",
		cache: false,
	
		success: function(xml) {
			
			var version = $(xml);
			console.log(version);
			
			var array = typeof version != 'object' ? JSON.parse(version) : version;
            
			var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = id + "," + p_name[1];
                for (var index in array[i]) {
                    if (line != '') line += ','

                    line += array[i][index];
                }

                str += line + '\r\n';
            }
			
			console.log(str);
			//str = "pixel_id,date,loads,uniques" +'\r\n'+ str;
			//downloadCSV(str, { filename: "uniques_" + pixel + ".csv" });
			callback(id,str);
			
			
		},	
		error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		}
	})
}	

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

function update_ctxl_targeting() {
	var adv = $("#adv_list").val();
	console.log(adv);
	console.log($("#adv_list"));
	var pixel_history = "";
	var pixel_list = [];
	var feedback = "";
		
	pixel_list = get_selected_pixels();
	console.log("pixel list:", pixel_list);
	
	var pixel_names = $("#dataPixels_list").multipleSelect('getSelects', 'text');
	console.log(pixel_names);

	var adv_name = $("#adv_list").multipleSelect('getSelects', 'text');
	console.log(adv_name);	
	
		console.log("starting to loop through strats and update geo");
		for(var i=0; i<pixel_list.length; i++) {
		
	 		//get list of current supplies attached to strat
			console.log("updating this strat:",pixel_list[i]);
			var current_strat = pixel_list[i];
			var current_name = pixel_names[i];
			var counter = 0;
			
			get_dataPixel_targets(current_strat, current_name, function(current_strat, doc) 
			{	counter++;
				console.log(counter);
				if(counter == pixel_list.length){
				pixel_history = "pixel_id,pixel_name,date,loads,uniques" +'\r\n' + pixel_history + doc;
				downloadCSV(pixel_history, { filename: "Pixel_Loads_" + "Advertiser_"+adv_name + ".csv" });
				}
				else{
				pixel_history = pixel_history + doc;
			}
			});
			
		}
}

$("#punch").click(function() {
	
	console.log("hit!");
	update_ctxl_targeting(); 
	
})	
