$(function(){
	var options = [];
	options.push("<option value=BSER>Browser</option>");
	options.push("<option value=CSPD>Connection Speed</option>");
	options.push("<option value=DVCE>Device Type/OS</option>");
	options.push("<option value=ISPX>ISP</option>");
	options.push("<option value=INVT>Inventory Type</option>");

	$("#target_values").append(options);
	$("#target_values").multipleSelect({
	placeholder: "Choose The Thing",
	filter: true
	});	
});

$("#target_values").change(function(){
	technology($(this).val());
});

function technology(ids)
{
	var options = [];
	var aggregate_pages_promises = [];
	var entities = [];

	console.log("empty strat list..");
	$("#technology").empty(); 

	if(!ids){
		console.log("no camps");
		$("#technology").empty();
		$("#technology").multipleSelect({
			placeholder: "Choose Campaigns",
			filter: true
		});	
	}

	else{
		for(var i=0; i<ids.length; i++){
			url = "https://adroit-tools.mediamath.com/t1/api/v2.0/target_values?dimension="+ids[i]+"&sort_by=name";
			console.log(url);
			aggregate_pages_promises.push(aggregate_pages(url));
		}
		Promise.all(aggregate_pages_promises).then(function(xml){
			push_entities_to_multiselect(xml.join(), "#technology");
		});
	}	
}






/* $(function(){
	get_dev();
	get_inv();
	get_cspd();
	get_brwsr();
	get_ispx();
});

function get_dev(){
	console.log("getting devices");
	$("#devices_list").empty(); 
	

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/target_values?dimension=DVCE&sort_by=name")
		.then(function(xml) { push_entities_to_multiselect(xml, "#devices_list")});
}

function get_inv(){
	console.log("getting inv");
	$("#inv_list").empty(); 
	

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/target_values?dimension=INVT&sort_by=name")
		.then(function(xml) { push_entities_to_multiselect(xml, "#inv_list")});
}

function get_cspd(){
	console.log("getting cspd");
	$("#cspd_list").empty(); 
	

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/target_values?dimension=CSPD&sort_by=name")
		.then(function(xml) { push_entities_to_multiselect(xml, "#cspd_list")});
}

function get_brwsr(){
	console.log("getting browsers");
	$("#brwsr_list").empty(); 
	

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/target_values?dimension=BSER&sort_by=name")
		.then(function(xml) { push_entities_to_multiselect(xml, "#brwsr_list")});
}



function get_ispx(){
	console.log("getting ISPs");
	$("#ispx_list").empty(); 
	

	aggregate_pages("https://adroit-tools.mediamath.com/t1/api/v2.0/target_values?dimension=ISPX&sort_by=name")
		.then(function(xml) { push_entities_to_multiselect(xml, "#ispx_list")});
} */