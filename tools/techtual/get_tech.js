$(function(){
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
}