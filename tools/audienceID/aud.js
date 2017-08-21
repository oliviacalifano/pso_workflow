function get_selected_vendors() 
{
	var vendor_id = []; 
	
	//get selected ctxlice ids
	$("#vendor_dropdown").each(function() { 
		vendor_id.push($(this).val()); 
	});
	console.log(vendor_id);
	
	return vendor_id[0];
}

/* function post(vendor,search,callback){
	var feedback = "";
	var audience = "";
	var count = 0;
	var request = $.ajax({
	url: "https://adroit-tools.mediamath.com/t1/api/v2.0/path_audience_segments?full=*&sort_by=audience_vendor_id%2Cname%2Cid&order_by=ascending&only_brain_enabled=false&agency_id=112282&currency_code=USD&q=name%3D%3A*"+search+"*%26audience_vendor_id%3D%3D"+vendor,
		type: "GET",
		cache: false,
		dataType: "xml",
	
		success: function(xml) {
	success = 1;
	//var strat = $(data).find('entity').attr('id');
			var counter = $(xml).find("entities").attr("count");
			console.log(counter);
			var entry = $(xml).find('prop[name="full_path"]');
			entry.each(function(){
			count++;
			audience = $(this).attr('value');
			console.log(audience);
			});
	callback(count,counter,audience);
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown)
		alert("Wrong file!");
	}
	});
	
} */

/* function counter(callback){
	var feedback = "";
	var audience = "";
	var counter = 0;
	var view = "";

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/path_audience_segments?sort_by=audience_vendor_id%2Cname%2Cid&order_by=ascending&only_brain_enabled=false&agency_id=112282&currency_code=USD&q=name%3D%3A*"+search+"*%26audience_vendor_id%3D%3D"+vendor)
		.then(function(xml) { 
			counter = $(xml).find("entities").attr("count");
			console.log(counter);

			callback(count,counter,view);
		});	

		
} */


function post(vendor,search,callback){
	var feedback = "";
	var audience = "";
	//var count = 0;
	//var counter = 0;
	var view = "";

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/path_audience_segments?full=*&sort_by=audience_vendor_id%2Cname%2Cid&order_by=ascending&only_brain_enabled=false&agency_id=112282&currency_code=USD&q=name%3D%3A*"+search+"*%26audience_vendor_id%3D%3D"+vendor)
		.then(function(xml) { 
			//counter = $(xml).find("entities").attr("count");
			//console.log(counter);
			var entry = $(xml).find('entity');
			entry.each(function(){
			id = $(this).attr("id");
			audience = $(this).find('prop[name="full_path"]').attr('value');
			var newchar = '|'
			audience = audience.split(',').join(newchar);
			console.log(audience);
			uniques = $(this).find('prop[name="uniques"]').attr('value');
			console.log(uniques);
			cpm = $(this).find('prop[name="retail_cpm"]').attr('value');
			console.log(cpm);
			//console.log(audience);
			if (uniques != undefined && cpm != undefined){
				view = view + "\n" + id + "," + audience + "," + uniques + "," + cpm ;
			}
			else {
				view = view;
			}
			
			});
			callback(view);
		});	

		
}


//one vendor
/* $("#aud_button").click(function() {	
	var audiences ="";
	var header = "audience, uniques, cpm";
	vendor_list = get_selected_vendors();
	console.log("vendor list:", vendor_list);
	var search = $("#search").val();
	post(vendor_list,search,function(count,counter,audience,uniques,cpm){
		//console.log(audience);
		console.log(count);
		if(counter == count){
		audiences = header + "\n" + audiences + audience + "," + uniques + "," + cpm;
		console.log("madeit");		
		downloadCSV(audiences, { filename: "vendorSearch.csv" });
		}
		else{
			audiences = audiences + audience + "," + uniques + "," + cpm + "\n";
			//console.log(audiences);
		}
	
	});
}) */

//multiple vendors
$("#aud_button").click(function() {	
	var audiences = "";
	var vendor_list = [];
	var header = "audience_id, audience_name, uniques, cpm";
	vendor_list = get_selected_vendors();
	//vendor_list = vendor_list[0]; 
	console.log("vendor list:", vendor_list);
	var search = $("#search").val();
	var counts = 0;
	
	for(var i=0; i<vendor_list.length; i++) {
	post(vendor_list[i],search,function(view){
		counts++;	
		if(counts == vendor_list.length){
		audiences = header + audiences + view;
		console.log("madeit");		
		downloadCSV(audiences, { filename: "vendorSearch.csv" });
		}
		else{
			audiences = audiences + view;
			//console.log(audiences);
		}
	
	});
	}
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

