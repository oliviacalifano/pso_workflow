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

function post(vendor,search,callback){
	var feedback = "";
	var audience = "";
	var count = 0;
	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/path_audience_segments?full=*&sort_by=audience_vendor_id%2Cname%2Cid&order_by=ascending&only_brain_enabled=false&agency_id=112282&currency_code=USD&q=name%3D%3A*"+search+"*%26audience_vendor_id%3D%3D"+vendor)
		.then(function(xml) { 
			var counter = $(xml).find("entities").attr("count");
			console.log(counter);
			var entry = $(xml).find('prop[name="full_path"]');
			entry.each(function(){
			count++;
			audience = $(this).attr('value');
			//console.log(audience);
			callback(count,counter,audience);
			});
		});
		
		
}



$("#aud_button").click(function() {	
	var audiences ="";	
	vendor_list = get_selected_vendors();
	console.log("vendor list:", vendor_list);
	var search = $("#search").val();
	post(vendor_list,search,function(count,counter,audience){
		console.log(audience);
		console.log(count);
		if(counter == count){
		audiences = audiences + audience;
		console.log("madeit");		
		downloadCSV(audiences, { filename: "vendorSearch.csv" });
		}
		else{
			audiences = audiences + audience + "\n";
			console.log(audiences);
		}
	
	});
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

